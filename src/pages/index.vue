<!--<script setup lang="ts">-->
<!--useHead({-->
<!--  title: 'Vuero - A complete Vue 3 design system',-->
<!--})-->
<!--</script>-->

<!--<template>-->
<!--  <LandingLayout theme="light">-->
<!--    <div class="landing-page-wrapper">-->
<!--      &lt;!&ndash; Hero and Navbar &ndash;&gt;-->
<!--      <div-->
<!--        id="Vuero-marketing"-->
<!--        class="hero marketing-hero is-left is-fullheight"-->
<!--      >-->
<!--        &lt;!&ndash; Navbar partial &ndash;&gt;-->
<!--        <LandingEmptyNavigation />-->

<!--        &lt;!&ndash;Hexagon shapes&ndash;&gt;-->
<!--        <img-->
<!--          class="hexagon hexagon-1 light-image-l"-->
<!--          src="/images/icons/hexagons/accent.svg"-->
<!--          alt=""-->
<!--        >-->
<!--        <img-->
<!--          class="hexagon hexagon-1 dark-image-l"-->
<!--          src="/images/icons/hexagons/accent-heavy.svg"-->
<!--          alt=""-->
<!--        >-->
<!--        <img-->
<!--          class="hexagon hexagon-2 light-image-l"-->
<!--          src="/images/icons/hexagons/accent.svg"-->
<!--          alt=""-->
<!--        >-->
<!--        <img-->
<!--          class="hexagon hexagon-2 dark-image-l"-->
<!--          src="/images/icons/hexagons/accent-heavy.svg"-->
<!--          alt=""-->
<!--        >-->
<!--        <img-->
<!--          class="hexagon hexagon-3 light-image-l"-->
<!--          src="/images/icons/hexagons/green.svg"-->
<!--          alt=""-->
<!--        >-->
<!--        <img-->
<!--          class="hexagon hexagon-3 dark-image-l"-->
<!--          src="/images/icons/hexagons/green-heavy.svg"-->
<!--          alt=""-->
<!--        >-->
<!--        <img-->
<!--          class="hexagon hexagon-4 light-image-l"-->
<!--          src="/images/icons/hexagons/purple.svg"-->
<!--          alt=""-->
<!--        >-->
<!--        <img-->
<!--          class="hexagon hexagon-4 dark-image-l"-->
<!--          src="/images/icons/hexagons/purple-heavy.svg"-->
<!--          alt=""-->
<!--        >-->

<!--        <div class="hero-body">-->
<!--          <div class="container">-->
<!--            <div class="columns is-vcentered">-->
<!--              <div class="column is-5">-->
<!--                <h1 class="title is-1 is-bold">-->
<!--                  Easier development. Beautiful projects-->
<!--                </h1>-->
<!--                <h3 class="subtitle is-4 pt-2 light-text">-->
<!--                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Isto modo ne-->
<!--                  improbos quidem.-->
<!--                </h3>-->
<!--                <div class="buttons">-->
<!--                  <VButton-->
<!--                    color="primary"-->
<!--                    bold-->
<!--                    rounded-->
<!--                    raised-->
<!--                  >-->
<!--                    Get Started-->
<!--                  </VButton>-->
<!--                  <VButton-->
<!--                    color="primary"-->
<!--                    outlined-->
<!--                    bold-->
<!--                    rounded-->
<!--                    raised-->
<!--                  >-->
<!--                    14-day Trial-->
<!--                  </VButton>-->
<!--                </div>-->
<!--              </div>-->
<!--              <div class="column is-7">-->
<!--                <img-->
<!--                  class="light-image-l hero-mockup"-->
<!--                  src="/@src/assets/illustrations/landing/app-2.png"-->
<!--                  alt=""-->
<!--                >-->
<!--                <img-->
<!--                  class="dark-image-l hero-mockup"-->
<!--                  src="/@src/assets/illustrations/landing/app-2-dark.png"-->
<!--                  alt=""-->
<!--                >-->
<!--              </div>-->
<!--            </div>-->
<!--          </div>-->
<!--        </div>-->
<!--      </div>-->

<!--      &lt;!&ndash;Feature boxes section&ndash;&gt;-->
<!--      <a-->
<!--        id="features"-->
<!--        name="features"-->
<!--        aria-label="Features"-->
<!--      />-->
<!--      <MarketingFeaturesIcons />-->

<!--      &lt;!&ndash;Pricing section&ndash;&gt;-->
<!--      <MarketingPricings />-->

<!--      &lt;!&ndash;Mockup Section&ndash;&gt;-->
<!--      <MarketingMockup />-->

<!--      &lt;!&ndash;Side Features Section&ndash;&gt;-->
<!--      <MarketingSideFeatures />-->

<!--      &lt;!&ndash;About section&ndash;&gt;-->
<!--      <MarketingAbout />-->

<!--      &lt;!&ndash; Footer &ndash;&gt;-->
<!--      <LandingFooter />-->

