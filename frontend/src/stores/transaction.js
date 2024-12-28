import { defineStore } from "pinia";
import apiInstance from "@/util/axios-instance";
import { useAuthStore } from "@/stores/auth.js";

export const useTransactionStore = defineStore("transaction", {
  actions: {
    async fetchTransaction() {
      try {
        const authStore = useAuthStore();
        const response = await apiInstance.post(
          `/transaction`,
          {},
          {
            headers: {
              Authorization: authStore.member.accessToken,
            },
          }
        );
        return response.data.data;
      } catch (err) {
        console.error(err);
      }
    },
    async getRecommendation() {
      try {
        const authStore = useAuthStore();
        const response = await apiInstance.get(`/transaction/recommendation`, {
          headers: {
            Authorization: authStore.member.accessToken,
          },
        });
        return response.data.data;
      } catch (err) {
        console.error(err);
      }
    },
    async getMonthlySummary(startDate, endDate) {
      try {
        const authStore = useAuthStore();
        const response = await apiInstance.get(
          `/transaction/summary?startDate=${startDate}&endDate=${endDate}`,
          {
            headers: {
              Authorization: authStore.member.accessToken,
            },
          }
        );
        return response.data.data;
      } catch (err) {
        console.error(err);
      }
    },
    async getMostAndMaximumUse(startDate, endDate) {
      try {
        const authStore = useAuthStore();
        const response = await apiInstance.get(
          `/transaction/top-usage?startDate=${startDate}&endDate=${endDate}`,
          {
            headers: {
              Authorization: authStore.member.accessToken,
            },
          }
        );
        return response.data.data;
      } catch (err) {
        console.error(err);
      }
    },
    async getFixedExpense() {
      try {
        const authStore = useAuthStore();
        const response = await apiInstance.get(`/transaction/fixed`, {
          headers: {
            Authorization: authStore.member.accessToken,
          },
        });
        return response.data.data;
      } catch (err) {
        console.error(err);
      }
    },
    async getDailyExpense() {
      try {
        const authStore = useAuthStore();
        const response = await apiInstance.get(`/transaction/daily`, {
          headers: {
            Authorization: authStore.member.accessToken,
          },
        });
        return response.data.data;
      } catch (err) {
        console.error(err);
      }
    },
    async getCategoryChartData(startDate, endDate) {
      try {
        const authStore = useAuthStore();
        const response = await apiInstance.get(
          `/transaction/category?startDate=${startDate}&endDate=${endDate}`,
          {
            headers: {
              Authorization: authStore.member.accessToken,
            },
          }
        );
        return response.data.data;
      } catch (err) {
        console.error(err);
      }
    },
    async getMonthlyExpenses() {
      try {
        const authStore = useAuthStore();
        const response = await apiInstance.get(`/transaction/monthly`, {
          headers: {
            Authorization: authStore.member.accessToken,
          },
        });
        return response.data.data;
      } catch (err) {
        console.error("Error fetching monthly expenses:", err);
      }
    },
    async getDailyTransactions(page, size) {
      try {
        const authStore = useAuthStore();
        const response = await apiInstance.get(
          `/transaction/daily-transactions?page=${page}&size=${size}`,
          {
            headers: {
              Authorization: authStore.member.accessToken,
            },
          }
        );

        if (response.data.success) {
          return {
            data: response.data.data.data,
            totalElements: response.data.data.totalElements,
            totalPages: response.data.data.totalPages,
          };
        } else {
          console.error("API 호출 실패:", response.data.error);
          return null;
        }
      } catch (err) {
        console.error(
          "getDailyTransactions 에러:",
          err.response ? err.response.data : err.message
        );
        return null;
      }
    },
    async getMonthlyDailySummary(startDate, endDate) {
      try {
        const authStore = useAuthStore();
        const response = await apiInstance.get(
          `/transaction/monthly/summary?startDate=${startDate}&endDate=${endDate}`,
          {
            headers: {
              Authorization: authStore.member.accessToken,
            },
          }
        );
        return response.data.data;
      } catch (err) {
        console.error(err);
      }
    },
  },
});
