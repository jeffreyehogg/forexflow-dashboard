<script setup lang="ts">
const selectedCurrency = ref('EUR')
const currentRate = ref(0)
const history = ref<{ time: string; rate: number }[]>([])
const currencies = ['EUR', 'GBP', 'JPY', 'CAD']

const fetchRates = async () => {
  try {
    // Use our server proxy instead of calling the external API directly
    const res: any = await $fetch('/api/rates')
    
    const rate = res.data[selectedCurrency.value]
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })

    currentRate.value = rate
    
    // Keep last 15 data points
    history.value.push({ time, rate })
    if (history.value.length > 15) history.value.shift()
    
  } catch (e) {
    console.error('Fetch error:', e)
  }
}

// Reset history when currency changes
const onCurrencyChange = () => {
  history.value = []
  fetchRates()
}

let interval: NodeJS.Timeout
onMounted(() => {
  fetchRates()
  interval = setInterval(fetchRates, 10000) // Poll every 10s
})
onUnmounted(() => clearInterval(interval))
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
    <UContainer>
      <div class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">ForexFlow</h1>
          <p class="text-gray-500">Real-time Currency Dashboard</p>
        </div>
        <div class="w-48">
          <USelect 
            v-model="selectedCurrency" 
            :options="currencies" 
            @change="onCurrencyChange"
          />
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <UCard>
          <template #header>
            <p class="text-sm font-medium text-gray-500">Current Rate (USD Base)</p>
          </template>
          <div class="text-4xl font-bold text-emerald-500">
            {{ currentRate.toFixed(4) }}
          </div>
          <template #footer>
            <div class="text-xs text-gray-400">
              Updates every 10 seconds
            </div>
          </template>
        </UCard>
      </div>

      <UCard>
        <template #header>
          <h2 class="text-lg font-semibold">Live Trend: {{ selectedCurrency }}</h2>
        </template>
        <div class="p-4">
          <ClientOnly>
            <ForexChart 
              v-if="history.length > 0" 
              :history="history" 
              :currency="selectedCurrency" 
            />
            <div v-else class="h-64 flex items-center justify-center text-gray-400">
              <UIcon name="i-heroicons-arrow-path" class="animate-spin h-8 w-8 mr-2" />
              Waiting for data stream...
            </div>
          </ClientOnly>
        </div>
      </UCard>
    </UContainer>
  </div>
</template>