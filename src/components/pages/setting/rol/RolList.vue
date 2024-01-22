<script setup lang="ts">
import { hasPermission } from '/@src/utils/permissions'

const modalDeleted = ref(false)

</script>

<template>
  <VBreadcrumb
    with-icons
    separator="bullet"
    :items="[
      {
        label: 'Panel Principal',
        hideLabel: true,
        icon: 'feather:home',
        to: '/app',
      },
      {
        label: 'Lista de Roles y Permisos',
      },
    ]"
  />

  <div
    v-if="hasPermission('program create roles')"
    class="list-flex-toolbar flex-list-v1"
  >
    <VButtons>
      <VButton
        to="/setting/rol/create"
        color="primary"
        icon="fas fa-plus"
      >
        Nuevo Rol
      </VButton>
    </VButtons>
  </div>


  <VModal
    title="Eliminar Datos"
    :open="modalDeleted"
    size="small"
    actions="center"
    @close="modalDeleted = false"
  >
    <template #content>
      <VPlaceholderSection
        title="¿Eliminar Registro? "
        subtitle="Los cambios ya no se podran revertir!"
      />
    </template>
    <template #action>
      <VButton
        color="danger"
        raised
      >
        Eliminar
      </VButton>
    </template>
  </VModal>
</template>
