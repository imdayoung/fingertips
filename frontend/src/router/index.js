import { createRouter, createWebHistory } from "vue-router";
import HomePage from "@/pages/home/HomePage.vue";
import FindMember from "@/pages/login/FindMember.vue"
import LoginPage from "@/pages/login/LoginPage.vue";
import JoinPage from "@/pages/join/JoinPage.vue";
import MyPage from "@/pages/mypage/MyPage.vue";
import ChallengePage from "@/pages/challenge/ChallengePage.vue";
import AnalysisPage from "@/pages/analysis/AnalysisPage.vue";
import AssetPage from "@/pages/connection/AssetPage.vue";
import TestStartPage from "@/pages/test/TestStartPage.vue";
import TestQuestionPage from "@/pages/test/TestQuestionPage.vue";
import TestResultPage from "@/pages/test/TestResultPage.vue";
import TestLoadingPage from "@/pages/test/TestLoadingPage.vue";
import TestSurveyPage from "@/pages/test/TestSurveyPage.vue";
import GoogleCallBack from "@/pages/login/GoogleCallBack.vue";
import { useAuthStore } from '@/stores/auth';
import Admin from "@/pages/admin/Admin.vue"
import PageNotFound from "@/pages/common/PageNotFound.vue";
import GuestAnalysis from "@/components/analysis/GuestAnalysis.vue";
import GuestChallenge from "@/components/challenge/GuestChallenge.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "homePage",
      component: HomePage,
    },
    {
      path: "/login",
      name: "login",
      component: LoginPage,
    },
    {
      path: "/join",
      name: "join",
      component: JoinPage,
    },
    {
      path: "/google-callback",
      name: "googleCallback",
      component: GoogleCallBack,
    },
    {
      path: "/mypage",
      name: "mypage",
      component: MyPage,
      meta: { requiresAuth: true },
    },
    {
      path: "/challenge",
      name: "challenge",
      component: ChallengePage,
      meta: { requiresAuth: true },
    },
    {
      path: "/analysis",
      name: "analysis",
      component: AnalysisPage,
      meta: { requiresAuth: true },
    },
    {
      path: "/mypage/asset",
      name: "asset",
      component: AssetPage,
      meta: { requiresAuth: true },
    },
    {
      path: "/find",
      name: "find",
      component: FindMember,
      props: true,
    },
    {
      path: "/test/start",
      name: "testStart",
      component: TestStartPage,
    },
    {
      path: "/test/survey",
      name: "testSurvey",
      component: TestSurveyPage,
    },
    {
      path: "/test/question/:number",
      name: "testQuestion",
      component: TestQuestionPage,
    },
    {
      path: "/test/loading",
      name: "testLoading",
      component: TestLoadingPage,
    },
    {
      path: "/test/result/:resultId",
      name: "testResult",
      component: TestResultPage,
    },
    {
      path: '/admin',
      name: 'Admin',
      component: Admin,
    },
    {
      path: '/404',
      name: 'notFound',
      component: PageNotFound
    },
    {
      path: "/:pathMatch(.*)",
      redirect: '/404'
    },
    {
      path: "/analysis/guest",
      name: "guestAnalysis",
      component: GuestAnalysis
    },
    {
      path: "/challenge/guest",
      name: "guestChallenge",
      component: GuestChallenge
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    return { top: 0 };
  },
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const isLoggedIn = authStore.isLogin();
  const userRole = authStore.member.role;

  if (to.path.startsWith('/admin') && (!isLoggedIn || userRole !== 'ROLE_ADMIN')) {
    alert("관리자 권한이 필요합니다.");
    authStore.clearAuthState();
    localStorage.clear();
    next('/login');
  } 
  else if (to.meta.requiresAuth && !isLoggedIn) {
    next('/login');
  } 

  else {
    next();
  }
});

export default router;
