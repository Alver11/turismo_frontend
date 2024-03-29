<script setup lang="ts">
import { ErrorMessage, useForm } from 'vee-validate'
import { useApi } from '/@src/composable/useApi'
import { useNotyf } from '/@src/composable/useNotyf'
import { onMounted, ref } from 'vue'
import type { RouteParamValue } from 'vue-router'
import { catchFieldError } from '/@src/utils/api/catchFormErrors'
import { toTypedSchema } from '@vee-validate/zod'
import { number, object, string, util, z as zod } from 'zod'
import type Attribute from '/@src/pages/setting/attribute/attribute.vue'
import { useI18n } from 'vue-i18n'
import jsonStringifyReplacer = util.jsonStringifyReplacer

const api = useApi()
const { t } = useI18n()
const router = useRouter()
const route = useRoute()
const notify = useNotyf()
const isLoading = ref(false)
const params = route.params as RouteParams
const districtSelect = ref()
const optionsDistrict = ref([])
const categoriesSelect = ref([])
interface OptionsSelect {
  value: number,
  label: string,
}
const optionsCategories = ref<OptionsSelect[]>([])
const optionsAttribute = ref<OptionsSelect[]>([])
const attributeSelect = ref<number>(0)
const mapDiv = ref<HTMLElement | null>(null)
declare var google: any
let marker: google.maps.Marker | null = null
const draggableMaps = ref(true)
const modalAttribute = ref(false)
const nameAttribute = ref('')
interface Attribute {
  id: number,
  name?: string,
  info: string
}
interface ImageFile {
  file: File
  currentImageUrl: string
  profile: boolean
  imageDimension: {
    width: number
    height: number
  };
}
const imageSelect = ref<ImageFile[]>([])
const attributes = ref<Attribute[]>([])
interface RouteParams { id?: string }
interface userForm {
  name: string,
  address: string,
  description: string,
  district_id: number,
  lat: number,
  lng: number,
  categories: number[],
  attributes: Attribute[]
}

onMounted(async () => {
  try {
    await loadGoogleMapsApi()
    await loadMaps()
    optionsDistrict.value = (await api.get('districts')).data.map((district:any) => ({
      value: district.id,
      label: district.name
    }))
    optionsCategories.value = (await api.get('categories')).data.data.map((category:any) => ({
      value: category.id,
      label: category.name
    }))
    optionsAttribute.value = (await api.get('attributes')).data.data.map((attribute:any) => ({
      value: attribute.id,
      label: attribute.name
    }))
    if (params.id) {
      await getDataUpdate(params.id)
    }
  } catch (error) {
    console.error('Error al cargar los datos', error)
  }
})
const getDataUpdate = async (idValue: string | RouteParamValue[]) => {
  try {
    await api.get(`/tourists/${idValue}`).then(function(res) {
      setFieldValue('name', res.data.name)
      setFieldValue('address', res.data.address)
      setFieldValue('description', res.data.description)
      setFieldValue('lat', parseFloat(res.data.lat))
      setFieldValue('lng', parseFloat(res.data.lng))
      loadMaps()
      districtSelect.value = res.data.district_id
      categoriesSelect.value = res.data.categories.map((category:any) => category.id)
      attributes.value = res.data.attributes.map((attribute:any) => {
        return { 'id': attribute.id, 'name': attribute.name ,'info': attribute.pivot.info }
      })
    })
  } catch (err: any) {
    catchFieldError(err, setFieldError)
  }
}

//------------- Validate Data ------------------------------------------------------------
const validationSchema = toTypedSchema(
  zod.object({
    name: string().min(3, { message : 'El nombre debe contener como mínimo 3 letras'}),
    address: string().min(3, { message : 'La dirección debe contener como mínimo 3 letras'}),
    description: string().nullish(),
    district_id: number().nullish(),
    lat: number().nullish(),
    lng: number().nullish(),
    categories: object({}),
    attributes: object({})
  })
)
type FieldNames = 'name'|'address'|'description'|'district_id'|'lat'|'lng'|'categories'
const { values, handleSubmit, isSubmitting, setFieldError, setFieldValue } =
  useForm<userForm>({
    validationSchema,
    initialValues: {
      name: '',
      address: '',
      description: '',
      lat: parseFloat('-25.292584'),
      lng: parseFloat('-57.578603'),
    }
  }
)

