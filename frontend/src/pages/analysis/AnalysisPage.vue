<script setup>
import { ref, onMounted } from "vue";
import { useTransactionStore } from "@/stores/transaction";
import AIRecommendation from "@/components/analysis/AIRecommendation.vue";
import ConsumptionCalendar from "@/components/analysis/ConsumptionCalendar.vue";
import LineChart from "@/components/analysis/LineChart.vue";
import AnalysisThisMonth from "@/components/analysis/AnalysisThisMonth.vue";
import AnalysisSelectedPeriod from "@/components/analysis/AnalysisSelectedPeriod.vue";
import ConsumptionList from "@/components/analysis/ConsumptionList.vue";
import BarChart from "@/components/analysis/BarChart.vue";
import NoConnectedAsset from "@/components/analysis/NoConnectedAsset.vue";
import FixedExpenses from "@/components/analysis/FixedExpenses.vue";

const transactionStore = useTransactionStore();

const count = ref(0);

const isFlipped = ref(false);

const toggleCardFlip = () => {
  isFlipped.value = !isFlipped.value;
};

const isDataLoaded = ref(false);

const fetchTransaction = async () => {
  count.value = await transactionStore.fetchTransaction();
  isDataLoaded.value = true;
};

onMounted(async () => {
  await fetchTransaction();
});
</script>

<template>
  <div v-if="isDataLoaded" class="font-pretendard-regular">
    <div v-if="count > 0" class="mx-[20%] grid grid-cols-1 gap-10">
      <div class="flex justify-end gap-6">
        <div
          class="py-2 px-3 bg-gray-200 text-gray-600 text-center rounded-lg w-fit hover:bg-gray-400"
        >
          <router-link to="/mypage/asset">연결된 자산 확인하기</router-link>
        </div>
        <div
          class="py-2 px-3 bg-customNavy text-white rounded-lg hover:bg-customHover"
        >
          <button @click="toggleCardFlip">
            <div v-if="!isFlipped">과거 소비와 비교하기</div>
            <div v-else>이번 달 소비 분석하기</div>
          </button>
        </div>
      </div>
      <div class="flip w-full inline-block relative">
        <div
          class="card w-full inline-block relative flex"
          :class="{ '[transform:rotateY(180deg)]': isFlipped }"
        >
          <div class="front w-full absolute">
            <AnalysisThisMonth />
          </div>
          <div class="back w-full [transform:rotateY(180deg)]">
            <AnalysisSelectedPeriod />
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-5 gap-10">
        <div class="h-full lg:col-span-2 flex flex-col justify-between gap-10">
          <LineChart />
          <FixedExpenses />
        </div>
        <div class="h-full lg:col-span-3">
          <BarChart />
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-7 gap-10">
        <div class="lg:col-span-4">
          <ConsumptionCalendar />
        </div>
        <div class="lg:col-span-3">
          <ConsumptionList />
        </div>
      </div>

      <div>
        <AIRecommendation />
      </div>
    </div>
    <div v-else>
      <NoConnectedAsset />
    </div>
  </div>
</template>

<style scoped>
.flip {
  perspective: 5000px;
}

.card {
  transition: 0.4s;
  transform-style: preserve-3d;
}

.front,
.back {
  backface-visibility: hidden;
}
</style>
