import { defineStore } from "pinia";
import apiInstance from "@/util/axios-instance";
import { useAuthStore } from "@/stores/auth.js";

export const useBalanceStore = defineStore("balance", {
  state: () => ({
    TotalBalanceList: [],
  }),
  actions: {
    async getTotalBalance() {
      try {
        const authStore = useAuthStore();
        const response = await apiInstance.post(
          `/home/balance`,
          {},
          {
            headers: {
              Authorization: authStore.member.accessToken,
            },
          }
        );
        this.TotalBalanceList = response.data.data;
      } catch (error) {
        console.error("Failed to fetch total balance: ", error);
        throw error;
      }
    },
  },
});
