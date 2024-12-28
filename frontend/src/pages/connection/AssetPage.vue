<script setup>
import ConnectedAccount from '@/components/connection/ConnectedAccount.vue';
import ConnectedCard from '@/components/connection/ConnectedCard.vue';
</script>

<template>
  <div class="mx-[20%] grid grid-cols-1 lg:grid-cols-2 gap-16 min-h-160 font-pretendard-regular">
    <div class="">
      <ConnectedAccount />
    </div>
    <div class="">
      <ConnectedCard />
    </div>
  </div>
</template>

<style scoped>
.min-h-160 {
  min-height: 40rem;
}
</style>

