<script setup lang="ts">
import { useViewWrapper } from '/@src/stores/viewWrapper'

const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle('Listado de Categorias')

useHead({
  title: 'Listado de Categorias',
})
</script>

<template>
  <div class="page-content-inner">
    <CategoriesList />
  </div>
</template>
