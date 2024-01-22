<script setup lang="ts">
import { useApi } from '/@src/composable/useApi'
import { useNotyf } from '/@src/composable/useNotyf'
import { formatError } from '/@src/composable/useError'
import { hasPermission } from '/@src/utils/permissions'

const notify = useNotyf()
const api = useApi()
const modalDeleted = ref(false)
const idData = ref(null)


const emit = defineEmits(['updateTable'])


const updateTableEvent = ref(false)

const DeletedTraining = async () => {
  try {
    updateTableEvent.value = false
    emit('updateTable')
    const res = await api.delete(`/categories/${idData.value}`)
    modalDeleted.value = false
    updateTableEvent.value = true
    emit('updateTable')
    if(res.status == 200){
      notify.success(`Datos eliminados Correctamente!`)
    }else{
      notify.error(res.data.message)
    }


  } catch (err: any) {
    modalDeleted.value = false
    notify.error(formatError(err))
  }
}
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
        label: 'Lista de Lugares Turísticos',
      },
    ]"
  />

  <div
    v-if="hasPermission('program create tourist')"
    class="list-flex-toolbar flex-list-v1"
  >
    <VButtons>
      <VButton
        to="/setting/attributes/create"
        color="primary"
        icon="fas fa-plus"
      >
        Nuevo Atributo
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
        @click="DeletedTraining()"
      >
        Eliminar
      </VButton>
    </template>
  </VModal>
</template>
