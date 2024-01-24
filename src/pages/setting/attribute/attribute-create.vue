<script setup lang="ts">
import { useViewWrapper } from '/@src/stores/viewWrapper'

const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle('Crear Atributo')

useHead({
  title: 'Crear Atributo',
})
</script>

<template>
  <div class="page-content-inner">
    <AttributeCreateUpdate />
  </div>
</template>
