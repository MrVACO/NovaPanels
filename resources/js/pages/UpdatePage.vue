<template>
    <ResourceUpdate
        :resource-name="resourceName"
        :resource-id="resourceId"
        :via-resource="viaResource"
        :via-resource-id="viaResourceId"
        :via-relationship="viaRelationship"
        :form-unique-id="formUniqueId"
    />
</template>

<script>
import { mapProps } from 'laravel-nova'
import ResourceUpdate from '../views/ResourceUpdate'
import { uid } from 'uid/single'

export default {
    components: {
        ResourceUpdate,
    },
    
    props: mapProps([
        'resourceName',
        'resourceId',
        'viaResource',
        'viaResourceId',
        'viaRelationship',
    ]),
    
    data: () => ({
        formUniqueId: uid(),
    }),
}
</script>
