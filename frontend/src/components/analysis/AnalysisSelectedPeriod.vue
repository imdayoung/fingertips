<script setup>
import { ref, onMounted, watch } from "vue";
import MostAndMaximumUsed from "@/components/analysis/MostAndMaximumUsed.vue";
import CategoryChart from "@/components/analysis/CategoryChart.vue";
import TotalAmount from "@/components/analysis/TotalAmount.vue";
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';

const today = new Date();

const selectedStartYear = ref(0);
const selectedStartMonth = ref(0);
const selectedStartDate = ref(0);
const selectedEndYear = ref(0);
const selectedEndMonth = ref(0);
const selectedEndDate = ref(0);

const date = ref(null);
const startDate = ref(null);
const endDate = ref(null);

const componentKey = ref(0);

const isLoaded = ref(false);

const getEndDay = (year, month) => {
  const isLeapYear = (year) => (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  const daysInMonth = [31, isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  return daysInMonth[month];
};

const getLastMonth = () => {
  const year = today.getFullYear();
  const month = today.getMonth();

  let lastMonthYear = year;
  let lastMonth = month - 1;

  if (lastMonth < 0) {
    lastMonth = 11;
    lastMonthYear--;
  }

  return new Date(lastMonthYear, lastMonth, getEndDay(lastMonthYear, lastMonth));
};

const updateSelectedDates = () => {
  const [start, end] = date.value;

  if (start) {
    selectedStartYear.value = start.getFullYear();
    selectedStartMonth.value = start.getMonth();
    selectedStartDate.value = start.getDate();
  }

  if (end) {
    selectedEndYear.value = end.getFullYear();
    selectedEndMonth.value = end.getMonth();
    selectedEndDate.value = end.getDate();
  }

  startDate.value = `${selectedStartYear.value}-${(selectedStartMonth.value + 1).toString().padStart(2, '0')}-01`;
  endDate.value = `${selectedEndYear.value}-${(selectedEndMonth.value + 1).toString().padStart(2, '0')}-${selectedEndDate.value.toString().padStart(2, '0')}`;

  componentKey.value++;
};

onMounted(() => {
  const lastMonthLastDate = getLastMonth();
  selectedStartYear.value = lastMonthLastDate.getFullYear();
  selectedStartMonth.value = lastMonthLastDate.getMonth();
  selectedStartDate.value = 1;
  selectedEndYear.value = lastMonthLastDate.getFullYear();
  selectedEndMonth.value = lastMonthLastDate.getMonth();
  selectedEndDate.value = lastMonthLastDate.getDate();

  const dateStartDate = new Date(selectedStartYear.value, selectedStartMonth.value, selectedStartDate.value);
  const dateEndDate = new Date(selectedEndYear.value, selectedEndMonth.value, selectedEndDate.value);

  startDate.value = `${selectedStartYear.value}-${(selectedStartMonth.value + 1).toString().padStart(2, '0')}-01`;
  endDate.value = `${selectedEndYear.value}-${(selectedEndMonth.value + 1).toString().padStart(2, '0')}-${selectedEndDate.value.toString().padStart(2, '0')}`;

  date.value = [dateStartDate, dateEndDate];
  isLoaded.value = true;
});

</script>

<template>
  <div>
    <div v-if="isLoaded">
      <div class="flex justify-between">
        <div>
          <div class="text-lg">이번 달 나의 소비 습관을 다른 달과 비교해볼까요?</div>
          <div class="text-xl font-semibold mb-5">
            {{ selectedStartYear }}년 {{ selectedStartMonth + 1 }}월 {{ selectedStartDate }}일 -
            {{ selectedEndYear }}년 {{ selectedEndMonth + 1 }}월 {{ selectedEndDate }}일
          </div>
        </div>
        <div>
          <VueDatePicker class="min-w-64" v-model="date" range :format="'yyyy-MM-dd'" @update:model-value="updateSelectedDates">
            <template #time-picker></template>
            <template #action-row="{ selectDate, closePicker }">
              <div class="action-row mx-auto">
                <button class="select-button text-sm px-2 py-1 rounded-lg" @click="closePicker">취소</button>
                <button class="select-button text-sm px-2 py-1 rounded-lg" @click="selectDate">기간 설정</button>
              </div>
            </template>
          </VueDatePicker>
        </div>
      </div>
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <MostAndMaximumUsed 
          :key="componentKey" 
          class="lg:col-span-1" 
          :start-date="startDate" 
          :end-date="endDate" 
          period="해당 기간" 
        />
        <div class="lg:col-span-1 flex flex-col justify-between gap-10 h-full">
          <TotalAmount 
            :key="componentKey" 
            class="flex-1" 
            :start-date="startDate" 
            :end-date="endDate" 
          />
        </div>
        <CategoryChart 
          :key="componentKey" 
          class="lg:col-span-1" 
          chart-id="selectedPeriodCategory"
          :start-date="startDate" 
          :end-date="endDate" 
          period="해당 기간" 
        />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
