<script setup lang="ts">
import { useViewWrapper } from '/@src/stores/viewWrapper'

const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle('Actualizar Lugar Turístico')

useHead({
  title: 'Actualizar Lugar Turístico',
})
</script>

<template>
  <div class="page-content-inner">
    <TouristCreateUpdate />
  </div>
</template>
