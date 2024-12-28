<script setup>
import { ref, onMounted, computed } from "vue";
import { useTransactionStore } from "@/stores/transaction";

const transactionStore = useTransactionStore();

const currentPage = ref(1);
const itemsPerPage = ref(5);
const totalPages = ref(0);
const transactions = ref([]);

const fetchTransactions = async () => {
  try {
    const response = await transactionStore.getDailyTransactions(currentPage.value, itemsPerPage.value);

    if (response) {
      transactions.value = response.data.map((transaction) => ({
        date: transaction.transactionDateTime.split(" ")[0],
        time: transaction.transactionDateTime.split(" ")[1],
        type: transaction.transactionType,
        description: transaction.transactionDescription,
        name: transaction.assetName,
        amount: transaction.formattedAmount,
      }));
      totalPages.value = response.totalPages;
    } else {
      console.error("데이터를 가져오지 못했습니다.");
    }
  } catch (error) {
    console.error("fetchTransactions 에러:", error.response ? error.response.data : error.message);
  }
};

const paginatedPageNumbers = computed(() => {
  const maxVisiblePages = 5;
  const halfVisiblePages = Math.floor(maxVisiblePages / 2);

  let startPage = Math.max(1, currentPage.value - halfVisiblePages);
  let endPage = Math.min(totalPages.value, startPage + maxVisiblePages - 1);

  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
});

const goToPage = (pageNumber) => {
  if (pageNumber >= 1 && pageNumber <= totalPages.value) {
    currentPage.value = pageNumber;
    fetchTransactions();
  }
};

const formatDate = (date) => date.replace(/\./g, ".");
const formatTime = (time) => time.substring(0, 5);

onMounted(() => {
  fetchTransactions();
});
</script>

<template>
  <div class="py-4 bg-white border border-gray-200 rounded-xl shadow">
    <div class="mx-5 my-2 font-bold text-lg list-header text-center">이번 달 자산 흐름</div>
    <div class="mx-3">
      <div v-for="(transaction, index) in transactions" :key="index">
        <div class="mx-5">
          <div class="flex items-center justify-between">
            <div>
              <div class="text-xs">{{ formatDate(transaction.date) }} {{ formatTime(transaction.time) }}</div>
              <div class="text-lg my-1">{{ transaction.description }}</div>
              <div class="text-sm">{{ transaction.name }}</div>
            </div>
            <div>
              <div>
                <span class="text-xl font-bold" :class="transaction.type === '출금' ? 'text-customRed' : 'text-customBlue'">
                  {{ transaction.amount.toLocaleString() }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="border-b border-gray-300 my-2"></div>
      </div>
    </div>
    <div class="mt-3 flex justify-center space-x-2">
      <button @click="goToPage(currentPage - 1)" :disabled="currentPage === 1"
        :class="['px-2 py-1 mx-1 rounded cursor-pointer', currentPage === 1 ? 'opacity-50' : 'hover:bg-gray-200']">
        <font-awesome-icon :icon="['fas', 'chevron-left']" class="text-customNavy" />
      </button>

      <button v-for="page in paginatedPageNumbers" :key="page" @click="goToPage(page)"
        :class="['px-3 rounded cursor-pointer hover:bg-gray-200', { 'bg-customNavy text-white': page === currentPage, 'bg-white': page !== currentPage }]">
        {{ page }}
      </button>

      <button @click="goToPage(currentPage + 1)" :disabled="currentPage === totalPages"
        :class="['px-2 py-1 mx-1 rounded cursor-pointer', currentPage === totalPages ? 'opacity-50' : 'hover:bg-gray-200']">
        <font-awesome-icon :icon="['fas', 'chevron-right']" class="text-customNavy" />
      </button>
    </div>
  </div>
</template>

<style scoped>
</style>
