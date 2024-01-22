<script setup lang="ts">
import { useViewWrapper } from '/@src/stores/viewWrapper'

const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle('Lugares Turisticos')

useHead({
  title: 'Lugares Turisticos',
})
</script>

<template>
  <div class="page-content-inner">
    <TouristList />
  </div>
</template>
