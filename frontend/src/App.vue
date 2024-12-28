<script setup>
import { RouterLink, RouterView } from "vue-router";
import Header from "@/components/common/Header.vue";
import Footer from "@/components/common/Footer.vue";
import AdminHeader from "@/components/common/AdminHeader.vue";
import { useRoute } from "vue-router";

const route = useRoute();

</script>

<template>
  <AdminHeader v-if="route.path.startsWith('/admin')" />
  <Header v-else />
  <RouterView />
  <Footer />
</template>

<style scoped></style>