//------------- Save or Update -----------------------------------------------------------
const submitHandler = handleSubmit(onSubmit);
async function onSubmit(values: userForm) {
  if (isLoading.value) return
  isLoading.value = true
  try {
    const formData = new FormData()
    imageSelect.value.forEach((imageFile, index) => {
      formData.append(`images[${index}]`, imageFile.file);
        formData.append(`images[${index}][profile]`, imageFile.profile.toString())
    })
    values.district_id = districtSelect.value
    values.categories = categoriesSelect.value
    values.attributes = attributes.value.map(({ id, info }): Omit<Attribute, 'name'> => {
      return { id, info };
    })
    formData.append('data', JSON.stringify(values))
    const url = params.id ? `tourists/${params.id}` : 'tourists'
    const method = params.id ? api.put : api.post
    const res = await method(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    notify.success(res.data.message)
    router.back()
  } catch (err) {
    handleApiErrors(err)
  } finally {
    isLoading.value = false
  }
}
function handleApiErrors(err: any) {
  if (err?.response?.data?.errors) {
    Object.entries(err.response.data.errors).forEach(([key, messages]) => {
      if (Array.isArray(messages) && messages.length > 0) {
        setFieldError(key as FieldNames, messages[0]);
      }
    });
  }
  notify.error('Error al guardar el formulario');
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
async function loadMaps(){
  if (mapDiv.value) {
    const center = {
      lat: values.lat,
      lng: values.lng,
    }
    const mapOptions = {
      center,
      zoom: 11,
      streetViewControl: false,
      mapTypeControl: false,
    }

    const map = new google.maps.Map(mapDiv.value, mapOptions)
    if(!params.id){
      getUserLocation()
        .then((userLatLng) => {
          marker = createMarker(map, userLatLng)
          map.setCenter(userLatLng)
        })
        .catch((error) => {
          console.error('Error al obtener la ubicación del usuario:', error)
          marker = createMarker(map, center)
          map.setCenter(center)
        })
    }else{
      marker = createMarker(map, center)
      map.setCenter(center)
    }
    if (draggableMaps.value) {
      map.addListener('click', function (event: { latLng: any }) {
        if (marker) {
          marker.setMap(null)
        }
        setFieldValue('lat', event.latLng.lat());
        setFieldValue('lng', event.latLng.lng());
        marker = createMarker(map, event.latLng)
      })
    }
  } else {
    console.error('the element maps no está disposable.')
  }
}
function getUserLocation(): Promise<google.maps.LatLngLiteral> {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.permissions.query({ name: 'geolocation' }).then((result) => {
        //console.log(result.state)
        if (result.state === 'granted' || result.state === 'prompt') {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              setFieldValue('lat', position.coords.latitude);
              setFieldValue('lng', position.coords.longitude);
              const userLatLng: google.maps.LatLngLiteral = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              }
              resolve(userLatLng)
            },
            (error) => {
              reject(error)
            }
          )
        } else if (result.state === 'denied') {
          reject(new Error('El usuario negó el permiso de geolocalización.'))
        }
      })
    } else {
      reject(new Error('La geolocalización no está disponible en este navegador.'))
    }
  })
}
function createMarker(map: google.maps.Map, position: google.maps.LatLngLiteral) {
  const marker = new google.maps.Marker({
    position: position,
    map: map,
    draggable: draggableMaps.value,
  })

  google.maps.event.addListener(
    marker,
    'dragend',
    function (event: { latLng: google.maps.LatLng }) {
      setFieldValue('lat', event.latLng.lat());
      setFieldValue('lng', event.latLng.lng());
    }
  )
  return marker
}

