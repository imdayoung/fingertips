<script setup>
import { onMounted, nextTick } from "vue";
import apiInstance from '@/util/axios-instance';
import { Chart } from 'chart.js/auto';

let chartInstance = null;

const formatDate = (timestamp) => {
  const date = new Date(timestamp);
  return date.toISOString().split('T')[0]; 
};

const fetchAllMetrics = async () => {
  try {
    const response = await apiInstance.get('/admin/daily-metrics');
    
    const data = response.data.data;

    const labels = data.map(item => formatDate(item.metricDate));
    const signUpCounts = data.map(item => item.todaySignUpCount || 0);
    const loginCounts = data.map(item => item.todayLoginCount || 0);
    const visitCounts = data.map(item => item.todayVisitCount || 0);
    const withdrawalCounts = data.map(item => item.todayWithdrawalCount || 0);

    if (chartInstance) {
      chartInstance.destroy();
      chartInstance = null;
    }

    chartInstance = plotChart(labels, signUpCounts, loginCounts, visitCounts, withdrawalCounts);
  } catch (error) {
    console.error("Error fetching all metrics:", error);
  }
};

const plotChart = (labels, signUpCounts, loginCounts, visitCounts, withdrawalCounts) => {
  const ctx = document.getElementById("dailyStatsChart").getContext("2d");

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: "Sign-ups",
        data: signUpCounts,
        backgroundColor: 'rgba(255, 99, 132, 0.1)',   
        borderColor: 'rgba(255, 99, 132, 0.8)',       
        fill: true,
        tension: 0.3,                                
        yAxisID: 'y',
        type: 'line',
        pointBackgroundColor: 'rgba(255, 99, 132, 1)',
      },
      {
        label: "Logins",
        data: loginCounts,
        backgroundColor: 'rgba(54, 162, 235, 0.1)',  
        borderColor: 'rgba(54, 162, 235, 0.8)',       
        fill: true,
        tension: 0.3,
        yAxisID: 'y',
        type: 'line',
        pointBackgroundColor: 'rgba(54, 162, 235, 1)',
        hidden: true, 
      },
      {
        label: "Visits",
        data: visitCounts,
        backgroundColor: 'rgba(255, 206, 86, 0.1)',  
        borderColor: 'rgba(255, 206, 86, 0.8)',     
        fill: true,
        tension: 0.3,
        yAxisID: 'y',
        type: 'line',
        pointBackgroundColor: 'rgba(255, 206, 86, 1)',
        hidden: true,  
      },
      {
        label: "Withdrawals",
        data: withdrawalCounts,
        backgroundColor: 'rgba(153, 102, 255, 0.3)',  
        borderColor: 'rgba(153, 102, 255, 1)',        
        yAxisID: 'y1',
        type: 'bar',
        barThickness: 10,                           
        hidden: true, 
      },
    ],
  };

  return new Chart(ctx, {
    type: 'bar',
    data: chartData,
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "top",
          labels: {
            color: '#333',
          },
        },
      },
      scales: {
        y: {
          title: {
            display: true,
            text: "Counts",
            color: '#666',  
          },
          beginAtZero: true,
          ticks: {
            stepSize: 100,
            color: '#666',  
          },
          grid: {
            color: 'rgba(0, 0, 0, 0.1)',  
          },
        },
        y1: {
          title: {
            display: true,
            text: "Withdrawals",
            color: '#666', 
          },
          beginAtZero: true,
          suggestedMax: 50,  
          position: 'right',
          ticks: {
            color: '#666',  
            stepSize: 5,
          },
          grid: {
            drawOnChartArea: false, 
          },
        },
        x: {
          title: {
            display: true,
            text: "Date",
            color: '#666', 
          },
          ticks: {
            color: '#666', 
          },
          grid: {
            color: 'rgba(0, 0, 0, 0.1)', 
          },
        },
      },
    },
  });
};

onMounted(async () => {
  await nextTick();
  fetchAllMetrics();
});
</script>

<template>
  <div class="p-4">
    <div style="width: 100%; max-width: 900px; margin: 0 auto;">
      <canvas id="dailyStatsChart"></canvas>
    </div>
  </div>
</template>

<style scoped>

</style>