export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)

  // Default to fetching EUR, GBP, CAD, JPY based on USD
  try {
    const response = await $fetch('https://api.freecurrencyapi.com/v1/latest', {
      query: {
        apikey: config.currencyApiKey,
        base_currency: 'USD',
        currencies: 'EUR,GBP,JPY,CAD'
      }
    })
    return response
  } catch (error) {
    console.error('API Error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch currency rates'
    })
  }
})