//------------- Add Images ---------------------------------------------------------------
const onFileSelect = (event: Event): void => {
  const input = event.target as HTMLInputElement;
  if (input.files) {
    const files = Array.from(input.files)
    for (let i = 0; i < files.length; i++){
      const file = files[i]
      const fileURL = URL.createObjectURL(file)
      const img = new Image()
      let profileStatus = false
      if(imageSelect.value.length < 1 && i == 0){
        profileStatus = true
      }
      img.onload = () => {
        imageSelect.value.push({
          file: file,
          currentImageUrl: fileURL,
          profile: profileStatus,
          imageDimension: {
            width: img.width,
            height: img.height
          }
        })
      };
      img.src = fileURL
    }
  }
}
const setSelectedProfile = (selectedIndex: number): void => {
  //console.log(selectedIndex)
  imageSelect.value.forEach((image, index) => {
    image.profile = index === selectedIndex
  })
}
const removeFile = (index: number): void => {
  if (index > -1 && index < imageSelect.value.length) {
    const profileStatus = imageSelect.value[index].profile
    imageSelect.value.splice(index, 1);
    if( profileStatus && imageSelect.value.length > 0){
      imageSelect.value[0].profile = true
    }
  }
}

//------------- Add Attributes -----------------------------------------------------------
function addAttribute() {
  const selectedOption = optionsAttribute.value.find(option => option.value === attributeSelect.value);
  const attributeName = selectedOption ? selectedOption.label : '--';
  attributes.value?.push({ id: attributeSelect, name: attributeName, info: nameAttribute.value})
  modalAttribute.value = false
}
function removeAttribute(index: number) {
  attributes.value?.splice(index, 1)
}
watch(modalAttribute, () => {
  if(modalAttribute.value){
    attributeSelect.value = 0
    nameAttribute.value = ''
  }
})

