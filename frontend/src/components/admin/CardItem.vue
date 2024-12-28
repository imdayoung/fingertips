<template>
    <div :class="['p-4 rounded shadow', color]">
      <div class="font-semibold">{{ title }}</div>
      <div class="text-2xl">{{ value }}</div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      title: String,  
      value: Number,   
      color: String,   
    },
  };
  </script>
  