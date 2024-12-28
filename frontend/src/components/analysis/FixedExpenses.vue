<script setup>
import { ref, onMounted } from 'vue';
import { useTransactionStore } from '@/stores/transaction';

const transactionStore = useTransactionStore();
const fixedExpenses = ref([]);

onMounted(async () => {
  const fixedExpense = await transactionStore.getFixedExpense();
  fixedExpenses.value = fixedExpense;
})
</script>

<template>
  <div class="py-6 px-8 bg-white border border-gray-200 rounded-xl shadow">
    <div class="font-bold mb-3">나의 고정 지출 키워드는?</div>
    <div v-if="fixedExpenses.length > 0">
      <div class="flex flex-wrap gap-y-2 gap-x-3 mt-2">
        <div v-for="expense in fixedExpenses" :key="expense" class="py-2 px-3 w-fit rounded-full text-white bg-customNavy text-xs">
          #{{ expense }}
        </div>
      </div>
    </div>
    <div v-else>
      <div class="text-center">고정 지출이 없어요!</div>
    </div>
  </div>
</template>

<style scoped></style>
