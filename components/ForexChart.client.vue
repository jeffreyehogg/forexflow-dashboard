<script setup lang="ts">
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'
import { Line } from 'vue-chartjs'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

const props = defineProps<{
  history: { time: string; rate: number }[]
  currency: string
}>()

const chartData = computed(() => ({
  labels: props.history.map(h => h.time),
  datasets: [
    {
      label: `${props.currency} / USD`,
      backgroundColor: (ctx: any) => {
        const canvas = ctx.chart.ctx;
        const gradient = canvas.createLinearGradient(0, 0, 0, 400);
        gradient.addColorStop(0, 'rgba(16, 185, 129, 0.2)'); // Emerald color
        gradient.addColorStop(1, 'rgba(16, 185, 129, 0)');
        return gradient;
      },
      borderColor: '#10b981',
      pointBackgroundColor: '#10b981',
      pointBorderColor: '#fff',
      borderWidth: 2,
      fill: true,
      tension: 0.4,
      data: props.history.map(h => h.rate)
    }
  ]
}))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: { mode: 'index', intersect: false }
  },
  scales: {
    x: { grid: { display: false } },
    y: { border: { display: false }, grid: { color: '#f3f4f6' } }
  }
}
</script>

<template>
  <div class="h-64 w-full">
    <Line :data="chartData" :options="chartOptions" />
  </div>
</template>