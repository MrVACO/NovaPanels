<template>
    <div
        v-if="field.visible"
        class="md:space-y-0 py-5 needed-class flex"
        :class="[
            fullWidthContent || checkWidthField ? 'flex-col' : 'flex-row',
            field.width ? 'width-' + field.width + '/12' : 'width-12/12'
        ]"
    >
        <div
            v-if="field.withLabel"
            class="px-4 md:px-4 pb-5"
            :class="[
                fullWidthContent || checkWidthField ? 'width-12/12' : 'width-2/12',
                checkWidthField ? 'text-center' : '',
            ]"
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
            class="px-6 md:px-4"
            :class="[
                fullWidthContent || checkWidthField ? 'width-12/12' : 'width-10/12',
                checkWidthField ? 'text-center' : '',
            ]"
        >
            <slot name="field" />

            <HelpText class="help-text-error" v-if="showErrors && hasError" v-html="firstError" />

            <HelpText class="help-text" v-if="shouldShowHelpText" v-html="field.helpText" />
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

        checkWidthField() {
            return this.field.width < 5;
        }
    },

    mounted() {
        this.setClasses()
    },

    methods: {
        setClasses() {
            const first_field = document.querySelector('.needed-class')
            first_field.parentElement.classList.add('flex', 'flex-wrap')
        }
    }
}
</script>
