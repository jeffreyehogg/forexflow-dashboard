export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@nuxt/ui'],
  
  runtimeConfig: {
    currencyApiKey: '', 
    public: {
    }
  }
});