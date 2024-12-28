<script setup>
import { ref, onMounted } from 'vue';

const props = defineProps({
  limit: Number,
  completed: Number,
});

const progressWidth = ref('0%');
const emojiPosition = ref(0);

const moveEmoji = () => {
  const percentage = (props.completed / props.limit) * 100;
  emojiPosition.value = Math.min(percentage, 96);
};

onMounted(() => {
  setTimeout(() => {
    const percentage = (props.completed / props.limit) * 100;
    progressWidth.value = percentage >= 100 ? '100%' : percentage + '%';
    moveEmoji();
  }, 100);
});
</script>

<template>
  <div>
    <div class="relative">
      <div class="rounded-full h-5 bg-gray-200">
        <div class="h-full rounded-full bg-red-600 progress-bar" :style="{ width: progressWidth }"></div>
      </div>
      
      <div class="absolute top-[-25px] transition-transform text-2xl" :style="{ left: `calc(${emojiPosition}% - 10px)` }">
        <span role="img" aria-label="emoji"><img class="w-6" src="@/assets/siren.png" /></span>
      </div>

      <div class="absolute top-[20px] text-xs transition-transform"
        :style="[completed < limit ? { left: `calc(${emojiPosition}% - 10px)` } : {right : 0}]">
        {{ completed.toLocaleString() }}
      </div>

      <div v-if="completed < limit" class="absolute top-[20px] right-0 text-xs">
        {{ limit.toLocaleString() }}
      </div>
    </div>
  </div>
</template>

<style>
.progress-bar {
  transition: width 1s ease;
}
.transition-transform {
  transition: left 1s ease;
}
</style>
