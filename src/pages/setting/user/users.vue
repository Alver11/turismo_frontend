<script setup lang="ts">
import { useViewWrapper } from '/@src/stores/viewWrapper'

const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle('Listado de Usuarios')

useHead({
  title: 'Listado de Usuarios',
})
</script>

<template>
  <div class="page-content-inner">
    <UsersList />
  </div>
</template>
