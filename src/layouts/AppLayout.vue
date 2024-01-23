<script setup lang="ts">
import type { SideblockTheme } from '/@src/components/navigation/desktop/Sideblock.vue'
import { usePanels } from '/@src/stores/panels'
import { useViewWrapper } from '/@src/stores/viewWrapper'
import { useUserSession } from '/@src/stores/userSession'
import { hasPermission } from '/@src/utils/permissions'

const props = withDefaults(
  defineProps<{
    theme?: SideblockTheme
    defaultSideblock?: string
    closeOnChange?: boolean
    openOnMounted?: boolean
    nowrap?: boolean
  }>(),
  {
    defaultSideblock: 'dashboard',
    theme: 'default',
  }
)

const viewWrapper = useViewWrapper()
const panels = usePanels()
const route = useRoute()
const openSideblockLinks = ref(route.name.split('/')[0])
const isMobileSideblockOpen = ref(false)
const isDesktopSideblockOpen = ref(true) //ref(props.openOnMounted)
const activeMobileSubsidebar = ref(props.defaultSideblock)
const userSession = useUserSession()

/**
 * watchPostEffect callback will be executed each time dependent reactive values has changed
 */
watchPostEffect(() => {
  viewWrapper.setPushedBlock(isDesktopSideblockOpen.value ?? false)
})
onMounted(() => {
  viewWrapper.setPushed(false)
})
watch(
  () => route.fullPath,
  () => {
    if (openSideblockLinks.value != route.name.split('/')[0]) {
      openSideblockLinks.value = ''
    }
    isMobileSideblockOpen.value = false
    if (props.closeOnChange && isDesktopSideblockOpen.value) {
      isDesktopSideblockOpen.value = false
    }
  }
)
</script>

