<script setup>
import { ref, onMounted, computed, watch } from "vue";
import Chart from "chart.js/auto";
import { useAuthStore } from "@/stores/auth.js";

const props = defineProps({
  chartId: {
    type: String,
    required: true,
  },
  accountTransactionData: {
    type: Array,
    required: true,
  },
  cardTransactionData: {
    type: Array,
    required: true,
  },
});

const authStore = useAuthStore();
const memberName = authStore.member.memberName;

const chartInstance = ref(null);

const now = new Date();
const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));

const today = new Date();

const filteredAccountExpenses = computed(() => {
  return props.accountTransactionData.filter((item) => {
    const itemDate = new Date(item.accountTransactionDate);
    return (
      itemDate >= thirtyDaysAgo &&
      itemDate <= today &&
      item.amount < 0 && // 지출 (음수)
      (!item.accountTransactionDescription ||
        !item.accountTransactionDescription.includes(memberName)) 
    );
  });
});

const filteredCardExpenses = computed(() => {
  return props.cardTransactionData.filter((item) => {
    const itemDate = new Date(item.cardTransactionDate);
    return (
      itemDate >= thirtyDaysAgo &&
      itemDate <= today &&
      item.amount > 0 && 
      (!item.cardTransactionDescription ||
        !item.cardTransactionDescription.includes(memberName))
    );
  });
});

const getTotalExpensesFor30Days = () => {
  let totalExpenses = 0;

  filteredAccountExpenses.value.forEach((e) => {
    totalExpenses += Math.abs(e.amount); 
  });

  filteredCardExpenses.value.forEach((e) => {
    totalExpenses += e.amount; 
  });

  return totalExpenses;
};

const dailyAverageExpense = computed(() => {
  const totalExpenses = getTotalExpensesFor30Days();
  return Math.round(totalExpenses / 30).toLocaleString();
});

const getDailyExpenses = () => {
  const dailyExpenses = Array(30).fill(0); 

  filteredAccountExpenses.value.forEach((e) => {
    const date = Math.floor(
      (today - new Date(e.accountTransactionDate)) / (1000 * 60 * 60 * 24)
    ); 
    if (date < 30) {
      dailyExpenses[29 - date] += Math.abs(e.amount); 
    }
  });

  filteredCardExpenses.value.forEach((e) => {
    const date = Math.floor(
      (today - new Date(e.cardTransactionDate)) / (1000 * 60 * 60 * 24)
    ); 
    if (date < 30) {
      dailyExpenses[29 - date] += e.amount; 
    }
  });

  return dailyExpenses;
};

const getLast30DaysDates = () => {
  const dates = [];
  for (let i = 0; i < 30; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    dates.unshift(date.toISOString().split("T")[0]); 
  }
  return dates;
};

const renderChart = () => {
  const canvasElement = document.getElementById(props.chartId);

  if (chartInstance.value) {
    chartInstance.value.destroy();
  }

  if (!canvasElement) {
    return;
  }

  const ctx = canvasElement.getContext("2d");

  const dailyExpenses = getDailyExpenses();
  const dates = getLast30DaysDates(); 

  chartInstance.value = new Chart(ctx, {
    type: "bar",
    data: {
      labels: dates,
      datasets: [
        {
          label: "일별 지출액",
          data: dailyExpenses,
          backgroundColor: "#0B1573",
          borderColor: "#0B1573",
          borderWidth: 1,
        },
      ],
    },
    options: {
      plugins: {
        legend: {
          display: false,
        },
      },
      scales: {
        y: {
        },
      },
    },
  });
};

onMounted(() => {
  if (props.accountTransactionData?.length && props.cardTransactionData?.length) {
    renderChart();
  }
});

watch([props.accountTransactionData, props.cardTransactionData], ([newAccountData, newCardData]) => {
    if (newAccountData?.length && newCardData?.length) {
      renderChart();
    }
  }
);
</script>

<template>
  <div class="py-8 px-8 bg-gray-100 border border-gray-200 rounded-xl shadow flex flex-col justify-center">
    <div class="flex justify-between items-center">
      <div class="font-medium">하루 평균 소비 금액</div>
      <div class="font-bold text-lg">{{ dailyAverageExpense }}원</div>
    </div>
  </div>
</template>

<style scoped>

</style>
