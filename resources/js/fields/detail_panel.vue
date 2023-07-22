<template>
    <div>
        <slot>
            <div class="flex items-center">
                <Heading :level="1" v-text="panel.name" />

                <button
                    v-if="panel.collapsable"
                    @click="toggleCollapse"
                    class="rounded border border-transparent h-6 w-6 ml-1 inline-flex items-center justify-center focus:outline-none focus:ring focus:ring-primary-200"
                    :aria-label="__('Toggle Collapsed')"
                    :aria-expanded="collapsed === false ? 'true' : 'false'"
                >
                    <CollapseButton :collapsed="collapsed" />
                </button>
            </div>

            <p
                v-if="panel.helpText && !collapsed"
                class="text-gray-500 text-sm font-semibold italic"
                :class="panel.helpText ? 'mt-1' : 'mt-3'"
                v-html="panel.helpText"
            />
        </slot>

        <Card
            class="mt-3 py-2 px-6 divide-x divide-gray-100 dark:divide-gray-700 flex"
            v-if="!collapsed && fields.length > 0"
        >
            <div class="width-9/12">
                <component
                    :key="index"
                    v-for="(field, index) in primary"
                    :index="index"
                    :is="resolveComponentName(field)"
                    :resource-name="resourceName"
                    :resource-id="resourceId"
                    :resource="resource"
                    :field="field"
                    @actionExecuted="actionExecuted"
                />
            </div>

            <div class="width-3/12 px-6">
                <component
                    :key="index"
                    v-for="(field, index) in secondary"
                    :index="index"
                    :is="resolveComponentName(field)"
                    :resource-name="resourceName"
                    :resource-id="resourceId"
                    :resource="resource"
                    :field="field"
                    @actionExecuted="actionExecuted"
                />
            </div>

            <div
                v-if="shouldShowShowAllFieldsButton"
                class="-mx-6 border-t border-gray-100 dark:border-gray-700 text-center rounded-b"
            >
                <button
                    type="button"
                    class="block w-full text-sm link-default font-bold py-2 -mb-2"
                    @click="showAllFields"
                >
                    {{ __('Show All Fields') }}
                </button>
            </div>
        </Card>
    </div>
</template>

<script>
import { BehavesAsPanel, Collapsable } from 'laravel-mixins-short'

export default {
    mixins: [Collapsable, BehavesAsPanel],

    data() {
        return {
            primary: [],
            secondary: []
        }
    },

    methods: {
        resolveComponentName(field) {
            return field.prefixComponent
                ? 'detail-' + field.component
                : field.component
        },

        showAllFields() {
            return (this.panel.limit = 0)
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
        localStorageKey() {
            return `nova.panels.${ this.panel.name }.collapsed`
        },

        collapsedByDefault() {
            return this.panel?.collapsedByDefault ?? false
        },

        fields() {
            if (this.panel.limit > 0) {
                return this.panel.fields.slice(0, this.panel.limit)
            }

            return this.panel.fields
        },

        shouldShowShowAllFieldsButton() {
            return this.panel.limit > 0
        },
    },

    mounted() {
        this.divideFields()
    }
}
</script>
