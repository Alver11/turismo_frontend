<script setup lang="ts">
import { useViewWrapper } from '/@src/stores/viewWrapper'

const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle('Crear Usuario')

useHead({
  title: 'Crear Usuario',
})
</script>

<template>
  <div class="page-content-inner">
    <UserCreateUpdate />
  </div>
</template>