<!--      &lt;!&ndash; Back To Top Button &ndash;&gt;-->
<!--      <div id="backtotop">-->
<!--        <a-->
<!--          href="#"-->
<!--          aria-label="back to top"-->
<!--        >-->
<!--          <i-->
<!--            aria-hidden="true"-->
<!--            class="fas fa-angle-up"-->
<!--          />-->
<!--        </a>-->
<!--      </div>-->
<!--    </div>-->
<!--  </LandingLayout>-->
<!--</template>-->

<!--<style lang="scss">-->
<!--@import '/@src/scss/abstracts/all';-->
<!--@import '/@src/scss/_demo/landing';-->

<!--.marketing-hero {-->
<!--  position: relative;-->

<!--  &.is-left,-->
<!--  &.is-right {-->
<!--    .hero-body {-->
<!--      h1 {-->
<!--        max-width: 480px;-->
<!--      }-->

<!--      h3 {-->
<!--        max-width: 520px;-->
<!--      }-->
<!--    }-->
<!--  }-->

<!--  &.is-centered {-->
<!--    background: var(&#45;&#45;widget-grey);-->

<!--    .hero-body {-->
<!--      .columns {-->
<!--        padding-top: 6rem;-->
<!--      }-->

<!--      .title,-->
<!--      .subtitle,-->
<!--      .switch-wrapper {-->
<!--        margin-inline-start: auto;-->
<!--        margin-inline-end: auto;-->
<!--      }-->

<!--      h1 {-->
<!--        max-width: 880px;-->
<!--      }-->

<!--      h3 {-->
<!--        max-width: 520px;-->
<!--      }-->

<!--      .hero-mockup {-->
<!--        max-width: 640px;-->
<!--        margin: 0 auto;-->
<!--      }-->
<!--    }-->
<!--  }-->

<!--  &.is-left,-->
<!--  &.is-centered {-->
<!--    background: var(&#45;&#45;widget-grey);-->

<!--    .hexagon {-->
<!--      position: absolute;-->
<!--      animation: rotating 15s infinite;-->
<!--      animation-timing-function: linear;-->

<!--      &.hexagon-1 {-->
<!--        top: -180px;-->
<!--        inset-inline-start: -180px;-->
<!--        height: 450px;-->
<!--        width: 450px;-->
<!--        transform: rotate(calc(var(&#45;&#45;transform-direction) * 39deg));-->
<!--      }-->

<!--      &.hexagon-2 {-->
<!--        bottom: 80px;-->
<!--        inset-inline-end: 80px;-->
<!--        height: 360px;-->
<!--        width: 360px;-->
<!--        transform: rotate(calc(var(&#45;&#45;transform-direction) * 75deg));-->
<!--        animation-delay: 2s;-->
<!--      }-->

<!--      &.hexagon-3 {-->
<!--        bottom: 40px;-->
<!--        inset-inline-start: 40px;-->
<!--        height: 190px;-->
<!--        width: 190px;-->
<!--        transform: rotate(calc(var(&#45;&#45;transform-direction) * 95deg));-->
<!--        animation-delay: 0.5s;-->
<!--      }-->

<!--      &.hexagon-4 {-->
<!--        top: -155px;-->
<!--        inset-inline-start: 50%;-->
<!--        height: 230px;-->
<!--        width: 230px;-->
<!--        transform: rotate(calc(var(&#45;&#45;transform-direction) * 135deg));-->
<!--        animation-delay: 1s;-->
<!--      }-->
<!--    }-->
<!--  }-->

<!--  &.is-right {-->
<!--    background: var(&#45;&#45;widget-grey);-->

<!--    .hexagon {-->
<!--      position: absolute;-->
<!--      animation: rotating 15s infinite;-->
<!--      animation-timing-function: linear;-->

<!--      &.hexagon-1 {-->
<!--        top: -180px;-->
<!--        inset-inline-end: -180px;-->
<!--        height: 450px;-->
<!--        width: 450px;-->
<!--        transform: rotate(calc(var(&#45;&#45;transform-direction) * 39deg));-->
<!--      }-->

<!--      &.hexagon-2 {-->
<!--        bottom: 80px;-->
<!--        inset-inline-start: 80px;-->
<!--        height: 360px;-->
<!--        width: 360px;-->
<!--        transform: rotate(calc(var(&#45;&#45;transform-direction) * 75deg));-->
<!--        animation-delay: 2s;-->
<!--      }-->

<!--      &.hexagon-3 {-->
<!--        bottom: 40px;-->
<!--        inset-inline-end: 40px;-->
<!--        height: 190px;-->
<!--        width: 190px;-->
<!--        transform: rotate(calc(var(&#45;&#45;transform-direction) * 95deg));-->
<!--        animation-delay: 0.5s;-->
<!--      }-->

<!--      &.hexagon-4 {-->
<!--        top: -155px;-->
<!--        inset-inline-start: 50%;-->
<!--        height: 230px;-->
<!--        width: 230px;-->
<!--        transform: rotate(calc(var(&#45;&#45;transform-direction) * 135deg));-->
<!--        animation-delay: 1s;-->
<!--      }-->
<!--    }-->
<!--  }-->

<!--  .hero-body {-->
<!--    .buttons {-->
<!--      .button {-->
<!--        min-height: 44px;-->
<!--        min-width: 140px;-->
<!--      }-->
<!--    }-->

<!--    .hero-mockup {-->
<!--      box-shadow: var(&#45;&#45;light-box-shadow);-->
<!--      border: 1px solid var(&#45;&#45;border);-->
<!--      border-radius: 0.75rem;-->
<!--    }-->
<!--  }-->
<!--}-->

<!--.is-dark {-->
<!--  .marketing-hero {-->
<!--    &.is-left,-->
<!--    &.is-right,-->
<!--    &.is-centered {-->
<!--      background: var(&#45;&#45;landing-xxx-dark-2);-->

<!--      .hexagon {-->
<!--        opacity: 0.3;-->
<!--      }-->

<!--      .hero-body {-->
<!--        .hero-mockup {-->
<!--          border-color: var(&#45;&#45;landing-xxx-light-8);-->
<!--        }-->

<!--        .buttons {-->
<!--          .button {-->
<!--            &:not(.is-outlined) {-->
<!--              background: var(&#45;&#45;primary) !important;-->
<!--              border-color: var(&#45;&#45;primary) !important;-->

<!--              &:hover,-->
<!--              &:focus {-->
<!--                box-shadow: var(&#45;&#45;primary-box-shadow) !important;-->
<!--              }-->
<!--            }-->

<!--            &.is-outlined {-->
<!--              color: var(&#45;&#45;primary) !important;-->
<!--              border-color: var(&#45;&#45;primary) !important;-->

<!--              &:hover,-->
<!--              &:focus {-->
<!--                background: var(&#45;&#45;primary) !important;-->
<!--                color: var(&#45;&#45;white) !important;-->
<!--                box-shadow: var(&#45;&#45;primary-box-shadow) !important;-->
<!--              }-->
<!--            }-->
<!--          }-->
<!--        }-->
<!--      }-->
<!--    }-->
<!--  }-->
<!--}-->

<!--.centered-mockup-wrapper {-->
<!--  margin: 2rem auto;-->
<!--  max-width: 740px;-->

<!--  .mockup-container {-->
<!--    position: relative;-->

<!--    .hexagon {-->
<!--      position: absolute;-->
<!--      animation: rotating 15s infinite;-->

<!--      &.hexagon-1 {-->
<!--        top: -110px;-->
<!--        inset-inline-start: -110px;-->
<!--        height: 230px;-->
<!--        width: 230px;-->
<!--        transform: rotate(calc(var(&#45;&#45;transform-direction) * 39deg));-->
<!--        animation-delay: 2s;-->
<!--      }-->

<!--      &.hexagon-2 {-->
<!--        bottom: 160px;-->
<!--        inset-inline-end: -80px;-->
<!--        height: 160px;-->
<!--        width: 160px;-->
<!--        transform: rotate(calc(var(&#45;&#45;transform-direction) * 75deg));-->
<!--        z-index: 2;-->
<!--        animation-delay: 0.5s;-->
<!--      }-->

<!--      &.hexagon-3 {-->
<!--        bottom: 60px;-->
<!--        inset-inline-start: -180px;-->
<!--        height: 100px;-->
<!--        width: 100px;-->
<!--        transform: rotate(calc(var(&#45;&#45;transform-direction) * 125deg));-->
<!--        z-index: 2;-->
<!--        animation-delay: 1s;-->
<!--      }-->
<!--    }-->
<!--  }-->

<!--  img:not(.hexagon) {-->
<!--    position: relative;-->
<!--    border-radius: 0.75rem;-->
<!--    z-index: 1;-->

<!--    &.light-image-l {-->
<!--      box-shadow: var(&#45;&#45;light-box-shadow);-->
<!--      border: 1px solid var(&#45;&#45;border);-->
<!--    }-->

<!--    &.dark-image-l {-->
<!--      box-shadow: var(&#45;&#45;light-box-shadow);-->
<!--      border: 1px solid var(&#45;&#45;dark-sidebar-light-12);-->
<!--    }-->
<!--  }-->
<!--}-->

<!--.is-dark {-->
<!--  .centered-mockup-wrapper {-->
<!--    .title {-->
<!--      color: var(&#45;&#45;white) !important;-->
<!--    }-->
<!--  }-->

<!--  .video-section {-->
<!--    .title {-->
<!--      color: var(&#45;&#45;white) !important;-->
<!--    }-->

<!--    .video-player-container {-->
<!--      &.reversed-play {-->
<!--        .plyr&#45;&#45;full-ui.plyr&#45;&#45;video .plyr__control&#45;&#45;overlaid {-->
<!--          border-color: var(&#45;&#45;primary) !important;-->
<!--          color: var(&#45;&#45;primary) !important;-->

<!--          &:hover,-->
<!--          &:focus {-->
<!--            background: var(&#45;&#45;primary) !important;-->

<!--            svg {-->
<!--              stroke: var(&#45;&#45;white) !important;-->
<!--              fill: var(&#45;&#45;white) !important;-->
<!--            }-->
<!--          }-->

<!--          svg {-->
<!--            stroke: var(&#45;&#45;primary) !important;-->
<!--          }-->
<!--        }-->
<!--      }-->
<!--    }-->
<!--  }-->
<!--}-->

<!--.pricing-wrapper {-->
<!--  font-family: var(&#45;&#45;font);-->
<!--  font-weight: 400;-->
<!--  color: #9f9f9f;-->
<!--  font-size: 15px;-->
<!--  display: flex;-->
<!--  justify-content: center;-->
<!--  max-width: 1040px;-->
<!--  margin: 0 auto;-->

<!--  .pricing-plan {-->
<!--    width: calc(33.3% - 1.5rem);-->
<!--    height: auto;-->
<!--    background: var(&#45;&#45;white);-->
<!--    border: 1px solid var(&#45;&#45;border);-->
<!--    border-radius: 0.65rem;-->
<!--    display: inline-block;-->
<!--    padding: 24px;-->
<!--    text-align: center;-->
<!--    position: relative;-->
<!--    margin: 0 0.75rem;-->
<!--    overflow: hidden;-->
<!--    transition: box-shadow 0.3s;-->

<!--    &:hover,-->
<!--    &:focus {-->
<!--      box-shadow: var(&#45;&#45;light-box-shadow);-->
<!--    }-->

<!--    &.is-featured {-->
<!--      border-color: var(&#45;&#45;primary);-->

<!--      &::before {-->
<!--        width: 0;-->
<!--        height: 0;-->
<!--        border-style: solid;-->
<!--        border-width: 64px 64px 0 0;-->
<!--        border-color: var(&#45;&#45;primary) transparent transparent transparent;-->
<!--        position: absolute;-->
<!--        inset-inline-start: 0;-->
<!--        top: 0;-->
<!--        content: '';-->
<!--      }-->

<!--      &::after {-->
<!--        font-family: 'Font Awesome 5 Free';-->
<!--        font-weight: 900;-->
<!--        content: '\f00c';-->
<!--        color: var(&#45;&#45;white);-->
<!--        position: absolute;-->
<!--        inset-inline-start: 11px;-->
<!--        top: 11px;-->
<!--        text-shadow: 0 0 2px var(&#45;&#45;primary);-->
<!--        font-size: 1rem;-->
<!--      }-->
<!--    }-->

<!--    .name {-->
<!--      color: var(&#45;&#45;dark-text);-->
<!--      font-weight: 300;-->
<!--      font-size: 2rem;-->
<!--      margin-top: -5px;-->
<!--    }-->

<!--    img {-->
<!--      max-width: 55px;-->
<!--      margin: 0 auto;-->
<!--    }-->

<!--    .price {-->
<!--      font-size: 1.8rem;-->
<!--      margin: 0.75rem 0 1.5rem;-->
<!--      font-weight: bold;-->

<!--      &::after {-->
<!--        content: ' /per month';-->
<!--        font-size: 1rem;-->
<!--        font-weight: normal;-->
<!--        color: var(&#45;&#45;light-text);-->
<!--      }-->
<!--    }-->

<!--    hr {-->
<!--      background-color: var(&#45;&#45;border);-->
<!--      border: none;-->
<!--      height: 1px;-->
<!--    }-->

<!--    .trial {-->
<!--      font-size: 0.9rem;-->
<!--      font-weight: 600;-->
<!--      padding: 2px 21px;-->
<!--      color: var(&#45;&#45;primary);-->
<!--      border: 1px solid var(&#45;&#45;border);-->
<!--      display: inline-block;-->
<!--      border-radius: 15px;-->
<!--      background-color: var(&#45;&#45;white);-->
<!--    }-->

<!--    ul {-->
<!--      list-style: none;-->
<!--      padding: 0;-->
<!--      text-align: inset-inline-start;-->
<!--      margin-top: 29px;-->
<!--    }-->

<!--    li {-->
<!--      margin-bottom: 15px;-->

<!--      &::before {-->
<!--        font-family: 'Font Awesome 5 Free';-->
<!--        font-weight: 900;-->
<!--        content: '\f00c';-->
<!--        font-size: 0.9rem;-->
<!--        color: var(&#45;&#45;success);-->
<!--        margin-inline-end: 6px;-->
<!--      }-->
<!--    }-->
<!--  }-->
<!--}-->

<!--.is-dark {-->
<!--  .pricing-wrapper {-->
<!--    .pricing-plan {-->
<!--      border-color: var(&#45;&#45;landing-xxx-light-12);-->
<!--      background: var(&#45;&#45;landing-xxx-light-6);-->

<!--      &.is-featured {-->
<!--        border-color: var(&#45;&#45;primary);-->

<!--        &::before {-->
<!--          border-color: var(&#45;&#45;primary) transparent transparent transparent;-->
<!--        }-->
<!--      }-->

<!--      .name {-->
<!--        color: var(&#45;&#45;dark-dark-text);-->
<!--      }-->

<!--      .price {-->
<!--        color: var(&#45;&#45;white);-->
<!--      }-->

<!--      .trial {-->
<!--        color: var(&#45;&#45;primary);-->
<!--        border-color: var(&#45;&#45;landing-xxx-light-12);-->
<!--        background: var(&#45;&#45;landing-xxx-light-2);-->
<!--      }-->

<!--      hr {-->
<!--        background: var(&#45;&#45;landing-xxx-light-12);-->
<!--      }-->

<!--      li {-->
<!--        color: var(&#45;&#45;light-text);-->

<!--        strong {-->
<!--          color: var(&#45;&#45;white);-->
<!--        }-->
<!--      }-->
<!--    }-->
<!--  }-->
<!--}-->

<!--.card-icon-box {-->
<!--  border: 1px solid var(&#45;&#45;border);-->
<!--  border-radius: 0.65rem;-->
<!--  box-shadow: none;-->
<!--  transition: box-shadow 0.3s;-->

<!--  &:hover,-->
<!--  &:focus {-->
<!--    box-shadow: var(&#45;&#45;light-box-shadow);-->
<!--  }-->

<!--  .v-icon {-->
<!--    margin-bottom: 0.75rem;-->
<!--  }-->
<!--}-->

<!--.is-dark {-->
<!--  .card-icon-box {-->
<!--    border-color: var(&#45;&#45;landing-xxx-light-12);-->
<!--    background: var(&#45;&#45;landing-xxx-light-4);-->

<!--    .v-icon {-->
<!--      background: transparent;-->
<!--      border: 2px solid var(&#45;&#45;landing-xxx-light-12);-->
<!--    }-->

<!--    .title {-->
<!--      color: var(&#45;&#45;white);-->
<!--    }-->
<!--  }-->
<!--}-->

<!--.has-bg-dots {-->
<!--  background-image: radial-gradient(circle, #f0f4ff 10%, transparent 15%),-->
<!--    radial-gradient(circle, #f0f4ff 10%, transparent 15%);-->
<!--  background-size: 50px 50px;-->
<!--  background-position:-->
<!--    0 0,-->
<!--    0 0;-->
<!--}-->

<!--.is-dark {-->
<!--  .has-bg-dots {-->
<!--    background-image: radial-gradient(-->
<!--        circle,-->
<!--        var(&#45;&#45;landing-xxx-light-4) 10%,-->
<!--        transparent 15%-->
<!--      ),-->
<!--      radial-gradient(circle, var(&#45;&#45;landing-xxx-light-4) 10%, transparent 15%);-->
<!--    background-size: 50px 50px;-->
<!--    background-position:-->
<!--      0 0,-->
<!--      0 0;-->
<!--  }-->
<!--}-->

<!--.boxed-cta {-->
<!--  position: relative;-->
<!--  display: flex;-->
<!--  justify-content: center;-->
<!--  align-items: center;-->
<!--  min-height: 430px;-->
<!--  max-width: 1040px;-->
<!--  margin: 0 auto;-->
<!--  background: var(&#45;&#45;primary);-->
<!--  border-radius: 1rem;-->
<!--  padding: 3rem;-->
<!--  box-shadow: var(&#45;&#45;primary-box-shadow);-->
<!--  overflow: hidden;-->
<!--  margin-bottom: 5rem;-->

<!--  .v-avatar {-->
<!--    position: absolute;-->

<!--    &.v-avatar-1 {-->
<!--      top: -7%;-->
<!--      inset-inline-start: 4%;-->
<!--    }-->

<!--    &.v-avatar-2 {-->
<!--      top: 5%;-->
<!--      inset-inline-end: 5%;-->
<!--    }-->

<!--    &.v-avatar-3 {-->
<!--      bottom: -9%;-->
<!--      inset-inline-start: 5%;-->
<!--    }-->

<!--    &.v-avatar-4 {-->
<!--      bottom: -9%;-->
<!--      inset-inline-end: 5%;-->
<!--    }-->

<!--    &.v-avatar-5 {-->
<!--      top: -7%;-->
<!--      inset-inline-start: 50%;-->
<!--    }-->

<!--    &.v-avatar-6 {-->
<!--      top: 40%;-->
<!--      inset-inline-end: -3%;-->
<!--    }-->

<!--    &.v-avatar-7 {-->
<!--      top: 30%;-->
<!--      inset-inline-end: 12%;-->
<!--    }-->

<!--    &.v-avatar-8 {-->
<!--      bottom: 30%;-->
<!--      inset-inline-end: 16%;-->
<!--    }-->

<!--    &.v-avatar-9 {-->
<!--      top: 9%;-->
<!--      inset-inline-end: 21%;-->
<!--    }-->

<!--    &.v-avatar-10 {-->
<!--      top: 40%;-->
<!--      inset-inline-start: -3%;-->
<!--    }-->

<!--    &.v-avatar-11 {-->
<!--      top: 30%;-->
<!--      inset-inline-start: 12%;-->
<!--    }-->

<!--    &.v-avatar-12 {-->
<!--      bottom: 17%;-->
<!--      inset-inline-start: 16%;-->
<!--    }-->

<!--    &.v-avatar-13 {-->
<!--      top: 9%;-->
<!--      inset-inline-start: 21%;-->
<!--    }-->

<!--    &.v-avatar-14 {-->
<!--      bottom: 20%;-->
<!--      inset-inline-start: 1%;-->
<!--    }-->

<!--    &.v-avatar-15 {-->
<!--      bottom: -7%;-->
<!--      inset-inline-start: 39%;-->
<!--    }-->

<!--    &.v-avatar-16 {-->
<!--      bottom: 12%;-->
<!--      inset-inline-end: 30%;-->
<!--    }-->

<!--    .avatar {-->
<!--      border: 4px solid var(&#45;&#45;primary-light-8);-->
<!--    }-->
<!--  }-->

<!--  .boxed-cta-content {-->
<!--    max-width: 440px;-->

<!--    .title,-->
<!--    .subtitle {-->
<!--      color: var(&#45;&#45;white) !important;-->
<!--    }-->

<!--    .subtitle {-->
<!--      opacity: 0.8;-->
<!--    }-->

<!--    .v-button {-->
<!--      min-height: 44px;-->
<!--      min-width: 190px;-->
<!--      font-weight: 600;-->
<!--      color: var(&#45;&#45;primary) !important;-->
<!--      background-color: var(&#45;&#45;white) !important;-->
<!--      border-color: var(&#45;&#45;primary) !important;-->
<!--    }-->
<!--  }-->
<!--}-->

<!--.is-dark {-->
<!--  .boxed-cta {-->
<!--    background: var(&#45;&#45;primary);-->
<!--    box-shadow: var(&#45;&#45;primary-box-shadow);-->

<!--    .v-avatar {-->
<!--      .avatar {-->
<!--        border-color: var(&#45;&#45;primary-light-8);-->
<!--      }-->
<!--    }-->

<!--    .boxed-cta-content {-->
<!--      .v-button {-->
<!--        color: var(&#45;&#45;primary);-->
<!--      }-->
<!--    }-->
<!--  }-->
<!--}-->

<!--@media (width <= 767px) {-->
<!--  .marketing-hero {-->
<!--    &.is-left,-->
<!--    &.is-right,-->
<!--    &.is-centered {-->
<!--      text-align: center;-->

<!--      .hexagon {-->
<!--        &.hexagon-1 {-->
<!--          top: -110px;-->
<!--          inset-inline-start: -80px;-->
<!--          height: 230px;-->
<!--          width: 230px;-->
<!--        }-->

<!--        &.hexagon-2 {-->
<!--          bottom: 45px;-->
<!--          inset-inline-end: -80px;-->
<!--          height: 220px;-->
<!--          width: 220px;-->
<!--        }-->

<!--        &.hexagon-3 {-->
<!--          bottom: 50%;-->
<!--          inset-inline-start: -110px;-->
<!--        }-->

<!--        &.hexagon-4 {-->
<!--          top: -165px;-->
<!--          inset-inline-start: 70%;-->
<!--          height: 230px;-->
<!--          width: 230px;-->
<!--        }-->
<!--      }-->
<!--    }-->

<!--    .hero-body {-->
<!--      .title,-->
<!--      .subtitle {-->
<!--        margin-inline-start: auto;-->
<!--        margin-inline-end: auto;-->
<!--      }-->

<!--      .title {-->
<!--        font-size: 2.5rem;-->
<!--      }-->

<!--      .buttons {-->
<!--        justify-content: center;-->
<!--        margin-bottom: 2rem;-->
<!--      }-->

<!--      .switch-wrapper {-->
<!--        margin: 0 auto;-->
<!--      }-->

<!--      .hero-mockup {-->
<!--        max-width: 100% !important;-->
<!--        margin: 0 auto;-->
<!--      }-->
<!--    }-->
<!--  }-->

<!--  .centered-mockup-wrapper {-->
<!--    .hexagon {-->
<!--      &.hexagon-2 {-->
<!--        bottom: 120px !important;-->
<!--        inset-inline-end: -40px !important;-->
<!--        height: 80px !important;-->
<!--        width: 80px !important;-->
<!--      }-->
<!--    }-->
<!--  }-->

<!--  .pricing-wrapper {-->
<!--    flex-wrap: wrap;-->

<!--    .pricing-plan {-->
<!--      width: calc(100% - 1.5rem);-->

<!--      &:not(:last-child) {-->
<!--        margin-bottom: 1.5rem;-->
<!--      }-->
<!--    }-->
<!--  }-->

<!--  .boxed-cta {-->
<!--    .v-avatar {-->
<!--      &.v-avatar-12,-->
<!--      &.v-avatar-9,-->
<!--      &.v-avatar-8,-->
<!--      &.v-avatar-11,-->
<!--      &.v-avatar-4,-->
<!--      &.v-avatar-6,-->
<!--      &.v-avatar-1 {-->
<!--        display: none;-->
<!--      }-->

<!--      &.v-avatar-7 {-->
<!--        inset-inline-end: -6%;-->
<!--      }-->

<!--      &.v-avatar-13 {-->
<!--        top: 3%;-->
<!--        inset-inline-start: -4%;-->
<!--      }-->

<!--      &.v-avatar-14 {-->
<!--        inset-inline-start: -13%;-->
<!--      }-->

<!--      &.v-avatar-15 {-->
<!--        bottom: -4%;-->
<!--        inset-inline-start: 48%;-->
<!--      }-->

<!--      &.v-avatar-16 {-->
<!--        inset-inline-end: -7%;-->
<!--      }-->
<!--    }-->

<!--    .boxed-cta-content {-->
<!--      .title {-->
<!--        font-size: 2.5rem;-->
<!--      }-->
<!--    }-->
<!--  }-->
<!--}-->

<!--@media only screen and (width >= 768px) and (width <= 1024px) and (orientation: portrait) {-->
<!--  .marketing-hero {-->
<!--    &.is-centered {-->
<!--      text-align: center;-->

<!--      .hexagon {-->
<!--        &.hexagon-2 {-->
<!--          bottom: 45px;-->
<!--          inset-inline-end: -80px;-->
<!--        }-->

<!--        &.hexagon-3 {-->
<!--          bottom: 50%;-->
<!--          inset-inline-start: -110px;-->
<!--        }-->
<!--      }-->
<!--    }-->

<!--    &.is-left {-->
<!--      text-align: center;-->

<!--      .hexagon {-->
<!--        &.hexagon-2 {-->
<!--          bottom: 45px;-->
<!--          inset-inline-end: -80px;-->
<!--        }-->

<!--        &.hexagon-3 {-->
<!--          bottom: 50%;-->
<!--          inset-inline-start: -110px;-->
<!--        }-->
<!--      }-->
<!--    }-->

<!--    &.is-right {-->
<!--      text-align: center;-->

<!--      .hexagon {-->
<!--        &.hexagon-2 {-->
<!--          bottom: 45px;-->
<!--          inset-inline-end: -80px;-->
<!--        }-->

<!--        &.hexagon-3 {-->
<!--          bottom: 50%;-->
<!--          inset-inline-start: -110px;-->
<!--        }-->
<!--      }-->
<!--    }-->

<!--    .hero-body {-->
<!--      .title,-->
<!--      .subtitle {-->
<!--        margin-inline-start: auto;-->
<!--        margin-inline-end: auto;-->
<!--      }-->

<!--      .buttons {-->
<!--        justify-content: center;-->
<!--        margin-bottom: 2rem;-->
<!--      }-->

<!--      .switch-wrapper {-->
<!--        margin: 0 auto;-->
<!--      }-->

<!--      .hero-mockup {-->
<!--        max-width: 640px;-->
<!--        margin: 0 auto;-->
<!--      }-->
<!--    }-->
<!--  }-->

<!--  .card-icon-boxes {-->
<!--    display: flex;-->

<!--    .column {-->
<!--      min-width: 50%;-->
<!--      width: 50%;-->
<!--    }-->
<!--  }-->

<!--  .centered-mockup-wrapper {-->
<!--    max-width: 640px;-->

<!--    .columns {-->
<!--      display: flex;-->
<!--    }-->
<!--  }-->

<!--  .video-section {-->
<!--    .columns .columns {-->
<!--      display: flex;-->
<!--      flex-wrap: wrap;-->
<!--      max-width: 480px;-->
<!--      margin: 0 auto;-->

<!--      .column {-->
<!--        min-width: 50%;-->
<!--        width: 50%;-->
<!--      }-->
<!--    }-->
<!--  }-->

<!--  .boxed-cta {-->
<!--    .v-avatar {-->
<!--      &.v-avatar-12,-->
<!--      &.v-avatar-9,-->
<!--      &.v-avatar-8,-->
<!--      &.v-avatar-11 {-->
<!--        display: none;-->
<!--      }-->
<!--    }-->
<!--  }-->
<!--}-->
<!--</style>-->


<template>
  <AuthLayout>
    <RouterView />
  </AuthLayout>
</template>

<style lang="scss">
.auth-wrapper-inner {
  overflow: hidden !important;
  height: 100%;
  padding: 0;
  margin: 0;

  &.is-gapless:not(:last-child) {
    margin-bottom: 0 !important;
  }

  &.is-single {
    background: var(--widget-grey);
    min-height: 100vh;
  }

  .hero-banner {
    background: var(--widget-grey);
  }

  .hero-heading {
    position: relative;
    max-width: 360px;
    width: 100%;
    margin: 0 auto;
    padding: 20px 0 0;

    .dark-mode {
      position: absolute;
      top: 24px;
      inset-inline-end: 24px;
      transform: scale(0.6);
      z-index: 2;
    }

    .auth-logo {
      display: flex;
      justify-content: center;

      svg {
        height: 42px;
        width: 42px;
      }

      .top-logo {
        height: 42px;
      }
    }
  }

  .hero {
    &.is-white {
      background: var(--white);
    }

    .hero-body {
      .login {
        padding: 10px 0;
      }

      .auth-content {
        max-width: 320px;
        width: 100%;
        margin: 0 auto;
        margin-top: -40px;
        margin-bottom: 40px;

        h2 {
          font-size: 2rem;
          font-family: var(--font);
          line-height: 1;
        }

        p {
          font-size: 1rem;
          margin-bottom: 8px;
          color: var(--muted-grey);
        }

        a {
          font-size: 0.9rem;
          font-family: var(--font-alt);
          font-weight: 500;
          color: var(--primary);
        }
      }

      .auth-form-wrapper {
        max-width: 320px;
        width: 100%;
        margin: 0 auto;
      }
    }
  }

  .forgot-link {
    margin-top: 10px;

    a {
      font-family: var(--font-alt);
      font-size: 0.9rem;
      color: var(--light-text);
      transition: color 0.3s;

      &:hover,
      &:focus {
        color: var(--primary);
      }
    }
  }

  .setting-item {
    display: flex;
    align-items: center;
    padding: 10px 0;

    .setting-meta {
      font-family: var(--font);
      color: var(--light-text);
      margin-inline-start: 8px;
    }
  }

  .v-button {
    min-height: 44px;
  }
}

.is-dark {
  .auth-wrapper-inner {
    .hero-banner {
      background: var(--dark-sidebar-light-4);
    }

    .hero {
      &.is-white {
        background: var(--dark-sidebar-dark-4);
      }

      .hero-body {
        .auth-content {
          h2 {
            color: var(--dark-dark-text);
          }

          a {
            color: var(--primary);
          }
        }
      }
    }

    .forgot-link {
      a:hover {
        color: var(--primary);
      }
    }
  }
}

.auth-nav {
  position: absolute;
  top: 0;
  inset-inline-start: 0;
  height: 80px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;

  .left,
  .right {
    display: flex;
    align-items: center;
    width: 20%;
  }

  .right {
    justify-content: flex-end;

    .dark-mode {
      transform: scale(0.7);
    }
  }

  .center {
    flex-grow: 2;

    a {
      display: flex;
      justify-content: center;
      align-items: center;

      img {
        display: block;
        width: 100%;
        max-width: 50px;
      }
    }
  }
}

.auth-wrapper-inner {
  .single-form-wrap {
    min-height: 690px;
    padding: 0 16px;
    display: flex;
    align-items: center;
    justify-content: center;

    .inner-wrap {
      width: 100%;
      max-width: 400px;
      margin: 40px auto 0;

      .auth-head {
        max-width: 320px;
        width: 100%;
        margin: 0 auto;
        margin-bottom: 20px;
        text-align: center;

        h2 {
          font-size: 2rem;
          font-family: var(--font);
          line-height: 1;
        }

        p {
          font-size: 1rem;
          margin-bottom: 8px;
          color: var(--muted-grey);
        }

        a {
          font-size: 0.9rem;
          font-family: var(--font-alt);
          font-weight: 500;
          color: var(--primary);
        }
      }

      .form-card {
        background: var(--white);
        border: 1px solid var(--fade-grey-dark-3);
        border-radius: 10px;
        padding: 50px;
        margin-bottom: 16px;

        .v-button {
          margin-top: 10px;
        }
      }
    }
  }
}

.is-dark {
  .auth-wrapper-inner {
    &.is-single {
      background: var(--dark-sidebar-light-4);

      .single-form-wrap {
        .inner-wrap {
          .auth-head {
            h2 {
              color: var(--dark-dark-text);
            }

            a {
              color: var(--primary);
            }
          }

          .form-card {
            background: var(--dark-sidebar-dark-4);
            border-color: var(--dark-sidebar-light-1);
          }
        }
      }
    }
  }
}

@media only screen and (width <= 767px) {
  .avatar-carousel {
    &.resized-mobile {
      max-width: 300px;
    }

    .slick-custom {
      display: none !important;
    }

    .image-wrapper img {
      height: auto;
    }
  }

  .auth-wrapper-inner {
    .hero {
      .hero-body {
        .auth-content {
          text-align: center !important;
        }
      }
    }

    .single-form-wrap {
      .inner-wrap {
        .form-card {
          padding: 40px;
        }
      }
    }
  }
}

@media only screen and (width >= 768px) and (width <= 1024px) and (orientation: portrait) {
  .modern-login {
    .top-logo {
      svg {
        height: 60px;
        width: 60px;
      }
    }

    .dark-mode {
      top: -58px;
      inset-inline-end: 30%;
    }

    .columns {
      display: flex;
      height: 100vh;
    }
  }

  .auth-wrapper-inner {
    .hero {
      .hero-body {
        .auth-content {
          text-align: center !important;
        }
      }
    }
  }

  .signup-columns {
    max-width: 460px;
    margin: 0 auto;
  }
}
</style>
