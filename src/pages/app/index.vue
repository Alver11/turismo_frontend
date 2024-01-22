<script setup lang="ts">
import { useViewWrapper } from '/@src/stores/viewWrapper'

const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle('Panel Principal')

useHead({
  title: 'Panel Principal - Turismo Cordillera',
})
</script>

<template>
  <div class="page-content-inner">
    <FlightsDashboard />
  </div>
</template>
