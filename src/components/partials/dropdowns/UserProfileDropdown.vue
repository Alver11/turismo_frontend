<script setup lang="ts">
import { useApi } from '/@src/composable/useApi'
import { useUserSession } from '/@src/stores/userSession'
import { useNotyf } from '/@src/composable/useNotyf'
import { formatError } from '/@src/composable/useError'

const api = useApi()
const router = useRouter()
const notify = useNotyf()
const isLoading = ref(false)
const userSession = useUserSession()
const onLogout = async () => {
  if (!isLoading.value) {
    isLoading.value = true

    try {
      await api.post('logout', userSession.token).then(function () {
        router.push('/')
        userSession.logoutUser()
      })
    } catch (err: any) {
      notify.error(formatError(err))
    } finally {
      isLoading.value = false
    }
  }
}
</script>

<template>
  <VDropdown
    right
    spaced
    class="user-dropdown profile-dropdown"
  >
    <template #button="{ toggle }">
      <a
        role="button"
        tabindex="0"
        class="is-trigger dropdown-trigger"
        aria-haspopup="true"
        @keydown.space.prevent="toggle"
        @click="toggle"
      >
        <VAvatar picture="/images/avatars/svg/vuero-1.svg" />
      </a>
    </template>

    <template #content>
      <div class="dropdown-head">
        <VAvatar size="large" picture="/images/avatars/svg/vuero-1.svg" />

        <div class="meta">
          <span>{{ userSession.user?.name }}</span>
          <span>-------------</span>
        </div>
      </div>

      <hr class="dropdown-divider">

      <div class="dropdown-item is-button">
        <VButton
          class="logout-button"
          icon="feather:log-out"
          color="primary"
          role="menuitem"
          raised
          fullwidth
          @click.prevent="onLogout"
        >
          Logout
        </VButton>
      </div>
    </template>
  </VDropdown>
</template>

<style lang="scss">
.dropdown.is-up .dropdown-menu {
  left: -25px !important;
}
</style>
