<script setup>
import { ref, onMounted } from "vue";
import { Line } from "vue-chartjs";
import { Chart, Title, Tooltip, Legend, LineElement, PointElement, LinearScale, CategoryScale } from "chart.js";
import { useTransactionStore } from "@/stores/transaction";

Chart.register(Title, Tooltip, Legend, LineElement, PointElement, LinearScale, CategoryScale);

const transactionStore = useTransactionStore();

const today = new Date();
const currentDate = today.getDate();
const difference = ref(0);
const isLoaded = ref(false);

const generatePointRadius = () => {
  const result = new Array(currentDate).fill(0);
  result[currentDate - 1] = 5;
  return result;
};

const getEndDay = (year, month) => {
  const isLeapYear = (year) =>
    (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  const daysInMonth = [31, isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  return daysInMonth[month];
};

const chartData = ref({
  labels: [
    "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16",
    "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31"
  ],
  datasets: [
    {
      label: "지난달 소비",
      borderColor: "#D6D7D9",
      pointRadius: 0,
      data: [],
      tension: 0.2,
    },
    {
      label: "이번달 소비",
      borderColor: "#2E7EED",
      pointBackgroundColor: "#2E7EED",
      pointRadius: generatePointRadius(),
      data: [],
      tension: 0.2,
    },
  ],
});

const chartOptions = ref({
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
  },
  scales: {
    x: {
      display: false,
    },
    y: {
      display: false,
      grid: {
        display: false,
      },
    },
  },
});

onMounted(async () => {
  let lastMonthEndDay = 0;
  if (today.getMonth() == 0) {
    lastMonthEndDay = getEndDay(today.getFullYear() - 1, 11);
  } else {
    lastMonthEndDay = getEndDay(today.getFullYear(), today.getMonth() - 1);
  }
  
  const result = await transactionStore.getDailyExpense();

  const lastMonthData = result.lastMonth;
  const thisMonthData = result.thisMonth;

  const lastMonthExpenses = new Array(lastMonthEndDay).fill(0);
  const thisMonthExpenses = new Array(currentDate).fill(0);

  Object.keys(lastMonthData).forEach(date => {
    const day = parseInt(date.split("-")[2], 10) - 1;
    lastMonthExpenses[day] = lastMonthData[date];
  });

  Object.keys(thisMonthData).forEach(date => {
    const day = parseInt(date.split("-")[2], 10) - 1;
    thisMonthExpenses[day] = thisMonthData[date];
  });

  chartData.value.datasets[0].data = lastMonthExpenses;
  chartData.value.datasets[1].data = thisMonthExpenses;

  let lastMonthDay = currentDate - 1;
  if (lastMonthDay > lastMonthEndDay) {
    lastMonthDay = lastMonthEndDay;
  }

  const lastMonthToday = lastMonthExpenses[lastMonthDay];
  const thisMonthToday = thisMonthExpenses[currentDate - 1];
  difference.value = thisMonthToday - lastMonthToday;

  isLoaded.value = true;
});
</script>


<template>
  <div v-if="isLoaded" class="py-6 px-8 bg-white border border-gray-200 rounded-xl shadow">
    <div class="flex items-center justify-between">
      <div>
        <div>지난 달보다</div>
        <div>
          <span
            :class="[
              'font-bold',
              difference > 0 ? 'text-customRed' : difference < 0 ? 'text-customBlue' : '',
            ]"
          >
            {{ Math.abs(difference).toLocaleString() }} </span
          >원
          {{ difference > 0 ? "더" : "덜" }}
        </div>
        <div>사용하고 있어요</div>
      </div>

      <div class="h-full w-2/5 items-end">
        <Line :data="chartData" :options="chartOptions" />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
