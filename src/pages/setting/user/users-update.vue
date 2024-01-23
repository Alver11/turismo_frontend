<script setup lang="ts">
import { useViewWrapper } from '/@src/stores/viewWrapper'

const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle('Actualizar Usuario')

useHead({
  title: 'Actualizar Usuario',
})
</script>

<template>
  <div class="page-content-inner">
    <UserCreateUpdate />
  </div>
</template>
