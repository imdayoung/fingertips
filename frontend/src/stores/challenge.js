import { defineStore } from "pinia";
import apiInstance from "@/util/axios-instance";
import { useAuthStore } from "@/stores/auth.js";

export const useChallengeStore = defineStore("challenge", {
  state: () => ({
    challengeList: [],
    detailedCategories: [],
    chartData: [],
    peerChallengeList: [],
  }),

  actions: {
    async getChallengeList() {
      try {
        const authStore = useAuthStore();
        const res = await apiInstance.get(`/challenge`, {
          headers: {
            Authorization: authStore.member.accessToken,
          },
        });

        const statusPriority = { 진행: 1, 예정: 2, 종료: 3 };
        this.challengeList = res.data.data;
        this.challengeList = this.challengeList.sort((a, b) => {
          if (
            statusPriority[a.challengeStatus] !==
            statusPriority[b.challengeStatus]
          ) {
            return (
              statusPriority[a.challengeStatus] -
              statusPriority[b.challengeStatus]
            );
          }

          if (a.challengeStatus === "진행") {
            return new Date(a.challengeEndDate) - new Date(b.challengeEndDate);
          }

          if (a.challengeStatus === "예정") {
            return (
              new Date(a.challengeStartDate) - new Date(b.challengeStartDate)
            );
          }

          return 0;
        });
        console.log(this.challengeList);
      } catch (error) {
        console.error("Error fetching challenges:", error);
        throw error;
      }
    },

    async insertChallenge(challengeData) {
      try {
        const authStore = useAuthStore();
        const res = await apiInstance.post(`/challenge`, challengeData, {
          headers: {
            Authorization: authStore.member.accessToken,
          },
        });

        this.challengeList.push(challengeData);
      } catch (error) {
        console.error("Error adding challenge:", error);
        throw error;
      }
    },

    async deleteChallenge(challengeId) {
      try {
        const authStore = useAuthStore();
        const res = await apiInstance.post(
          `/challenge/${challengeId}`,
          {},
          {
            headers: {
              Authorization: authStore.member.accessToken,
            },
          }
        );

        const index = this.challengeList.findIndex(
          (item) => item.id === challengeId
        );
        if (index !== -1) {
          this.challengeList.splice(index, 1);
        }
      } catch (error) {
        console.error("Error deleting challenge:", error);
        throw error;
      }
    },

    async getDetailedCategory(categoryId) {
      try {
        const authStore = useAuthStore();
        const res = await apiInstance.get(
          `/challenge/detailed-category/${categoryId}`,
          {
            headers: {
              Authorization: authStore.member.accessToken,
            },
          }
        );
        this.detailedCategories = res.data.data;
      } catch (errpt) {
        console.error("Error fetching detailed categories:", errpt);
      }
    },

    async getChallengeStatus() {
      try {
        const authStore = useAuthStore();
        const res = await apiInstance.get(`/challenge/status`, {
          headers: {
            Authorization: authStore.member.accessToken,
          },
        });
        this.chartData = res.data.data;
        if (this.challengeList.length > 0) {
          const challengeOrder = this.challengeList.map(
            (challenge) => challenge.challengeIdx
          );

          this.chartData = this.chartData.sort((a, b) => {
            return (
              challengeOrder.indexOf(a.challengeIdx) -
              challengeOrder.indexOf(b.challengeIdx)
            );
          });
        }
      } catch (error) {
        console.error("Error fetching chart data:", error);
      }
    },

    async getPeerChallengeList() {
      try {
        const authStore = useAuthStore();
        const res = await apiInstance.get(`/challenge/peer`, {
          headers: {
            Authorization: authStore.member.accessToken,
          },
        });
        this.peerChallengeList = res.data.data;
      } catch (error) {
        console.error("Error fetching peer challenge data:", error);
      }
    },
  },
});
