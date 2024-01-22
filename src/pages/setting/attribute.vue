<script setup lang="ts">
import { useViewWrapper } from '/@src/stores/viewWrapper'
import AttributesList from '/@src/components/pages/setting/attributes/AttributesList.vue'

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
