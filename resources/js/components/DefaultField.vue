<template>
    <div
        v-if="field.visible"
        class="md:flex space-y-2 md:space-y-0 py-5"
        :class="{
            'md:flex-col': fullWidthContent,
            'md:flex-row': !fullWidthContent,
        }"
    >
        <div
            v-if="field.withLabel"
            class="md:mt-2 px-6 md:px-8 py-1"
            :class="!fullWidthContent ? 'md:w-1/5' : 'md:w-full'"
        >
            <label
                :for="labelFor"
                class="inline-block leading-tight"
            >
                <span v-text="fieldLabel" />
                <span
                    v-if="field.required"
                    class="text-red-500 text-sm required"
                    v-text="__('*')"
                />
            </label>
        </div>

        <div
            class="space-y-2 px-6 md:px-8"
            :class="!fullWidthContent ? 'md:w-4/5' : 'md:w-full'"
        >
            <slot name="field" />

            <HelpText class="help-text-error" v-if="showErrors && hasError" v-html="firstError" />

            <HelpText
                class="help-text"
                v-if="shouldShowHelpText"
                v-html="field.helpText"
            />
        </div>
    </div>
</template>

<script>
import { HandlesValidationErrors, mapProps } from 'laravel-nova'

export default {
    mixins: [HandlesValidationErrors],

    props: {
        field: { type: Object, required: true },
        fieldName: { type: String },
        showErrors: { type: Boolean, default: true },
        fullWidthContent: { type: Boolean, default: false },
        labelFor: { default: null },
        ...mapProps(['showHelpText']),
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
    }
}
</script>
