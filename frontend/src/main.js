import "./assets/main.css";
import "./assets/tailwind.css";

import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";

import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";

import socket from "./util/socket";
import { useAuthStore } from "./stores/auth";

library.add(fas, far, fab);
const app = createApp(App);

const pinia = createPinia();

app.use(createPinia());
app.use(router);

app.component("font-awesome-icon", FontAwesomeIcon);

const authStore = useAuthStore();
authStore.loadAuthState();

if (window.Kakao && !window.Kakao.isInitialized()) {
  window.Kakao.init(import.meta.env.VITE_KAKAO_KEY);
}

app.mount("#app");

function initializeSocket() {
  socket.on("authUpdate", (socketAuthData) => {
    const localAuth = JSON.parse(localStorage.getItem("auth"));
    if (
      localAuth &&
      (authStore.member.memberName !== socketAuthData.memberName ||
        authStore.member.memberId !== socketAuthData.memberId ||
        authStore.member.memberIdx !== socketAuthData.memberIdx)
    ) {
      router.push("/");
    }
  });
}

authStore.$subscribe((mutation, state) => {
  console.log("is_login", authStore.isLogin());
  if (authStore.isLogin()) {
    initializeSocket();
  }
});

window.addEventListener("storage", (event) => {
  if (event.key === "auth") {
    const newAuthData = JSON.parse(event.newValue);
    const oldAuthData = JSON.parse(event.oldValue);

    if (
      newAuthData &&
      oldAuthData &&
      oldAuthData.memberIdx !== newAuthData.memberIdx
    ) {
      localStorage.removeItem("auth");
      authStore.clearAuthState();
    }
  }
});
