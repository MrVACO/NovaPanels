<template>
    <ResourceDetail
        :resourceName="resourceName"
        :resourceId="resourceId"
        :shouldOverrideMeta="true"
        :shouldEnableShortcut="true"
    />
</template>

<script>
import { mapProps } from 'laravel-nova'
import ResourceDetail from "../views/ResourceDetail";

export default {
    name: 'Detail',
    components: { ResourceDetail },
    props: mapProps(['resourceName', 'resourceId']),
}
</script>
