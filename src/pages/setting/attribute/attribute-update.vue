<script setup lang="ts">
import { useViewWrapper } from '/@src/stores/viewWrapper'

const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle('Editar Atributo')

useHead({
  title: 'Editar Atributo',
})
</script>

<template>
  <div class="page-content-inner">
    <AttributeCreateUpdate />
  </div>
</template>
