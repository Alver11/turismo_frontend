<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useForm, ErrorMessage } from 'vee-validate'
import { string, z as zod } from 'zod'
import { useDarkmode } from '/@src/stores/darkmode'
import { useUserSession } from '/@src/stores/userSession'
import { useNotyf } from '/@src/composable/useNotyf'
import { formatError } from '/@src/composable/useError'
import { authenticateUser } from '/@src/services/modules/user/account'
import { catchFieldError } from '/@src/utils/api/catchFormErrors'
import { toTypedSchema } from '@vee-validate/zod'
import { onMounted } from 'vue'

const darkMode = useDarkmode()
const router = useRouter()
const route = useRoute()
const notify = useNotyf()
const userSession = useUserSession()
const redirect = route.query.redirect as string
const isLoading = ref(false)
const { t } = useI18n()

const validationSchema = toTypedSchema(
  zod.object({
    email: string({
        required_error: t('auth.errors.email.required'),
      })
      .email(t('auth.errors.email.format')),
    password: string({
      required_error: t('auth.errors.password.required'),
    }),
  })
)

const { handleSubmit, isSubmitting, setFieldError } = useForm({
  validationSchema,
  initialValues: {
    email: '',
    password: '',
  },
});

async function onLogin(values: any) {
  if (!isLoading.value) {
    isLoading.value = true;

    try {
      await authenticateUser('login', values);

      if (redirect) {
        await router.push(redirect);
      } else {
        await router.push('/app');
      }

      notify.dismissAll();
      notify.success(`${t('auth.welcome')}, ${userSession.user!.name}`);
    } catch (err) {
      catchFieldError(err, setFieldError);
      notify.error(formatError(err));
    } finally {
      isLoading.value = false;
    }
  }
}

const submitHandler = handleSubmit(onLogin);

onMounted(async () => {
  if(userSession.isLoggedIn){
    await router.push('/app')
  }
})

useHead({
  title: 'Iniciar Sesión - Coordillera en tus manos',
})
</script>

<template>
  <div class="auth-wrapper-inner is-single">
    <!--Fake navigation-->
    <div class="auth-nav">
      <div class="left" />
      <div class="center">
        <RouterLink
          to="/"
          class="header-item"
        >
          <AnimatedLogo
            width="250px"
            height="80px"
          />
        </RouterLink>
      </div>
      <div class="right">
        <label
          class="dark-mode ml-auto"
          tabindex="0"
          role="button"
          @keydown.space.prevent="(e) => (e.target as HTMLLabelElement).click()"
        >
          <input
            data-cy="dark-mode-toggle"
            type="checkbox"
            :checked="!darkMode.isDark"
            @change="darkMode.onChange"
          >
          <span />
        </label>
      </div>
    </div>

    <!--Single Centered Form-->
    <div class="single-form-wrap">
      <div class="inner-wrap">
        <!--Form Title-->
        <div class="auth-head">
          <h2>Sistema de Turismo</h2>
          <p>Cordillera en tus manos!</p>
        </div>

        <!--Form-->
        <div class="form-card">
          <form @submit.prevent="submitHandler">
            <div class="login-form">
              <!-- Username -->

              <VField id="email">
                <VControl icon="feather:user">
                  <VInput
                    type="email"
                    class="input"
                    :placeholder="t('auth.placeholder.email')"
                    autocomplete="email"
                    :disabled="isSubmitting"
                  />
                  <ErrorMessage
                    class="help is-danger"
                    name="email"
                  />
                </VControl>
              </VField>

              <!-- Password -->
              <VField id="password">
                <VControl icon="feather:lock">
                  <VInput
                    type="password"
                    class="input"
                    :placeholder="t('auth.placeholder.password')"
                    autocomplete="email"
                    :disabled="isSubmitting"
                  />
                  <ErrorMessage
                    class="help is-danger"
                    name="password"
                  />
                </VControl>
              </VField>

              <!-- Submit -->
              <div class="login">
                <VButton
                  :loading="isLoading"
                  type="submit"
                  color="primary"
                  bold
                  fullwidth
                  raised
                >
                  Iniciar Sesion
                </VButton>
              </div>
              <div class="or-wrapper position-relative">
                <hr>
                <p>o</p>
              </div>
              <div class="buttons-social">
                <VButton
                  bold
                  raised
                >
                  <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="25" height="25" viewBox="0 0 48 48">
                    <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
                  </svg>
                </VButton>
                <VButton
                  class="btn-facebook"
                  bold
                  raised
                >
                  <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="30" height="30" viewBox="0 0 48 48">
                    <path fill="#3F51B5" d="M42,37c0,2.762-2.238,5-5,5H11c-2.761,0-5-2.238-5-5V11c0-2.762,2.239-5,5-5h26c2.762,0,5,2.238,5,5V37z"></path><path fill="#FFF" d="M34.368,25H31v13h-5V25h-3v-4h3v-2.41c0.002-3.508,1.459-5.59,5.592-5.59H35v4h-2.287C31.104,17,31,17.6,31,18.723V21h4L34.368,25z"></path>
                  </svg>
                </VButton>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.buttons-social{
  display: flex;
  justify-content: center;

  .button {
    margin: 5px;
  }
}
.btn-facebook{
  background-color: rgb(63, 81, 181);
}
.or-wrapper {
  height: 45px;
}
.position-relative {
  position: relative;
}
.or-wrapper hr {
  width: 100%;
  position: absolute;
  top: 2px;
  background-color: #dadce0;
  border: none;
  height: 1px;
}
.or-wrapper p {
  padding: 0 10px;
  background: #fff;
  margin: 0;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
  color: #979797;
  font-size: 14px;
}
</style>
