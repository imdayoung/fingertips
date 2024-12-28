<script>
import CumulativeMetricsCard from '@/components/admin/CumulativeMetricsCard.vue';
import TestBarChart from '@/components/admin/TestBarChart.vue';
import TodayLineChart from '@/components/admin/TodayLineChart.vue';
import Sidebar from '@/components/admin/sidebar.vue';

export default {
  components: {
    CumulativeMetricsCard,
    TodayLineChart,
    TestBarChart,
    Sidebar,
  }
};
</script>

<template>
  <div class="flex flex-col md:flex-row">
    <Sidebar />

    <div class="flex-1 p-6">
      <CumulativeMetricsCard />
      <TodayLineChart />
      <TestBarChart />
    </div>
  </div>
</template>

<style scoped>
@media (min-width: 768px) {
  .sidebar {
    width: 250px;
  }
}
</style>
