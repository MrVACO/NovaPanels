<template>
    <div
        v-if="field.visible"
        class="md:space-y-0 py-5 needed-class flex"
        :class="mainClass"
    >
        <div
            v-if="field.withLabel"
            class="px-6 md:px-4 pb-5"
            :class="labelClasses"
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
                ( {{ field.col ? 1 : 0 }} )
            </label>
        </div>

        <div
            class="px-6 md:px-4"
            :class="fieldClasses"
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
            return this.field.width <= 6;
        },

        mainClass() {
            const classes = []

            classes.push(this.fullWidthContent || this.field.col ? 'flex-col' : 'flex-row')
            classes.push(this.field.width ? 'width-' + this.field.width + '/12' : 'width-12/12')

            return classes.join(" ")
        },

        labelClasses() {
            const classes = ['grid', 'content-center']

            if (this.fullWidthContent || this.field.col)
                classes.push('width-12/12')
            else if (!this.fullWidthContent && this.field.width <= 4)
                classes.push('width-6/12', 'text-center')
            else if (!this.fullWidthContent && this.field.width > 4 && this.field.width < 10)
                classes.push('width-4/12')
            else if (
                !this.fullWidthContent && this.field.width >= 10 ||
                !this.fullWidthContent && !this.field.width && !this.field.col
            )
                classes.push('width-3/12')

            return classes.join(" ")
        },

        fieldClasses() {
            const classes = ['grid', 'content-center']

            if (this.fullWidthContent || this.field.col)
                classes.push('width-12/12')
            else if (!this.fullWidthContent && this.field.width <= 4)
                classes.push('width-6/12', 'text-center')
            else if (!this.fullWidthContent && this.field.width > 4 && this.field.width < 10)
                classes.push('width-8/12')
            else if (
                !this.fullWidthContent && this.field.width >= 10 ||
                !this.fullWidthContent && !this.field.width && !this.field.col
            )
                classes.push('width-9/12')

            return classes.join(" ")
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
