declare interface Window {
  // dataLayer is injected via vite-plugin-radar
  initMap: () => void
  google: any
  dataLayer?: any[]
}
