<script setup lang="ts">
import { useApi } from '/@src/composable/useApi'
import { useNotyf } from '/@src/composable/useNotyf'
import { formatError } from '/@src/composable/useError'
import { hasPermission } from '/@src/utils/permissions'

const notify = useNotyf()
const api = useApi()
const router = useRouter()
const modalDeleted = ref(false)
const idData = ref(null)

const columns = [
  { data: 'id', title: 'ID',visible: false, typeSearch: 'input'},
  {
    data: 'images',
    title: 'Image',
    searchable: false,
    render: function(data: any, type: any) {
      let imageHtml = '<div class="image-list"><img src="/src/assets/illustrations/images/ImageNotFound.png" alt="Image" /></div>'
      data.forEach((image: any) => {
        if(type === 'display') {
          imageHtml =  '<div class="image-list"><img src="'+import.meta.env.VITE_API_BASE_URL+'/storage/' +  image.file_path + '" alt="Image" /></div>';
        }
      })
        return imageHtml
    }
  },
  { data: 'name', title: 'Categoría', typeSearch: 'select' },
]
//sorting --- desabilitar el orden
//searchable --- desabilita la busqueda
//typeSearch pueden ser "input" "select"
//visible: false --- para ocultar la columna


const emit = defineEmits(['updateTable'])
const buttonTable = [
  { button:'edit', permission: 'categories edit'},
  { button:'delete', permission: 'categories delete'}
]


const handleEdit = (id: number) => {
  router.push({
    name: 'setting/categories/update',
    params: { id },
  })
}

const handleDelete = (data: any) => {
  idData.value = data
  modalDeleted.value = true
}

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
        label: 'Lista de Categorias',
      },
    ]"
  />

  <div
    v-if="hasPermission('categories create')"
    class="list-flex-toolbar flex-list-v1"
  >
    <VButtons>
      <VButton
        to="/setting/categories/create"
        color="primary"
        icon="fas fa-plus"
      >
        Nueva Categoría
      </VButton>
    </VButtons>
  </div>

  <DataTableWrapper
    :columns="columns"
    server-side-url="categories"
    :update-table-event="updateTableEvent"
    :button-table="buttonTable"
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