<template>
  <div class="sidebar-layout">
    <div class="app-overlay" />

    <!-- Mobile navigation -->
    <MobileNavbar
      :is-open="isMobileSideblockOpen"
      @toggle="isMobileSideblockOpen = !isMobileSideblockOpen"
    >
      <template #brand>
        <RouterLink
          to="/"
          class="navbar-item is-brand"
        >
          <AnimatedLogo
            width="150px"
            height="40px"
          />
        </RouterLink>

        <div class="brand-end">
          <UserProfileDropdown />
        </div>
      </template>
    </MobileNavbar>

    <!-- Mobile sidebar links -->
    <!--<MobileSidebar
      :is-open="isMobileSideblockOpen"
      @toggle="isMobileSideblockOpen = !isMobileSideblockOpen"
    >
      <template #links>
        <li>
          <a
            :class="[activeMobileSubsidebar === 'dashboard' && 'is-active']"
            aria-label="Display dashboard content"
            tabindex="0"
            role="button"
            @keydown.space.prevent="activeMobileSubsidebar = 'dashboard'"
            @click="activeMobileSubsidebar = 'dashboard'"
          >
            <i
              aria-hidden="true"
              class="iconify"
              data-icon="feather:activity"
            />
          </a>
        </li>
        <li>
          <a
            aria-label="Display layout content"
            :class="[activeMobileSubsidebar === 'layout' && 'is-active']"
            tabindex="0"
            role="button"
            @keydown.space.prevent="activeMobileSubsidebar = 'layout'"
            @click="activeMobileSubsidebar = 'layout'"
          >
            <i
              aria-hidden="true"
              class="iconify"
              data-icon="feather:grid"
            />
          </a>
        </li>
        <li>
          <a
            aria-label="Display element content"
            :class="[activeMobileSubsidebar === 'elements' && 'is-active']"
            tabindex="0"
            role="button"
            @keydown.space.prevent="activeMobileSubsidebar = 'elements'"
            @click="activeMobileSubsidebar = 'elements'"
          >
            <i
              aria-hidden="true"
              class="iconify"
              data-icon="feather:box"
            />
          </a>
        </li>
        <li>
          <a
            aria-label="Display components content"
            :class="[activeMobileSubsidebar === 'components' && 'is-active']"
            tabindex="0"
            role="button"
            @keydown.space.prevent="activeMobileSubsidebar = 'components'"
            @click="activeMobileSubsidebar = 'components'"
          >
            <i
              aria-hidden="true"
              class="iconify"
              data-icon="feather:cpu"
            />
          </a>
        </li>
        <li>
          <RouterLink to="/messaging-v1">
            <i
              aria-hidden="true"
              class="iconify"
              data-icon="feather:message-circle"
            />
          </RouterLink>
        </li>
      </template>

      <template #bottom-links>
        <li>
          <a
            aria-label="Display search panel"
            tabindex="0"
            role="button"
            @keydown.space.prevent="panels.setActive('search')"
            @click="panels.setActive('search')"
          >
            <i
              aria-hidden="true"
              class="iconify"
              data-icon="feather:search"
            />
          </a>
        </li>
        <li>
          <a
            aria-label="View settings"
            href="#"
          >
            <i
              aria-hidden="true"
              class="iconify"
              data-icon="feather:settings"
            />
          </a>
        </li>
      </template>
    </MobileSidebar> -->

    <!-- Mobile subsidebar links -->
    <!--<Transition name="slide-x">
      <LayoutsMobileSubsidebar
        v-if="isMobileSideblockOpen && activeMobileSubsidebar === 'layout'"
      />
      <DashboardsMobileSubsidebar
        v-else-if="isMobileSideblockOpen && activeMobileSubsidebar === 'dashboard'"
      />
      <ComponentsMobileSubsidebar
        v-else-if="isMobileSideblockOpen && activeMobileSubsidebar === 'components'"
      />
      <ElementsMobileSubsidebar
        v-else-if="isMobileSideblockOpen && activeMobileSubsidebar === 'elements'"
      />
    </Transition> -->

    <!-- Desktop navigation -->
    <!--<CircularMenu />-->

    <Transition name="slide-x">
      <Sideblock
        v-if="isDesktopSideblockOpen"
        :theme="props.theme"
      >
        <template #header>
          <RouterLink
            to="/"
            class="sidebar-block-logo"
          >
            <AnimatedLogo width="200px" />
          </RouterLink>
        </template>
        <template #links>
          <li class="divider" />
          <li>
            <RouterLink
              to="/app"
              class="single-link"
            >
              <span class="icon">
                <i
                  class="iconify"
                  data-icon="feather:grid"
                />
              </span>
              Panel Principal
            </RouterLink>
          </li>
          <li>
            <RouterLink
              to="/tourist"
              class="single-link"
            >
              <span class="icon">
                <i
                  class="iconify"
                  data-icon="feather:map"
                />
              </span>
              Lugares Turisticos
            </RouterLink>
          </li>
          <li v-if="hasPermission('program events')">
            <RouterLink
              to="/events"
              class="single-link"
            >
              <span class="icon">
                <i
                  class="iconify"
                  data-icon="feather:calendar"
                />
              </span>
              Noticias/Eventos
            </RouterLink>
          </li>
          <VCollapseLinks
            v-if="hasPermission('module setting')"
            v-model:open="openSideblockLinks"
            collapse-id="setting"
          >
            <template #header>
              <div class="icon">
                <i
                  aria-hidden="true"
                  class="iconify"
                  data-icon="feather:sliders"
                />
              </div>
              Ajustes
              <i
                aria-hidden="true"
                class="iconify rtl-hidden"
                data-icon="feather:chevron-right"
              />
            </template>
            <RouterLink
              to="/setting/categories"
              class="is-submenu"
            >
              <i
                class="lnil lnil-cubes"
                aria-hidden="true"
              />
              <span>Categorías</span>
            </RouterLink>
            <RouterLink
              to="/setting/attributes"
              class="is-submenu"
            >
              <i
                class="lnil lnil-layers-alt-"
                aria-hidden="true"
              />
              <span>Atributos</span>
            </RouterLink>
            <RouterLink
              permission="program roles"
              to="/setting/rol"
              class="is-submenu"
            >
              <i
                class="lnil lnil-control-panel"
                aria-hidden="true"
              />
              <span>Roles/Permisos</span>
            </RouterLink>
            <RouterLink
              v-if="hasPermission('program users')"
              to="/setting/users"
              class="is-submenu"
            >
              <i
                class="lnil lnil-users-alt"
                aria-hidden="true"
              />
              <span>Usuarios</span>
            </RouterLink>
          </VCollapseLinks>
        </template>
        <template #bottom-links>
          <UserProfileDropdown up />
        </template>
      </Sideblock>
    </Transition>

    <!--<LanguagesPanel />-->
    <!--<ActivityPanel />
    <SearchPanel />
    <TaskPanel />-->

    <VViewWrapper full>
      <VPageContentWrapper>
        <template v-if="props.nowrap">
          <slot />
        </template>
        <VPageContent
          v-else
          class="is-relative"
        >
          <div class="page-title has-text-centered">
            <div
              class="vuero-hamburger nav-trigger push-resize"
              tabindex="0"
              role="button"
              @keydown.space.prevent="isDesktopSideblockOpen = !isDesktopSideblockOpen"
              @click="isDesktopSideblockOpen = !isDesktopSideblockOpen"
            >
              <span class="menu-toggle has-chevron">
                <span
                  :class="[isDesktopSideblockOpen && 'active']"
                  class="icon-box-toggle"
                >
                  <span class="rotate">
                    <i
                      aria-hidden="true"
                      class="icon-line-top"
                    />
                    <i
                      aria-hidden="true"
                      class="icon-line-center"
                    />
                    <i
                      aria-hidden="true"
                      class="icon-line-bottom"
                    />
                  </span>
                </span>
              </span>
            </div>

            <div class="title-wrap">
              <h1 class="title is-4">
                {{ viewWrapper.pageTitle }}
              </h1>
            </div>

            <Toolbar class="desktop-toolbar">
              <!--<ToolbarNotification /> -->

              <!--<a
                class="toolbar-link right-panel-trigger"
                aria-label="View activity panel"
                tabindex="0"
                role="button"
                @keydown.space.prevent="panels.setActive('activity')"
                @click="panels.setActive('activity')"
              >
                <i
                  aria-hidden="true"
                  class="iconify"
                  data-icon="feather:grid"
                />
              </a>-->
            </Toolbar>
          </div>

          <slot />
        </VPageContent>
      </VPageContentWrapper>
    </VViewWrapper>
  </div>
</template>
