import { defineStore } from "pinia";
import apiInstance from "@/util/axios-instance";
import { useAuthStore } from "@/stores/auth.js";

export const useAssetStore = defineStore("asset", {
  state: () => ({
    allAssetList: [],
    allAccountList: [],
    connectedAccountList: [],
    allCardList: [],
    connectedCardList: [],
  }),
  actions: {
    async getAssetList() {
      try {
        const authStore = useAuthStore();
        const response = await apiInstance.get(`/asset`, {
          headers: {
            Authorization: authStore.member.accessToken,
          },
        });
        this.allAssetList = response.data.data;
        this.allAccountList = this.allAssetList.filter(
          (asset) => asset.assetType === 'account'
        );
        this.allCardList = this.allAssetList.filter(
          (asset) => asset.assetType === 'card'
        );
        this.connectedAccountList = this.allAccountList.filter(
          (asset) => asset.connectedStatus === 1
        );
        this.connectedCardList = this.allCardList.filter(
          (asset) => asset.connectedStatus === 1
        );
      } catch (error) {
        throw error;
      }
    },

    async updateAccountStatus(selectedAccount) {
      try {
        const accountIdx = selectedAccount.assetIdx;
        const authStore = useAuthStore();
        const response = await apiInstance.post(
          `/asset/account/${accountIdx}`,
          {},
          {
            headers: {
              Authorization: authStore.member.accessToken,
            },
          }
        );
        this.connectedAccountList.push(selectedAccount);
        return response.data;
      } catch (error) {
        throw error;
      }
    },

    async updateCardStatus(selectedCard) {
      try {
        const cardIdx = selectedCard.assetIdx;
        const authStore = useAuthStore();
        const response = await apiInstance.post(
          `/asset/card/${cardIdx}`,
          {},
          {
            headers: {
              Authorization: authStore.member.accessToken,
            },
          }
        );
        this.connectedCardList.push(selectedCard);
        return response.data;
      } catch (error) {
        throw error;
      }
    },

    async disconnectCard(cardIdx) {
      try {
        const authStore = useAuthStore();
        const response = await apiInstance.post(
          `/asset/card/disconnect/${cardIdx}`,
          {},
          {
            headers: {
              Authorization: authStore.member.accessToken,
            },
          }
        );

        this.connectedCardList = this.connectedCardList.filter(
          (card) => card.cardIdx !== cardIdx
        );
      } catch (error) {
        throw error;
      }
    },

    async disconnectAccount(accountIdx) {
      try {
        const authStore = useAuthStore();
        const response = await apiInstance.post(
          `/asset/account/disconnect/${accountIdx}`,
          {},
          {
            headers: {
              Authorization: authStore.member.accessToken,
            },
          }
        );
        this.connectedAccountList = this.connectedAccountList.filter(
          (account) => account.cardIdx !== accountIdx
        );
        return response.data;
      } catch (error) {
        throw error;
      }
    },
  },
});
