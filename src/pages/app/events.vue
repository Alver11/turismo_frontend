<script setup lang="ts">
import { useViewWrapper } from '/@src/stores/viewWrapper'

const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle('Noticias - Eventos')

useHead({
  title: 'Noticias - Eventos',
})
</script>

<template>
  <div class="page-content-inner">
    <EventsList />
  </div>
</template>
