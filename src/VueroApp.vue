<script setup lang="ts">
import { initDarkmode } from '/@src/stores/darkmode'
import { useUserSession } from '/@src/stores/userSession'
import { useApi } from '/@src/composable/useApi'

const router = useRouter()
const userSession = useUserSession()
const api = useApi()

initDarkmode()
let timeoutId: ReturnType<typeof setTimeout>

async function resetTimer() {
  clearTimeout(timeoutId)
  if (router.currentRoute.value.fullPath !== '/') {
    timeoutId = setTimeout(async () => {
      const token = userSession.token
      const currentPath = router.currentRoute.value.fullPath;
      await api.post('logout', token)
      await userSession.logoutUser()
      await router.push({ path: '/', query: { redirect: currentPath } })
    }, 60 * 60 * 1000) // 1 hora en milisegundos
  }
}

window.addEventListener('mousemove', resetTimer)
window.addEventListener('keydown', resetTimer)
</script>

<template>
  <div>
    <Suspense>
      <RouterView v-slot="{ Component }">
        <Transition
          name="fade-slow"
          mode="out-in"
        >
          <component :is="Component" />
        </Transition>
      </RouterView>
    </Suspense>
    <ClientOnly>
      <VReloadPrompt app-name="Turismo Cordillera" />
    </ClientOnly>
  </div>
</template>
