import { defineStore } from 'pinia';
import apiInstance from '@/util/axios-instance';

export const useAdminMetricsStore = defineStore('adminMetrics', {
  state: () => ({
    totalMembers: 0,
    totalLogins: 0,
    totalVisitors: 0,
    totalWithdrawals: 0,
    growthMetrics: {
      signUpGrowth: 0,
      loginGrowth: 0,
      visitGrowth: 0,
      withdrawalGrowth: 0,
    }
  }),
  actions: {
    async fetchCumulativeSignUpCount() {
      try {
        const response = await apiInstance.get('/admin/total/sign-up');
        this.totalMembers = response.data.data;
      } catch (error) {
        console.error('Error fetching cumulative sign-up count:', error);
      }
    },
    async fetchCumulativeLoginCount() {
      try {
        const response = await apiInstance.get('/admin/total/login');
        this.totalLogins = response.data.data;
      } catch (error) {
        console.error('Error fetching cumulative login count:', error);
      }
    },
    async fetchCumulativeVisitCount() {
      try {
        const response = await apiInstance.get('/admin/total/visit');
        this.totalVisitors = response.data.data;
      } catch (error) {
        console.error('Error fetching cumulative visit count:', error);
      }
    },
    async fetchCumulativeWithdrawalCount() {
      try {
        const response = await apiInstance.get('/admin/total/withdrawal');
        this.totalWithdrawals = response.data.data;
      } catch (error) {
        console.error('Error fetching cumulative withdrawal count:', error);
      }
    },
    async fetchGrowthMetrics() {
      try {
        const response = await apiInstance.get('/admin/growth/all');
        this.growthMetrics = response.data.data;
      } catch (error) {
        console.error('Error fetching growth metrics:', error);
      }
    }
  }
});
