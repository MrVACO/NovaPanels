<template>
    <div v-if="panel.fields.length > 0" v-show="visibleFieldsCount > 0">
        <Heading
            :level="1"
            :class="panel.helpText ? 'mb-2' : 'mb-3'"
            v-text="panel.name"
        />

        <p
            v-if="panel.helpText"
            class="text-gray-500 text-sm font-semibold italic mb-3"
            v-html="panel.helpText"
        />

        <Card class="divide-x divide-gray-100 dark:divide-gray-700 flex">
            <div class="width-9/12">
                <component
                    v-for="(field, index) in primary"
                    :index="index"
                    :key="index"
                    :is="`form-${field.component}`"
                    :errors="validationErrors"
                    :resource-id="resourceId"
                    :resource-name="resourceName"
                    :related-resource-name="relatedResourceName"
                    :related-resource-id="relatedResourceId"
                    :field="field"
                    :via-resource="viaResource"
                    :via-resource-id="viaResourceId"
                    :via-relationship="viaRelationship"
                    :shown-via-new-relation-modal="shownViaNewRelationModal"
                    :form-unique-id="formUniqueId"
                    :mode="mode"
                    @field-shown="handleFieldShown"
                    @field-hidden="handleFieldHidden"
                    @field-changed="$emit('field-changed')"
                    @file-deleted="handleFileDeleted"
                    @file-upload-started="$emit('file-upload-started')"
                    @file-upload-finished="$emit('file-upload-finished')"
                    :show-help-text="showHelpText"
                />
            </div>

            <div class="width-3/12">
                <component
                    v-for="(field, index) in secondary"
                    :index="index"
                    :key="index"
                    :is="`form-${field.component}`"
                    :errors="validationErrors"
                    :resource-id="resourceId"
                    :resource-name="resourceName"
                    :related-resource-name="relatedResourceName"
                    :related-resource-id="relatedResourceId"
                    :field="field"
                    :via-resource="viaResource"
                    :via-resource-id="viaResourceId"
                    :via-relationship="viaRelationship"
                    :shown-via-new-relation-modal="shownViaNewRelationModal"
                    :form-unique-id="formUniqueId"
                    :mode="mode"
                    @field-shown="handleFieldShown"
                    @field-hidden="handleFieldHidden"
                    @field-changed="$emit('field-changed')"
                    @file-deleted="handleFileDeleted"
                    @file-upload-started="$emit('file-upload-started')"
                    @file-upload-finished="$emit('file-upload-finished')"
                    :show-help-text="showHelpText"
                    class="width-3/12"
                />
            </div>
        </Card>
    </div>
</template>

<script>
import { HandlesPanelVisibility, mapProps } from 'laravel-nova'
import DefaultField from "../components/DefaultField";

export default {
    components: { DefaultField },
    mixins: [HandlesPanelVisibility],

    emits: [
        'field-changed',
        'update-last-retrieved-at-timestamp',
        'file-deleted',
        'file-upload-started',
        'file-upload-finished',
    ],

    data() {
        return {
            primary: [],
            secondary: []
        }
    },

    props: {
        ...mapProps(['mode']),
        shownViaNewRelationModal: { type: Boolean, default: false },
        showHelpText: { type: Boolean, default: false },
        panel: { type: Object, required: true },
        name: { default: 'Panel' },
        fields: { type: Array, default: [] },
        formUniqueId: { type: String },
        validationErrors: { type: Object, required: true },
        resourceName: { type: String, required: true },
        resourceId: { type: [Number, String] },
        relatedResourceName: { type: String },
        relatedResourceId: { type: [Number, String] },
        viaResource: { type: String },
        viaResourceId: { type: [Number, String] },
        viaRelationship: { type: String },
    },

    methods: {
        handleFileDeleted() {
            this.$emit('update-last-retrieved-at-timestamp')
        },

        divideFields() {
            const fields = this.panel.fields

            fields.filter(value => {
                if (value.forSecondaryPanel)
                    this.secondary.push(value)
                else
                    this.primary.push(value)
            })
        }
    },

    computed: {
        fieldLabel() {
            if (this.fieldName === '') {
                return ''
            }

            return this.fieldName || this.field.name || this.field.singularLabel
        },

        shouldShowHelpText() {
            return this.showHelpText && this.field.helpText?.length > 0
        },
    },

    mounted() {
        this.divideFields()
    }
}
</script>
