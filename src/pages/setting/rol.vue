<script setup lang="ts">
import { useViewWrapper } from '/@src/stores/viewWrapper'

const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle('Listado de Roles y Permisos')

useHead({
  title: 'Listado de Roles y Permisos',
})
</script>

<template>
  <div class="page-content-inner">
    <RolList />
  </div>
</template>
