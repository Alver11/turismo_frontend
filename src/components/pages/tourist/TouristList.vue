<script setup lang="ts">
import { useApi } from '/@src/composable/useApi'
import { useNotyf } from '/@src/composable/useNotyf'
import { formatError } from '/@src/composable/useError'
import { hasPermission } from '/@src/utils/permissions'
import { ref } from 'vue'

const notify = useNotyf()
const api = useApi()
const modalDeleted = ref(false)
const modalView = ref(false)
const currentImageUrl = ref('')
const idData = ref()
const touristPlace = ref()
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
  { data: 'name', title: 'Nombre de Lugar', typeSearch: 'input' },
  { data: 'address', title: 'Dirección', typeSearch: 'input' },
  { data: 'district.name', title: 'Distrito', typeSearch: 'input' },
  {
    data: 'categories',
    name: 'categories.name',
    title: 'Categoría',
    sorting: false,
    orderable: false,
    typeSearch: 'input',
    searchable: false,
    render: function(data: any, type: any) {
      let rolHtml = ''
      if(data.length > 0) {
        data.forEach((category: any) => {
          if(type === 'display') {
            rolHtml =  rolHtml+'&nbsp;<small class="tag is-info is-rounded">- ' +  category.name + '</small>';
          }
        })
      }
      return rolHtml
    }
  },
]
const buttonTable = [
  { button:'view', permission: 'tourists view'},
  { button:'edit', permission: 'tourists edit'},
  { button:'delete', permission: 'tourists delete'}
]
interface Galery {
  src: string
  thumbnail: string
  w: number
  h: number
}
const items = ref<Galery[]>([])

const emit = defineEmits(['updateTable'])


const updateTableEvent = ref(false)

function handleView(id: number){
  let url = 'tourists/' + id
  api.get(url).then(result => {
    touristPlace.value = result.data
    const selectedOption = result.data.images.find((image: any) => image.front_page == true);
    currentImageUrl.value = 'http://localhost/storage/' + selectedOption.file_path
    if(result.data.images.length > 1) {
      items.value.splice(0, items.value.length)
      result.data.images.forEach((item: any) => {
        if(!item.front_page) {
          const img = new Image()
          img.onload = () => {
            const width = img.width;
            const height = img.height;

            items.value.push({
              src: 'http://localhost/storage/' + item.file_path,
              thumbnail: 'http://localhost/storage/' + item.file_path,
              w: width,
              h: height,
            })
          }
          // Establecer el src de la imagen para cargarla
          img.src = 'http://localhost/storage/' + item.file_path
        }

      })

    }

    modalView.value = true
  })
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

/*const items = [
  {
    src: 'http://via.placeholder.com/1200x900',
    thumbnail: 'http://via.placeholder.com/120x90',
    w: 600,
    h: 400,
  },
  {
    src: 'http://via.placeholder.com/1200x900',
    thumbnail: 'http://via.placeholder.com/120x90',
    w: 600,
    h: 400,
  },
  {
    src: 'http://via.placeholder.com/1200x900',
    thumbnail: 'http://via.placeholder.com/120x90',
    w: 600,
    h: 400,
  },
  {
    src: 'http://via.placeholder.com/1200x900',
    thumbnail: 'http://via.placeholder.com/120x90',
    w: 600,
    h: 400,
  },
  {
    src: 'http://via.placeholder.com/1200x900',
    thumbnail: 'http://via.placeholder.com/120x90',
    w: 600,
    h: 400,
  },
]*/
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
    title="Lugar Turístico"
    :open="modalView"
    size="large"
    noclose
    actions="right"
    @close="modalView = false"
  >
    <template #content>
      <img
        class="img-front-page"
        :src="currentImageUrl"
        alt="port"
      >
      <p class="tourist-title">{{ touristPlace.name }}</p>
      <VPhotosSwipe class="img-gallery" :items="items" thumbnail-radius="5" />
      <div
        v-for="category in touristPlace.categories"
        :key="category.id"
      >
        <VTag
          color="primary"
          :label="category.name"
          rounded
        />
      </div>
      <div>
        <p>Descripción</p>
        <p>{{ touristPlace.description }}</p>
      </div>
    </template>
    <template #action>
      <VButton
        color="primary"
        raised
      >
        Aceptar
      </VButton>
    </template>
  </VModal>

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
<style lang="scss">
.img-front-page {
  max-height: 450px;
  border-radius: 8px;
}
.tourist-title {
  padding: 15px 10px;
  top: 87px;
  background-color: var(--primary--dark-color);
  color: var(--dark-sidebar-dark-12);
  width: auto;
  min-width: 200px;
  position: absolute;
  border-radius: 0 12px 12px 0;
  font: var(--font);
  font-size: var(--vc-text-lg);
}

.img-gallery {
  display: flex;
}
</style>
