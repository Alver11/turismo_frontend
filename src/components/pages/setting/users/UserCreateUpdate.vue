<script setup lang="ts">
import { ErrorMessage, useForm } from 'vee-validate'
import { useApi } from '/@src/composable/useApi'
import { useNotyf } from '/@src/composable/useNotyf'
import { onMounted, ref } from 'vue'
import type { RouteParamValue } from 'vue-router'
import { catchFieldError } from '/@src/utils/api/catchFormErrors'
import { toTypedSchema } from '@vee-validate/zod'
import {string, z as zod } from 'zod'
import { useI18n } from 'vue-i18n'
import messages from '@intlify/unplugin-vue-i18n/messages'


const api = useApi()
const router = useRouter()
const route = useRoute()
const notify = useNotyf()
const { t } = useI18n()
const isLoading = ref(false)
const selectedFile = ref<File | null>(null);
const imageDimensions = ref()
const currentImageUrl = ref('')
const tagsRoles = ref()
const valueRole = ref([])
interface RouteParams { id?: string }
const params = route.params as RouteParams
const getDataUpdate = async (idValue: string | RouteParamValue[]) => {
  try {
    await api.get(`/users/${idValue}`).then(function(res) {
      setFieldValue('name', res.data.name)
      setFieldValue('email', res.data.email)
      setFieldValue('phone', res.data.phone)
      setFieldValue('profile_path', res.data.profile_path)
      valueRole.value = res.data.roles.map((role:any) => role.id);

      if(res.data.profile_path){
        currentImageUrl.value = 'http://localhost/storage/' + res.data.profile_path
        const img = new Image();
        img.onload = () => {
          // Una vez que la imagen se carga, puedes acceder a sus dimensiones
          const width = img.width;
          const height = img.height;
          imageDimensions.value = { width, height };
        };
        img.src = currentImageUrl.value
      }
    })
  } catch (err: any) {
    catchFieldError(err, setFieldError)
  }
}

//TODO - calcular la dimension se repite, verificar y limpiar el codigo
const onFileSelect = (event: Event): void => {
  const input = event.target as HTMLInputElement;
  if (input && input.files && input.files.length > 0) {
    selectedFile.value = input.files[0];
    //creo la url
    currentImageUrl.value = URL.createObjectURL(input.files[0])

    // Crear un objeto URL para el archivo seleccionado
    const fileURL = URL.createObjectURL(input.files[0]);
    setFieldValue('profile_path', fileURL)

    // Crear un nuevo objeto de imagen y cargar la imagen
    const img = new Image();
    img.onload = () => {
      // Aquí tienes acceso a las dimensiones de la imagen
      const width = img.width;
      const height = img.height;
      imageDimensions.value = { width, height }
      URL.revokeObjectURL(fileURL);
    };
    img.src = fileURL;
  } else {
    selectedFile.value = null;
  }
}

const removeFile = (): void => {
  selectedFile.value = null
  imageDimensions.value = null
  currentImageUrl.value = ''
  setFieldValue('profile_path', '')
}

const validationSchema = toTypedSchema(
  zod.object({
    name: string({
      required_error: 'Nombre de usuario no puede estar vacio'
    }).min(3, { message : 'El nombre debe contener como mínimo 3 letras'}),
    email: string({
      required_error: t('auth.errors.email.required'),
    }).email(t('auth.errors.email.format')),
    profile_path: string().nullish(),
    phone: string().nullish(),
    ...(params.id ? {
      password: string().optional().refine((val) => {
        if (!val) return true
        return val.length >= 8;
      }, {
        message: t('auth.errors.password.length'),
      }),
      password_confirmation: string().optional(),
    } : {
      password: string({
        required_error: t('auth.errors.password.required'),
      })
        .min(8, t('auth.errors.password.length')),
      password_confirmation: string({
        required_error: t('auth.errors.passwordCheck.match'),
      })
    })
  })
    .refine((data) => {
      if (params.id && data.password) {
        return data.password === data.password_confirmation;
      }else if(!params.id){
        return data.password === data.password_confirmation;
      }
      return true
    }, {
      message: t('auth.errors.passwordCheck.match'),
      path: ['password_confirmation'],
    })
)

interface userForm {
  profile_path: string|null,
  name: string|null,
  email: string,
  phone: string,
  password: string,
  roles: object
}

type FieldNames = 'profile_path' | 'name' | 'email' | 'phone' | 'roles'
const { handleSubmit, isSubmitting, setFieldError, setFieldValue } = useForm<userForm>({
  validationSchema,
  initialValues: {
    profile_path: null,
    name: '',
    email: '',
    phone: '',
    password: '',
    roles: {},
  }
});

onMounted(async () => {
  try {
    tagsRoles.value = (await api.get('roles')).data.map((role:any) => ({
      value: role.id,
      label: role.name
    }))
    if (params.id) {
      await getDataUpdate(params.id)
    }
  } catch (error) {
    console.error('Error al cargar los datos', error)
  }
})

