<script setup>
import MostAndMaximumUsed from "@/components/analysis/MostAndMaximumUsed.vue";
import CategoryChart from "@/components/analysis/CategoryChart.vue";
import TotalAmount from "@/components/analysis/TotalAmount.vue";
import { ref, onMounted } from "vue";
import { useAuthStore } from "@/stores/auth.js";

const authStore = useAuthStore();
const memberName = authStore.member.memberName;

const isLoaded = ref(false);
const today = new Date();
const year = today.getFullYear();
const month = today.getMonth();

const startDate = ref(null);
const endDate = ref(null);

const getEndDay = (year, month) => {
  const isLeapYear = (year) =>
    (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  const daysInMonth = [
    31,
    isLeapYear(year) ? 29 : 28,
    31,
    30,
    31,
    30,
    31,
    31,
    30,
    31,
    30,
    31,
  ];
  return daysInMonth[month];
};

onMounted(() => {
  startDate.value = `${year}-${(month + 1).toString().padStart(2, '0')}-01`;
  endDate.value = `${year}-${(month + 1).toString().padStart(2, '0')}-${getEndDay(year, month)}`;
  isLoaded.value = true;
});
</script>

<template>
  <div v-if="isLoaded">
    <div>
      <div class="text-lg">
        이번 달 {{ memberName }}님의 소비 패턴을 분석해보았어요.
      </div>
      <div class="text-xl font-semibold mb-5">
        {{ year }}년 {{ month + 1 }}월
      </div>
    </div>
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-10">
      <MostAndMaximumUsed class="lg:col-span-1" :start-date="startDate" :end-date="endDate" period="이번 달" />
      <div class="lg:col-span-1 flex flex-col justify-between gap-10 h-full">
        <TotalAmount class="flex-1" :start-date="startDate" :end-date="endDate" />
      </div>
      <CategoryChart class="lg:col-span-1" chart-id="thisMonthCategory"
        :start-date="startDate" :end-date="endDate" period="이번 달" />
    </div>
  </div>
</template>

<style scoped></style>
