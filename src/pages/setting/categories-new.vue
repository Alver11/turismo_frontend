<script setup lang="ts">
import { useViewWrapper } from '/@src/stores/viewWrapper'

const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle('Nueva de Categoria')

useHead({
  title: 'Crear nueva Categorias',
})
</script>

<template>
  <div class="page-content-inner">
    <CategoriesNewAndEdit />
  </div>
</template>