const submitHandler = handleSubmit(onSubmit);

//-------------Save or Update ----------------------------
async function onSubmit(values: any) {
  if (!isLoading.value) {
    isLoading.value = true
    try {
      let url
      const formData = new FormData()
      if (selectedFile.value) {
        formData.append(`image`, selectedFile.value)
      } else {
        formData.append(`image`, 'null')
      }
      values.roles = valueRole.value
      formData.append('data', JSON.stringify(values))
      if(params.id) {
        formData.append('_method', 'PUT')
        url = `users/${params.id}`
      } else {
        url = 'users'
      }
      const res = await api.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      notify.success(res.data.message)
      router.back()
    } catch (err: any) {
      if (err && err.response && err.response.data && err.response.data.errors) {
        const errors = err.response.data.errors;
        for (const key in errors) {
          if (errors.hasOwnProperty(key)) {
            const fieldName = key as FieldNames;
            const errorMessage = errors[key][0];
            setFieldError(fieldName, errorMessage);
          }
        }
      }
      notify.error('Error al guardar el formulario');
      isLoading.value = false;
      //notify.error(err.response.data.message)
    } finally {
      isLoading.value = false
    }
  }
}

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
        label: 'Lista de Usuarios',
        to: '/setting/users',
      },
      {
        label: 'Crear Usuario',
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
              Registrar nuevo Usuario
            </h3>
            <h3 v-else>
              Editar datos de Usuario
            </h3>
          </div>
          <div class="right">
            <div class="buttons">
              <VButton
                to="/setting/users"
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
            <div class="column is-3">
              <p>Foto de Perfil</p>
              <div
                v-if="!currentImageUrl"
                class="image-container"
              >
                <img
                  src="/src/assets/illustrations/images/image.png"
                  alt=""
                >
              </div>
              <VPhotosSwipe
                v-if="imageDimensions"
                thumbnail-radius="5"
                :items="[
                  {
                    src: currentImageUrl,
                    thumbnail: currentImageUrl,
                    w: imageDimensions.width,
                    h: imageDimensions.height,
                  },
                ]"
              />
              <VField
                v-if="!currentImageUrl"
                grouped
              >
                <VControl>
                  <div class="file is-primary">
                    <label class="file-label">
                      <input
                        class="file-input"
                        accept="image/*,"
                        type="file"
                        name="resume"
                        @change="onFileSelect"
                      >
                      <span class="file-cta">
                        <span class="file-icon">
                          <i class="fas fa-cloud-upload-alt" />
                        </span>
                        <span class="file-label" />
                      </span>
                    </label>
                  </div>
                </VControl>
              </VField>
              <VIconButton
                v-else
                color="danger"
                light
                raised
                circle
                icon="feather:x"
                @click="removeFile"
              />
            </div>
            <div class="column is-9">
              <VField
                id="name"
                label="Nombre de usuario"
              >
                <VControl icon="feather:user">
                  <VInput class="input" />
                  <ErrorMessage
                    class="help is-danger"
                    name="name"
                  />
                </VControl>
              </VField>
              <VField
                id="email"
                label="Correo Electrónico"
              >
                <VControl icon="feather:mail">
                  <VInput
                    type="email"
                    class="input"
                    autocomplete="email"
                    :disabled="isSubmitting"
                  />
                  <ErrorMessage
                    class="help is-danger"
                    name="email"
                  />
                </VControl>
              </VField>
              <VField
                id="phone"
                label="Número de Celular"
              >
                <VControl icon="feather:phone">
                  <VInput class="input" />
                  <ErrorMessage
                    class="help is-danger"
                    name="phone"
                  />
                </VControl>
              </VField>
              <VField
                id="password"
                label="Contraseña"
              >
                <VControl icon="feather:lock">
                  <VInput type="password" class="input" />
                  <ErrorMessage
                    class="help is-danger"
                    name="password"
                  />
                </VControl>
              </VField>
              <VField
                id="password_confirmation"
                label="Repite la Contraseña"
              >
                <VControl icon="feather:lock">
                  <VInput type="password" class="input" />
                  <ErrorMessage
                    class="help is-danger"
                    name="password_confirmation"
                  />
                </VControl>
              </VField>
            </div>
            <div class="column is-12">
              <VField
                id="roles"
                v-slot="{ id }"
                label="Rol del Usuario"
              >
                <VControl>
                  <Multiselect
                    v-model="valueRole"
                    :attrs="{ id }"
                    mode="tags"
                    :searchable="true"
                    :create-tag="true"
                    :options="tagsRoles"
                    placeholder="Agregar Roles"
                  />
                  <ErrorMessage
                    class="help is-danger"
                    name="roles"
                  />
                </VControl>
              </VField>
            </div>
          </div>
        </div>
      </div>
    </div>
  </form>
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
