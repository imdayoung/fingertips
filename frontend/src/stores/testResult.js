import { defineStore } from "pinia";
import apiInstance from "@/util/axios-instance";
import { useAuthStore } from "@/stores/auth.js";

export const useTestResultStore = defineStore("testResult", {
  state: () => ({
    TestResult: [],
  }),

  actions: {
    async getTestResult() {
      try {
        const authStore = useAuthStore();
        const response = await apiInstance.get(`/home/test`, {
          headers: {
            Authorization: authStore.member.accessToken,
          },
        });
        this.TestResult = response.data.data;
      } catch (error) {
        console.error("Failed to fetch test result : ", error);
        throw error;
      }
    },
  },
});
