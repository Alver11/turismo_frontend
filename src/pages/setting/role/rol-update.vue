<script setup lang="ts">
import { useViewWrapper } from '/@src/stores/viewWrapper'
import RolCreateUpdate from '/@src/components/pages/setting/rol/RolCreateUpdate.vue'

const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle('Actualizar Rol')

useHead({
  title: 'Actualizar Rol',
})
</script>

<template>
  <div class="page-content-inner">
    <RolCreateUpdate />
  </div>
</template>
