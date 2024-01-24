<script setup lang="ts">
import { useViewWrapper } from '/@src/stores/viewWrapper'

const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle('Listado de Atributos')

useHead({
  title: 'Listado de Atributos',
})
</script>

<template>
  <div class="page-content-inner">
    <AttributesList />
  </div>
</template>
