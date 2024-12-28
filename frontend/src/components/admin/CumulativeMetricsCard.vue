<script setup>
import { onMounted } from 'vue';
import { useAdminMetricsStore } from '@/stores/adminMetrics';

const adminMetricsStore = useAdminMetricsStore();

onMounted(() => {
  adminMetricsStore.fetchCumulativeSignUpCount();
  adminMetricsStore.fetchCumulativeLoginCount();
  adminMetricsStore.fetchCumulativeVisitCount();
  adminMetricsStore.fetchCumulativeWithdrawalCount();
  adminMetricsStore.fetchGrowthMetrics();
});
</script>

<template>
  <div class="flex">
    <div class="flex-1 p-8">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">

        <div class="card bg-white border border-gray-200 rounded-lg shadow-lg p-6 flex flex-col justify-between hover:shadow-xl transition-transform transform hover:scale-105">
          <div>
            <p class="text-gray-500 text-sm font-semibold mb-2 flex items-center">
              <i class="fas fa-user text-pink-500 mr-2"></i> SignUp
            </p>
            <p class="text-3xl font-bold text-gray-900">{{ adminMetricsStore.totalMembers }}</p>
            <p class="text-sm text-green-500 mt-1">+{{ adminMetricsStore.growthMetrics.signUpGrowth.toFixed(1) }}%</p>
          </div>
        </div>

        <div class="card bg-white border border-gray-200 rounded-lg shadow-lg p-6 flex flex-col justify-between hover:shadow-xl transition-transform transform hover:scale-105">
          <div>
            <p class="text-gray-500 text-sm font-semibold mb-2 flex items-center">
              <i class="fas fa-eye text-blue-500 mr-2"></i> Visit
            </p>
            <p class="text-3xl font-bold text-gray-900">{{ adminMetricsStore.totalVisitors }}</p>
            <p class="text-sm text-red-500 mt-1">{{ adminMetricsStore.growthMetrics.visitGrowth.toFixed(1) }}%</p>
          </div>
        </div>

        <div class="card bg-white border border-gray-200 rounded-lg shadow-lg p-6 flex flex-col justify-between hover:shadow-xl transition-transform transform hover:scale-105">
          <div>
            <p class="text-gray-500 text-sm font-semibold mb-2 flex items-center">
              <i class="fas fa-sign-in-alt text-purple-500 mr-2"></i> Login
            </p>
            <p class="text-3xl font-bold text-gray-900">{{ adminMetricsStore.totalLogins }}</p>
            <p class="text-sm text-green-500 mt-1">{{ adminMetricsStore.growthMetrics.loginGrowth.toFixed(1) }}%</p>
          </div>
        </div>
				
        <div class="card bg-white border border-gray-200 rounded-lg shadow-lg p-6 flex flex-col justify-between hover:shadow-xl transition-transform transform hover:scale-105">
          <div>
            <p class="text-gray-500 text-sm font-semibold mb-2 flex items-center">
              <i class="fas fa-user-minus text-yellow-500 mr-2"></i> Withdrawal
            </p>
            <p class="text-3xl font-bold text-gray-900">{{ adminMetricsStore.totalWithdrawals }}</p>
            <p class="text-sm text-green-500 mt-1">{{ adminMetricsStore.growthMetrics.withdrawalGrowth.toFixed(1) }}%</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css');

body {
  font-family: 'Inter', sans-serif;
}

.card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.grid {
  gap: 1.5rem;
}

p {
  margin: 0;
}

h2 {
  font-weight: 700;
  color: #333;
}

aside {
  width: 250px;
  background-color: #f8f9fa;
  padding: 20px;
  position: fixed;
  height: 100%;
  top: 0;
  left: 0;
}

aside a {
  display: block;
  color: #666;
  font-size: 14px;
  margin: 20px 0;
  padding: 10px 15px;
  text-decoration: none;
  border-radius: 4px;
}

aside a:hover {
  background-color: #e2e6ea;
  color: #333;
}

aside a i {
  margin-right: 10px;
}

aside a.active {
  background-color: #007bff;
  color: #fff;
}

aside a.active:hover {
  background-color: #0056b3;
}

aside .bottom {
  margin-top: auto;
}
</style>
