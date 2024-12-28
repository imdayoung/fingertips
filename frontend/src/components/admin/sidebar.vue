<script setup>
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "vue-router";

const authStore = useAuthStore();
const router = useRouter();

const logout = async () => {
  await authStore.logout();
  authStore.clearAuthState();
  localStorage.clear(); 
  router.push('/');
};
</script>

<template>
  <aside class="w-full md:w-64 bg-white h-screen p-6 fixed md:relative shadow-lg">
		
    <nav class="space-y-4">
      <a href="#" class="flex items-center space-x-3 text-blue-500 bg-blue-100 p-2 rounded-md">
        <i class="fas fa-th-large"></i>
        <span>Overview</span>
      </a>
    </nav>

    <div class="sticky bottom-6 w-full">
      <a @click="logout" class="flex items-center space-x-3 text-gray-600 hover:text-blue-500 p-2 rounded-md cursor-pointer">
        <i class="fas fa-sign-out-alt"></i>
        <span>Log Out</span>
      </a>
    </div>
  </aside>
</template>

<style scoped>
aside {
  background-color: #fff;
}

aside a {
  display: block;
  color: #666;
  font-size: 14px;
  margin: 20px 0;
  padding: 10px 15px;
  text-decoration: none;
  border-radius: 4px;
}

aside a:hover {
  background-color: #e2e6ea;
  color: #333;
}

aside a i {
  margin-right: 10px;
}

aside a.active {
  background-color: #007bff;
  color: #fff;
}

aside a.active:hover {
  background-color: #0056b3;
}

.sticky {
  position: sticky;
  bottom: 1.5rem;
}
</style>
