<script setup lang="ts">
import { useViewWrapper } from '/@src/stores/viewWrapper'

const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle('Agregar Lugar Turístico')

useHead({
  title: 'Agregar Lugar Turístico',
})
</script>

<template>
  <div class="page-content-inner">
    <TouristCreateUpdate />
  </div>
</template>
