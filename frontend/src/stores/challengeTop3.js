import { defineStore } from "pinia";
import apiInstance from "@/util/axios-instance";
import { useAuthStore } from "@/stores/auth.js";

export const useChallengeTop3Store = defineStore("challengeTop3", {
  state: () => ({
    ChallengeTop3List: [],
    PeerChallengeList: [],
  }),
  actions: {
    async getChallengeTop3() {
      try {
        const authStore = useAuthStore();
        const response = await apiInstance.get(`/home/challenge`, {
          headers: {
            Authorization: authStore.member.accessToken,
          },
        });
        this.ChallengeTop3List = response.data.data;
      } catch (error) {
        console.error("Failed to fetch challenge top 3: ", error);
        throw error;
      }
    },

    async getPeerChallenge() {
      try {
        const authStore = useAuthStore();
        const response = await apiInstance.get(`/home/peerChallenge`, {
          headers: {
            Authorization: authStore.member.accessToken,
          },
        });
        this.PeerChallengeList = response.data.data;
      } catch (error) {
        console.error("Failed to fetch peer challenge: ", error);
        throw error;
      }
    },
  },
});
