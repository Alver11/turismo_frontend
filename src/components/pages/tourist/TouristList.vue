<script setup lang="ts">
import { useApi } from '/@src/composable/useApi'
import { useNotyf } from '/@src/composable/useNotyf'
import { formatError } from '/@src/composable/useError'
import { hasPermission } from '/@src/utils/permissions'
import { phoneFormat } from '/@src/utils/format-number-phone'

const notify = useNotyf()
const api = useApi()
const modalDeleted = ref(false)
const idData = ref()
const columns = [
  { data: 'id', title: 'ID', visible: false},
  {
    data: 'images',
    title: 'Imagen',
    orderable: false,
    searchable: false,
    render: function(data: any, type: any) {
      let imageHtml = '<div class="image-list"><img src="/src/assets/illustrations/images/ImageNotFound.png" alt="Image" /></div>'
      if(data != null && data.length > 0) {
        if(type === 'display') {
          imageHtml =  '<div class="image-list"><img src="http://localhost/storage/' +  data[0].file_path + '" alt="Image" /></div>';
        }
      }
      return imageHtml
    }
  },
  { data: 'name', title: 'Nombre de Usuario', typeSearch: 'input' },
  { data: 'address', title: 'Dirección', typeSearch: 'input' },
]
const buttonTable = [
  { button:'view', permission: 'tourists view'},
  { button:'edit', permission: 'tourists edit'},
  { button:'delete', permission: 'tourists delete'}
]

const emit = defineEmits(['updateTable'])


const updateTableEvent = ref(false)

function handleView(){

}

function handleEdit(id: number){

}

function handleDelete(id: number){
  idData.value = id
  modalDeleted.value = true
}

const DeletedTraining = async () => {
  try {
    updateTableEvent.value = false
    emit('updateTable')
    const res = await api.delete(`/tourists/${idData.value}`)
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
    v-if="hasPermission('tourists create')"
    class="list-flex-toolbar flex-list-v1"
  >
    <VButtons>
      <VButton
        to="/tourist/create"
        color="primary"
        icon="fas fa-plus"
      >
        Nuevo Sitio
      </VButton>
    </VButtons>
  </div>

  <DataTableWrapper
    :columns="columns"
    server-side-url="tourists"
    :update-table-event="updateTableEvent"
    :button-table="buttonTable"
    :search-columns="true"
    @view="handleView"
    @edit="handleEdit"
    @delete="handleDelete"
  />

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
