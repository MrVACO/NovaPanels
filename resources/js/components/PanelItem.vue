<template>
    <div
        class="md:space-y-0 py-5 needed-class flex"
        :class="mainClass"
        :dusk="field.attribute"
    >
        <div
            :class="labelClasses"
        >
            <slot>
                <h4 class="font-normal">
                    <span>{{ label }}:</span>
                </h4>
            </slot>
        </div>
        <div
            class="break-all lg:break-words"
            :class="fieldClasses"
        >
            <slot name="value">
                <CopyButton
                    v-if="fieldValue && field.copyable && !shouldDisplayAsHtml"
                    @click.prevent.stop="copy"
                    v-tooltip="__('Copy to clipboard')"
                >
                    <span ref="theFieldValue">
                        {{ fieldValue }}
                    </span>
                </CopyButton>
                
                <p
                    v-else-if="fieldValue && !field.copyable && !shouldDisplayAsHtml"
                    class="flex items-center"
                >
                    {{ fieldValue }}
                </p>
                <div
                    v-else-if="fieldValue && !field.copyable && shouldDisplayAsHtml"
                    v-html="fieldValue"
                />
                <p v-else>&mdash;</p>
            </slot>
        </div>
    </div>
</template>

<script>
import { CopiesToClipboard, FieldValue } from 'laravel-nova'

export default {
    mixins: [CopiesToClipboard, FieldValue],
    
    props: {
        index: {
            type: Number,
            required: true,
        },
        
        field: {
            type: Object,
            required: true,
        },
        
        fieldName: {
            type: String,
            default: '',
        },
    },
    
    methods: {
        copy() {
            this.copyValueToClipboard(this.field.value)
        },
        
        setParentClasses() {
            const first_field = document.querySelector('.needed-class')
            first_field.parentElement.classList.add('flex', 'flex-wrap')
            first_field.parentElement.classList.remove('divide-y', 'divide-gray-100', 'dark:divide-gray-700')
        }
    },
    
    computed: {
        label() {
            return this.fieldName || this.field.name
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
                classes.push('width-3/12')
            else if (
                !this.fullWidthContent && this.field.width >= 10 ||
                !this.fullWidthContent && !this.field.width && !this.field.col
            )
                classes.push('width-2/12')
            
            return classes.join(" ")
        },
        
        fieldClasses() {
            const classes = ['grid', 'content-center']
            
            if (this.fullWidthContent || this.field.col)
                classes.push('width-12/12')
            else if (!this.fullWidthContent && this.field.width <= 4)
                classes.push('width-6/12', 'text-center')
            else if (!this.fullWidthContent && this.field.width > 4 && this.field.width < 10)
                classes.push('width-9/12')
            else if (
                !this.fullWidthContent && this.field.width >= 10 ||
                !this.fullWidthContent && !this.field.width && !this.field.col
            )
                classes.push('width-10/12')
            
            return classes.join(" ")
        }
    },
    
    mounted() {
        this.setParentClasses()
    },
}
</script>