const { y } = useWindowScroll()
const isStuck = computed(() => {
  return y.value > 30
})
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
        to: '/tourist',
      },
      {
        label: params.id ? 'Actualizar lugar Turístico' : 'Nuevo lugar Tturístico',
      },
    ]"
  />

  <form
    class="form-layout is-stacked"
    @submit.prevent="submitHandler"
  >
    <div class="form-outer">
      <div
        :class="[isStuck && 'is-stuck']"
        class="form-header stuck-header"
      >
        <div class="form-header-inner">
          <div class="left">
            <h3 v-if="!params.id">
              Registrar nuevo lugar turístico
            </h3>
            <h3 v-else>
              Editar lugar turístico
            </h3>
          </div>
          <div class="right">
            <div class="buttons">
              <VButton
                to="/tourist"
                icon="lnir lnir-arrow-left rem-100"
                light
                dark-outlined
                :disabled="isSubmitting"
              >
                Cancel
              </VButton>
              <VButton
                v-if="params.id"
                type="submit"
                color="primary"
                raised
              >
                Actualizar
              </VButton>
              <VButton
                v-else
                type="submit"
                color="primary"
                raised
              >
                Guardar
              </VButton>
            </div>
          </div>
        </div>
      </div>
      <div class="form-body">
        <div class="form-section">
          <div class="columns is-multiline">
            <div class="column is-12">
              <VField
                id="name"
                label="Nombre del Lugar Turístico"
              >
                <VControl icon="feather:map">
                  <VInput class="input" />
                  <ErrorMessage
                    class="help is-danger"
                    name="name"
                  />
                </VControl>
              </VField>
              <VField
                id="address"
                label="Dirección"
              >
                <VControl icon="feather:map-pin">
                  <VInput class="input" />
                  <ErrorMessage
                    class="help is-danger"
                    name="address"
                  />
                </VControl>
              </VField>
              <VField
                id="description"
                label="Descripción"
              >
                <VControl>
                  <VTextarea
                    rows="4"
                    placeholder="Agregue una descripción breve del lugar..."
                  />
                  <ErrorMessage
                    class="help is-danger"
                    name="description"
                  />
                </VControl>
              </VField>
              <VField
                id="district_id"
                v-slot="{ id }"
                label="Seleccione el distrito"
                class="is-autocomplete-select"
              >
                <VControl icon="feather:search">
                  <Multiselect
                    v-model="districtSelect"
                    :attrs="{ id }"
                    :options="optionsDistrict"
                    placeholder="Buscar distrito..."
                    :searchable="true"
                  />
                </VControl>
              </VField>
            </div>
            <div class="column is-12">
              <VField
                id="maps"
                label="Ubicación del Lugar"
              >
                <div
                  ref="mapDiv"
                  style="width: 100%; height: 300px"
                />
              </VField>
            </div>
            <div class="column is-12">
              <VField
                v-slot="{ id }"
                label="Seleccione la categoría"
              >
                <VControl>
                  <Multiselect
                    v-model="categoriesSelect"
                    :attrs="{ id }"
                    mode="tags"
                    :searchable="true"
                    :options="optionsCategories"
                    placeholder="Agregue la categoría"
                  />
                </VControl>
              </VField>
            </div>
            <div class="column is-12">
              <VButton
                color="primary"
                @click="modalAttribute = true"
              >
                {{ t('tourist.add.attribute') }}
              </VButton>
            </div>
            <div class="column is-12">
              <VField
                id="maps"
                label="Lista de Atributos"
              >
                <div class="columns is-multiline">
                  <div class="column is-12">
                    <table class="table is-hoverable is-fullwidth">
                      <thead>
                        <tr>
                          <th scope="col">
                            Atributo
                          </th>
                          <th scope="col">
                            Información
                          </th>
                          <th
                            scope="col"
                            class="is-end"
                          >
                            <div class="dark-inverted is-flex is-justify-content-flex-end" />
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr
                          v-for="(attribute, index) in attributes"
                          :key="attribute.id"
                        >
                          <td>{{ attribute.name }}</td>
                          <td>{{ attribute.info }}</td>
                          <td class="is-end">
                            <div class="is-flex is-justify-content-flex-end">
                              <VIconButton
                                color="danger"
                                outlined
                                icon="feather:trash"
                                @click="removeAttribute(index)"
                              />
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div class="column is-12">
                    <VField grouped>
                      <VControl>
                        <div class="file">
                          <label class="file-label">
                            <input
                              class="file-input"
                              accept="image/*"
                              type="file"
                              name="resume"
                              multiple
                              @change="onFileSelect"
                            >
                            <span class="file-cta">
                              <span class="file-icon">
                                <i class="fas fa-cloud-upload-alt" />
                              </span>
                              <span class="file-label"> Agregar Imagenes </span>
                            </span>
                          </label>
                        </div>
                      </VControl>
                    </VField>
                  </div>
                  <div class="column is-12">
                    <div class="form-section-output">
                      <div
                        v-for="(image, index) in imageSelect"
                        :key="index"
                        class="output"
                      >
                        <div
                          class="items"
                        >
                          <VPhotosSwipe
                            thumbnail-radius="5"
                            gallery="#gallery--no-dynamic-import"
                            :items="[
                              {
                                src: image.currentImageUrl,
                                thumbnail: image.currentImageUrl,
                                w: image.imageDimension.width,
                                h: image.imageDimension.height,
                              },
                            ]"
                          />
                        </div>
                        <div class="action">
                          <VRadio
                            v-model="image.profile"
                            :value="true"
                            label="Imagen de Portada"
                            name="outlined_squared_radio"
                            color="info"
                            square
                            @click.prevent="setSelectedProfile(index)"
                          />
                          <VIconButton
                            icon="feather:trash-2"
                            @click.prevent="removeFile(index)"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </VField>
            </div>
          </div>
        </div>
      </div>
    </div>
  </form>

  <VModal
    title="Agregar Atributo"
    :open="modalAttribute"
    size="small"
    actions="center"
    @close="modalAttribute = false"
  >
    <template #content>
      <VField
        label="Seleccione la categoría"
      >
        <VControl>
          <Multiselect
            v-model="attributeSelect"
            :searchable="true"
            :options="optionsAttribute"
            placeholder="Seleccione el atibuto"
          />
        </VControl>
      </VField>
      <VField
        label="Información"
      >
        <VControl>
          <VInput
            v-model="nameAttribute"
            class="input"
          />
        </VControl>
      </VField>
      <p>{{ t('tourist.observation') }}</p>
    </template>
    <template #action>
      <VButton
        color="danger"
        raised
        @click="addAttribute"
      >
        {{ t('buttons.add') }}
      </VButton>
    </template>
  </VModal>
