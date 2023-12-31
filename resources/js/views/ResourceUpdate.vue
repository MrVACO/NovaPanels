<template>
    <LoadingView :loading="loading">
        <template v-if="resourceInformation">
            <Head v-if="panels" :title="panels[0].name" />
            <Head v-else :title="__('Update :resource: :title', {resource: '', title: title})" />
        </template>
        
        <form
            v-if="panels"
            @submit="submitViaUpdateResource"
            @change="onUpdateFormStatus"
            :data-form-unique-id="formUniqueId"
            autocomplete="off"
            ref="form"
            class="space-y-8"
        >
            <div
                class="flex"
            >
                <component
                    v-for="(panel, key) in panels"
                    :key="panel.id"
                    :is="'form-' + panel.component"
                    @update-last-retrieved-at-timestamp="updateLastRetrievedAtTimestamp"
                    @file-deleted="handleFileDeleted"
                    @field-changed="onUpdateFormStatus"
                    @file-upload-started="handleFileUploadStarted"
                    @file-upload-finished="handleFileUploadFinished"
                    :panel="panel"
                    :name="panel.name"
                    :resource-id="resourceId"
                    :resource-name="resourceName"
                    :fields="panel.fields"
                    :form-unique-id="formUniqueId"
                    mode="form"
                    :validation-errors="validationErrors"
                    :via-resource="viaResource"
                    :via-resource-id="viaResourceId"
                    :via-relationship="viaRelationship"
                    :show-help-text="true"
                    class="px-2 py-2"
                    :class="{
                        'width-9/12': panel.forPrimaryPanel,
                        'width-3/12': panel.forSecondaryPanel,
                        'w-full': panels.length === 1
                    }"
                />
            </div>
            
            <div
                class="flex flex-col md:flex-row md:items-center justify-center md:justify-end space-y-2 md:space-y-0 space-x-3"
            >
                <Button
                    dusk="cancel-update-button"
                    variant="ghost"
                    :label="__('Cancel')"
                    @click="cancelUpdatingResource"
                    :disabled="isWorking"
                />
                
                <Button
                    dusk="update-and-continue-editing-button"
                    @click="submitViaUpdateResourceAndContinueEditing"
                    :disabled="isWorking"
                    :loading="wasSubmittedViaUpdateResourceAndContinueEditing"
                    :label="__('Update & Continue Editing')"
                />
                
                <Button
                    dusk="update-button"
                    type="submit"
                    :disabled="isWorking"
                    :loading="wasSubmittedViaUpdateResource"
                    :label="__('Update')"
                />
            </div>
        </form>
    </LoadingView>
</template>

<script>
import each from 'lodash/each'
import tap from 'lodash/tap'
import { HandlesFormRequest, HandlesUploads, mapProps, PreventsFormAbandonment } from 'laravel-nova'
import { InteractsWithResourceInformation } from 'laravel-mixins-short'
import { uid } from 'uid/single'
import { Button } from 'laravel-nova-ui'

