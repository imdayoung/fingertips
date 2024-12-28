<script setup>
import { ref, onMounted, watch } from "vue";
import { useTransactionStore } from "@/stores/transaction";

const transactionStore = useTransactionStore();
const now = new Date();
const currentYear = ref(now.getFullYear());
const currentMonth = ref(now.getMonth());

const weekDays = ["일", "월", "화", "수", "목", "금", "토"];

const daysInMonth = ref([]);
const dailySummary = ref([]);

const getDailySummary = (date) => {
  const summary = dailySummary.value.find(item => parseInt(item.date.slice(-2)) === date);
  return summary || { income: 0, expense: 0 };
};

const getEndDay = (year, month) => {
  const isLeapYear = (year) =>
    (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  const daysInMonth = [31, isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  return daysInMonth[month];
};

const getMonthInfo = (year, month) => {
  const startDay = new Date(year, month, 1).getDay();
  const endDate = new Date(year, month + 1, 0).getDate();
  return { startDay, endDate };
};

const calendarGenerator = (year, month) => {
  const { endDate, startDay } = getMonthInfo(year, month);
  const weekNumber = Math.ceil((startDay + endDate) / 7);
  const calendar = [];

  let nowDate = 0;
  let nowDay = 0;

  for (let i = 0; i < weekNumber; i++) {
    const nowWeek = [];
    for (let j = 0; j < 7; j++) {
      if (startDay <= nowDay && nowDate < endDate) {
        nowDate++;
        nowWeek.push(nowDate);
      } else {
        nowWeek.push(0);
      }
      nowDay++;
    }
    calendar.push(nowWeek);
  }

  return calendar;
};

const generateCalendar = () => {
  daysInMonth.value = calendarGenerator(currentYear.value, currentMonth.value);
};

const nextMonth = () => {
  if (currentMonth.value === 11) {
    currentMonth.value = 0;
    currentYear.value++;
  } else {
    currentMonth.value++;
  }
};

const prevMonth = () => {
  if (currentMonth.value === 0) {
    currentMonth.value = 11;
    currentYear.value--;
  } else {
    currentMonth.value--;
  }
};

const getSummary = async (startDate, endDate) => {
  const response = await transactionStore.getMonthlyDailySummary(startDate, endDate);
  dailySummary.value = response;
};

onMounted(() => {
  const lastDate = getEndDay(currentYear.value, currentMonth.value);
  const startDate = `${currentYear.value}-${(currentMonth.value + 1).toString().padStart(2, '0')}-01`;
  const endDate = `${currentYear.value}-${(currentMonth.value + 1).toString().padStart(2, '0')}-${lastDate}`;
  generateCalendar();
  getSummary(startDate, endDate);
});

watch([currentYear, currentMonth], async () => {
  generateCalendar();
  const lastDate = getEndDay(currentYear.value, currentMonth.value);
  const startDate = `${currentYear.value}-${(currentMonth.value + 1).toString().padStart(2, '0')}-01`;
  const endDate = `${currentYear.value}-${(currentMonth.value + 1).toString().padStart(2, '0')}-${lastDate}`;
  await getSummary(startDate, endDate);
});

</script>

<template>
  <div class="py-6 w-full border rounded-xl shadow overflow-auto">
    <div class="flex justify-center items-center text-lg">
      <button class="px-3" @click="prevMonth"><font-awesome-icon :icon="['fas', 'chevron-left']" /></button>
      <span class="font-bold text-center">{{ currentYear }}년 {{ currentMonth + 1 }}월</span>
      <button class="px-3" @click="nextMonth"><font-awesome-icon :icon="['fas', 'chevron-right']" /></button>
    </div>

    <table class="w-full table-fixed border-none">
      <thead>
        <tr>
          <th class="p-5" v-for="day in weekDays" :key="day">{{ day }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(week, index) in daysInMonth" :key="index">
          <td v-for="(day, dayIndex) in week" :key="dayIndex" class="text-center py-2">
            <div v-if="day !== 0" class="mb-1">
              <div class="mb-1">{{ day }}</div>
              <div>
                <div class="text-customBlue text-xs mb-1">
                  {{ getDailySummary(day).income !== 0 ? getDailySummary(day).income.toLocaleString() : "&nbsp;" }}
                </div>
                <div class="text-customRed text-xs">
                  {{ getDailySummary(day).expense !== 0 ? getDailySummary(day).expense.toLocaleString() : "&nbsp;" }}
                </div> 
              </div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped></style>
