<script setup>
import { ref, onMounted, watch } from "vue";
import { useTransactionStore } from "@/stores/transaction";

const props = defineProps({
  startDate: {
    type: String
  },
  endDate: {
    type: String
  }
});

const transactionStore = useTransactionStore();

const totalIncome = ref(0);
const totalExpense = ref(0);
const averageExpense = ref(0);

const getMonthlySummary = async () => {
  const summary = await transactionStore.getMonthlySummary(props.startDate, props.endDate);
  totalIncome.value = summary.income;
  totalExpense.value = summary.expense;
  averageExpense.value = summary.average;
};

onMounted(() => {
  getMonthlySummary();
});
</script>

<template>
  <div>
    <div class="flex flex-col h-full justify-between gap-10">
      <div class="py-10 px-10 bg-gray-100 border border-gray-200 rounded-xl shadow flex flex items-center justify-between">
        <div class="font-medium">총 수입</div>
        <div class="font-bold text-lg text-customBlue">{{ totalIncome.toLocaleString() }}원</div>
      </div>
      <div class="py-10 px-10 bg-gray-100 border border-gray-200 rounded-2xl shadow flex flex items-center justify-between">
        <div class="font-medium">총 지출</div>
        <div div class="font-bold text-lg text-customRed">
          {{ totalExpense.toLocaleString() }}원
        </div>
      </div>
      <div class="py-10 px-10 bg-gray-100 border border-gray-200 rounded-2xl shadow flex flex items-center justify-between">
        <div class="font-medium">하루 평균 소비 금액</div>
        <div div class="font-bold text-lg">
          {{ averageExpense.toLocaleString() }}원
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