export default {
    mixins: [HandlesFormRequest, HandlesUploads, PreventsFormAbandonment, InteractsWithResourceInformation],
    
    components: {
        Button,
    },
    
    provide() {
        return {
            removeFile: this.removeFile,
        }
    },
    
    props: mapProps([
        'resourceName',
        'resourceId',
        'viaResource',
        'viaResourceId',
        'viaRelationship',
    ]),
    
    data: () => ({
        relationResponse: null,
        loading: true,
        submittedViaUpdateResourceAndContinueEditing: false,
        submittedViaUpdateResource: false,
        title: null,
        fields: [],
        panels: [],
        lastRetrievedAt: null,
        formUniqueId: uid(),
    }),
    
    async created() {
        if (Nova.missingResource(this.resourceName)) return Nova.visit('/404')
        
        if (this.isRelation) {
            const {data} = await Nova.request().get(
                `/nova-api/${this.viaResource}/field/${this.viaRelationship}`,
                {params: {relatable: true}}
            )
            this.relationResponse = data
        }
        
        await this.getFields()
        this.updateLastRetrievedAtTimestamp()
        this.allowLeavingForm()
    },
    
    methods: {
        handleFileDeleted() {
        },
        
        removeFile(attribute) {
            const {resourceName, resourceId} = this
            
            Nova.request().delete(
                `/nova-api/${resourceName}/${resourceId}/field/${attribute}`
            )
        },
        
        handleResourceLoaded() {
            this.loading = false
            
            Nova.$emit('resource-loaded', {
                resourceName: this.resourceName,
                resourceId: this.resourceId.toString(),
                mode: 'update',
            })
        },
        
        async getFields() {
            this.loading = true
            
            this.panels = []
            this.fields = []
            
            const {
                data: {title, panels, fields},
            } = await Nova.request()
                .get(
                    `/nova-api/${this.resourceName}/${this.resourceId}/update-fields`,
                    {
                        params: {
                            editing: true,
                            editMode: 'update',
                            viaResource: this.viaResource,
                            viaResourceId: this.viaResourceId,
                            viaRelationship: this.viaRelationship,
                        },
                    }
                )
                .catch(error => {
                    if (error.response.status === 404) {
                        Nova.visit('/404')
                    }
                })
            
            this.title = title
            this.panels = panels
            this.fields = fields
            
            this.handleResourceLoaded()
        },
        
        async submitViaUpdateResource(e) {
            e.preventDefault()
            this.submittedViaUpdateResource = true
            this.submittedViaUpdateResourceAndContinueEditing = false
            this.allowLeavingForm()
            await this.updateResource()
        },
        
        async submitViaUpdateResourceAndContinueEditing(e) {
            e.preventDefault()
            this.submittedViaUpdateResourceAndContinueEditing = true
            this.submittedViaUpdateResource = false
            this.allowLeavingForm()
            await this.updateResource()
        },
        
        cancelUpdatingResource() {
            this.handleProceedingToPreviousPage()
            this.allowLeavingForm()
            
            this.proceedToPreviousPage(
                this.isRelation
                    ? `/resources/${this.viaResource}/${this.viaResourceId}`
                    : `/resources/${this.resourceName}/${this.resourceId}`
            )
        },
        
        async updateResource() {
            this.isWorking = true
            
            if (this.$refs.form.reportValidity()) {
                try {
                    const {
                        data: {redirect, id},
                    } = await this.updateRequest()
                    
                    Nova.success(this.__('The :resource was updated!', {
                        // resource: this.resourceInformation.singularLabel.toLowerCase()
                        resource: ''
                    }))
                    
                    Nova.$emit('resource-updated', {
                        resourceName: this.resourceName,
                        resourceId: id,
                    })
                    
                    await this.updateLastRetrievedAtTimestamp()
                    
                    if (this.submittedViaUpdateResource) {
                        Nova.visit(redirect)
                    } else {
                        if (id !== this.resourceId) {
                            Nova.visit(`/resources/${this.resourceName}/${id}/edit`)
                        } else {
                            window.scrollTo(0, 0)
                            
                            this.disableNavigateBackUsingHistory()
                            
                            await this.getFields()
                            
                            this.resetErrors()
                            this.submittedViaUpdateResource = false
                            this.submittedViaUpdateResourceAndContinueEditing = false
                            this.isWorking = false
                        }
                        
                        return
                    }
                } catch (error) {
                    window.scrollTo(0, 0)
                    
                    this.submittedViaUpdateResource = false
                    this.submittedViaUpdateResourceAndContinueEditing = false
                    
                    this.preventLeavingForm()
                    
                    this.handleOnUpdateResponseError(error)
                }
            }
            
            this.submittedViaUpdateResource = false
            this.submittedViaUpdateResourceAndContinueEditing = false
            this.isWorking = false
        },
        
        updateRequest() {
            return Nova.request().post(
                `/nova-api/${this.resourceName}/${this.resourceId}`,
                this.updateResourceFormData(),
                {
                    params: {
                        viaResource: this.viaResource,
                        viaResourceId: this.viaResourceId,
                        viaRelationship: this.viaRelationship,
                        editing: true,
                        editMode: 'update',
                    },
                }
            )
        },
        
        updateResourceFormData() {
            return tap(new FormData(), formData => {
                each(this.panels, panel => {
                    each(panel.fields, field => {
                        field.fill(formData)
                    })
                })
                
                formData.append('_method', 'PUT')
                formData.append('_retrieved_at', this.lastRetrievedAt)
            })
        },
        
        updateLastRetrievedAtTimestamp() {
            this.lastRetrievedAt = Math.floor(new Date().getTime() / 1000)
        },
        
        onUpdateFormStatus() {
            this.updateFormStatus()
        },
    },
    
    computed: {
        wasSubmittedViaUpdateResourceAndContinueEditing() {
            return this.isWorking && this.submittedViaUpdateResourceAndContinueEditing
        },
        
        wasSubmittedViaUpdateResource() {
            return this.isWorking && this.submittedViaUpdateResource
        },
        
        singularName() {
            if (this.relationResponse) {
                return this.relationResponse.singularLabel
            }
            
            return this.resourceInformation.singularLabel
        },
        
        isRelation() {
            return Boolean(this.viaResourceId && this.viaRelationship)
        },
    },
}
</script>