</template>

<style lang="scss">
@import '/src/scss/abstracts/all';
@import '/src/scss/components/forms-outer';

.multiselect-tags {
  padding-left: var(--ms-py, 2.5rem);
}

.control.has-validation.has-error .validation-icon.is-error,
.control.has-validation.has-error .form-icon {
  opacity: 1 !important;
  right: 12px;
}

.image-container {
  border: 1px solid;
  border-radius: var(--radius-large);
  border-color: var(--border);
  padding: 5px;
  margin-bottom: 5px;
}

.my-gallery {
  padding-top: 5px;
}

.form-section-output {
  margin-top: 1.5rem;
  .output {
    width: 100%;
    border-radius: 0.65rem;
    background: var(--white);
    display: flex;
    align-items: center;
    padding: 0 calc(1em - 1px);
    color: var(--dark-text);
    transition: color 0.3s, background-color 0.3s, border 0.3s, box-shadow 0.3s;

    &:not(:last-child) {
      margin-bottom: 3px;
    }

    > svg {
      height: 18px;
      width: 18px;
      margin-right: 0.75rem;
      color: var(--light-text);
    }

    > span {
      font-weight: 500;
      font-family: var(--font), serif;
      color: var(--dark-text);
    }

    .action {
      margin-left: auto;
      display: flex;
      justify-content: flex-end;
      align-items: center;

      button {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 38px;
        width: 38px;
        min-width: 38px;
        background: none;
        border: none;
        padding: 0;
        cursor: pointer;
        border-radius: 0.5rem;
        transition: background-color 0.3s;

        &:hover,
        &:focus {
          background: var(--widget-grey-dark-1);
        }

        svg {
          height: 18px;
          width: 18px;
          stroke-width: 1.5px;
        }
      }
    }
  }
  .items-label {
    display: flex;
    align-items: center;
    width: 70%;
  }
  .items {
    display: flex;
    justify-content: center;
    align-items: center;
    min-width: 100px;
    width: 30%;
    cursor: pointer;
  }
}

.bottom-attach {
  display: flex;
  align-items: end;
  justify-content: end;
}

.is-navbar {
  .form-layout {
    margin-top: 30px;
  }
}

