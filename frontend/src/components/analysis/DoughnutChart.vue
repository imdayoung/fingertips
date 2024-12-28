<script setup>
import { ref, onMounted } from "vue";
import { Chart, DoughnutController, ArcElement, Tooltip, Legend } from "chart.js";

Chart.register(DoughnutController, ArcElement, Tooltip, Legend);

const props = defineProps({
  chartId: {
    type: String
  },
  chartData: {
    type: Array
  }
});

const chartData = ref({
  labels: [],
  datasets: [
    {
      data: [],
      backgroundColor: ["#FFB3BA", "#B3E5FC", "#FFCE99", "#C8E6C9", "#E1BEE7"],
      hoverBackgroundColor: ["#FFB3BA", "#B3E5FC", "#FFCE99", "#C8E6C9", "#E1BEE7"],
    },
  ],
});

const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: true,
  plugins: {
    legend: {
      display: true,
    },
    tooltip: {
      enabled: true,
    }
  },
});

let doughnutChartInstance = null;

const renderChart = () => {
  const ctx = document.getElementById(props.chartId).getContext("2d");

  if (doughnutChartInstance) {
    doughnutChartInstance.destroy();
  }

  doughnutChartInstance = new Chart(ctx, {
    type: "doughnut",
    data: chartData.value,
    options: chartOptions.value,
  });
};

onMounted(() => {
  chartData.value.labels = props.chartData.map(item => item.categoryName);
  chartData.value.datasets[0].data = props.chartData.map(item => item.totalSpent);
  renderChart();
});
</script>

<template>
  <div class="mx-8 flex justify-center">
    <canvas :id="chartId"></canvas>
  </div>
</template>

<style scoped></style>
