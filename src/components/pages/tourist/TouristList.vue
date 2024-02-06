<script setup lang="ts">
import { useApi } from '/@src/composable/useApi'
import { useNotyf } from '/@src/composable/useNotyf'
import { formatError } from '/@src/composable/useError'
import { hasPermission } from '/@src/utils/permissions'

const notify = useNotyf()
const api = useApi()
const router = useRouter()
const modalDeleted = ref(false)
const modalView = ref(false)
const currentImageUrl = ref('')
const idData = ref()
const touristPlace = ref()
const touristPlaceName = ref('')
const updateTableEvent = ref(false)
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
          imageHtml =  '<div class="image-list"><img src="'+import.meta.env.VITE_API_BASE_URL + '/storage/' +  data[0].file_path + '" alt="Image" /></div>';
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
interface Gallery {
  src: string
  thumbnail: string
  w: number
  h: number
}
const items = ref<Gallery[]>([])
const mapDiv = ref<HTMLElement | null>(null)
declare var google: any
let marker: google.maps.Marker | null = null
const emit = defineEmits(['updateTable'])

function handleView(id: number){
  let url = 'tourists/' + id
  api.get(url).then(async result => {
    touristPlace.value = result.data
    touristPlaceName.value = result.data.name
    const selectedOption = result.data.images.find((image: any) => image.front_page == true);
    currentImageUrl.value = import.meta.env.VITE_API_BASE_URL + '/storage/' + selectedOption.file_path
    if (result.data.images.length > 1) {
      items.value.splice(0, items.value.length)
      result.data.images.forEach((item: any) => {
        if (!item.front_page) {
          const img = new Image()
          img.onload = () => {
            const width = img.width
            const height = img.height

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
    await loadGoogleMapsApi()
    if (modalView.value && mapDiv.value) {
      await loadMaps(result.data.lat, result.data.lng)
    }
  })
}

//------------- Google Maps --------------------------------------------------------------
const loadGoogleMapsApi = () => {
  return new Promise<void>((resolve, reject) => {
    if (window.google && window.google.maps) {
      resolve()
      return
    }
    window.initMap = () => {
      resolve()
    }

    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDDmEp9TeBUWtHMkgMukAGf8_nnaDFC3HU&callback=initMap`;
    script.async = true
    script.defer = true
    script.onload = () => resolve()
    script.onerror = () => reject()
    document.head.appendChild(script)
  })
}
async function loadMaps(latStr: string, lngStr: string){
  const lat = parseFloat(latStr)
  const lng = parseFloat(lngStr)
  if (mapDiv.value) {
    const center = {
      lat: lat,
      lng: lng,
    }
    const mapOptions = {
      center,
      zoom: 11,
      streetViewControl: false,
      mapTypeControl: false,
    }

    const map = new google.maps.Map(mapDiv.value, mapOptions)
    if (marker) {
      marker.setMap(null)
    }
    marker = createMarker(map, center)
    map.setCenter(center)
  } else {
    console.error('the element maps no está disponible.')
  }
}
function createMarker(map: google.maps.Map, position: google.maps.LatLngLiteral) {
  return new google.maps.Marker({
    position: position,
    map: map,
  })
}

function handleEdit(id: number){
  router.push({
    path: 'tourist/update/'+id
  })
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
    :title="touristPlaceName"
    :open="modalView"
    size="big"
    actions="right"
    @close="modalView = false"
  >
    <template #content>
      <img
        class="img-front-page"
        :src="currentImageUrl"
        alt="port"
      >
      <VPhotosSwipe
        class="img-gallery"
        :items="items"
        thumbnail-radius="5"
      />
      <div class="columns is-multiline">
        <div class="column is-12">
          <VTag
            v-for="category in touristPlace.categories"
            :key="category.id"
            color="info"
            :label="category.name"
            rounded
          />
        </div>
      </div>
      <hr>
      <div class="columns is-multiline">
        <div class="column is-5">
          <div>
            <p class="title-wrap">Descripción</p>
            <p>{{ touristPlace.description }}</p>
          </div>
          <VField v-if="touristPlace.attributes.length > 0">
            <table class="table is-hoverable is-fullwidth">
              <thead>
                <tr>
                  <th scope="col">
                    Atributo
                  </th>
                  <th scope="col">
                    Información
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="attribute in touristPlace.attributes"
                  :key="attribute.id"
                >
                  <td>{{ attribute.name }}</td>
                  <td>{{ attribute.pivot.info }}</td>
                </tr>
              </tbody>
            </table>
          </VField>
        </div>
        <div class="column is-7">
          <VField
            id="maps"
          >
            <div
              ref="mapDiv"
              style="width: 100%; height: 200px"
            />
          </VField>
        </div>
      </div>
    </template>
    <template #action />
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
  top: 87px;
  color: var(--dark-text);
  width: auto;
  min-width: 200px;
  font: var(--font);
  font-size: var(--vc-text-2xl);
  padding-bottom: 10px;
}

.img-gallery {
  display: flex;
}
.gallery-thumbnail a img {
  max-height: 100px;
}

.tag.is-info {
  margin: 2px;
}

.title-wrap {
  font-weight: 500;
}
</style>