.form-layout {
  max-width: 740px;
  margin: 0 auto;

  &.is-stacked {
    .form-outer {
      .form-body {
        padding: 0;

        .form-section {
          padding: 40px;
          border-bottom: 1px solid var(--fade-grey-dark-4);

          &.is-grey {
            background: #fafafa;
          }

          .form-section-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-bottom: 1px solid var(--fade-grey-dark-4);
            padding-bottom: 20px;
            margin-bottom: 30px;

            .left {
              h3 {
                font-family: var(--font-alt), serif;
                font-weight: 600;
                color: var(--dark-text);
              }
            }
          }

          .form-section-inner {
            &.is-horizontal {
              max-width: 540px;
            }

            .field {
              &.is-horizontal {
                .field-label {
                  padding-top: 0.75em;
                }
              }
            }
          }

          .columns {
            .column {
              padding-top: 0.5rem;
              padding-bottom: 0.5rem;
            }
          }

          .field {
            .control {
              .checkbox {
                padding: 0 10px 0 0;
                font-size: 0.9rem;
              }
            }
          }

          .participants {
            display: flex;
            padding-bottom: 10px;

            .v-avatar {
              margin-right: 8px;
            }

            .add-participant {
              display: flex;
              justify-content: center;
              align-items: center;
              height: 40px;
              width: 40px;
              min-width: 40px;
              border-radius: var(--radius-rounded);
              border: 1.6px dashed var(--light-text);
              color: var(--light-text);
              padding: 0;
              background: none;
              margin-left: 4px;
              cursor: pointer;
              transition: color 0.3s, background-color 0.3s, border-color 0.3s,
              height 0.3s, width 0.3s;

              &:hover,
              &:focus {
                border: 1.6px solid var(--primary);
                color: var(--primary);
              }

              &:focus-visible {
                outline-offset: var(--accessibility-focus-outline-offset);
                outline: var(--accessibility-focus-outline-color)
                var(--accessibility-focus-outline-style)
                var(--accessibility-focus-outline-width);
              }

              svg {
                height: 16px;
                width: 16px;
              }
            }
          }

          .color-codes {
            display: flex;
            align-items: center;
            height: 38px;

            .color-code {
              height: 14px;
              width: 14px;
              border-radius: var(--radius-rounded);
              background: var(--white);
              margin-right: 10px;
              border: 3px solid var(--light-text);
              cursor: pointer;
              opacity: 0.6;
              transition: color 0.3s, background-color 0.3s, border-color 0.3s,
              height 0.3s, width 0.3s;

              &:hover,
              &:focus {
                opacity: 1;
              }

              &:focus-visible {
                outline-offset: var(--accessibility-focus-outline-offset);
                outline: var(--accessibility-focus-outline-color)
                var(--accessibility-focus-outline-style)
                var(--accessibility-focus-outline-width);
              }

              &.is-primary {
                border-color: var(--primary);

                &.is-active {
                  background: var(--primary);
                }
              }

              &.is-secondary {
                border-color: var(--secondary);

                &.is-active {
                  background: var(--secondary);
                }
              }

              &.is-info {
                border-color: var(--info);

                &.is-active {
                  background: var(--info);
                }
              }

              &.is-success {
                border-color: var(--success);

                &.is-active {
                  background: var(--success);
                }
              }

              &.is-purple {
                border-color: var(--purple);

                &.is-active {
                  background: var(--purple);
                }
              }
            }
          }

          .add-link {
            display: inline-block;
            padding: 4px 0;
            font-family: var(--font), serif;
            font-weight: 500;
            font-size: 0.9rem;
            color: var(--primary);
          }
        }
      }
    }
  }
}

.is-dark {
  .form-layout {
    &.is-stacked {
      .form-outer {
        .form-body {
          .form-section {
            border-color: var(--dark-sidebar-light-12);

            &.is-grey {
              background: var(--dark-sidebar-light-4);
            }

            .form-section-header {
              border-color: var(--dark-sidebar-light-12);

              .left {
                h3 {
                  color: var(--dark-dark-text);
                }
              }
            }

            .form-section-inner {
              .add-link {
                color: var(--primary);
              }

              .color-codes {
                .color-code {
                  background: var(--dark-sidebar-light-6);

                  &.is-primary {
                    border-color: var(--primary);
                  }
                }
              }

              .participants {
                .add-participant {
                  &:hover {
                    border: 1.6px solid var(--primary);
                    color: var(--primary);
                  }
                }
              }
            }
          }

          .form-section-output {
            .output {
              background-color: var(--dark-sidebar-light-2) !important;
              border-color: var(--dark-sidebar-light-12) !important;
              color: var(--dark-dark-text);

              > span {
                color: var(--dark-dark-text);
              }

              .action {
                button {
                  &:hover {
                    background: var(--dark-sidebar-light-5);
                  }

                  svg {
                    color: var(--light-text);
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}

@media only screen and (max-width: 767px) {
  .form-layout {
    &.is-stacked {
      .form-outer {
        .form-body {
          .is-vhidden {
            display: none !important;
          }
        }
      }

      .v-calendar-combo {
        margin: 0 !important;

        .column {
          padding-top: 0 !important;
          padding-bottom: 0 !important;

          &:first-child {
            padding-left: 0 !important;
          }

          &:last-child {
            padding-right: 0 !important;
          }
        }
      }
    }
  }
}
</style>
