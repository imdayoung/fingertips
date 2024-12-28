import apiInstance from "@/util/axios-instance";
import { jwtDecode } from "jwt-decode";

export function setTokens(accessToken, refreshToken) {
  const authData = JSON.parse(localStorage.getItem("auth")) || {};

  authData.accessToken = accessToken;
  authData.refreshToken = refreshToken;

  localStorage.setItem("auth", JSON.stringify(authData));
}

export function setGoogleIdToken(googleIdToken) {
  localStorage.setItem("googleIdToken", googleIdToken);
}

export async function refreshAccessToken() {
  try {
    const authData = JSON.parse(localStorage.getItem("auth"));
    const refreshToken = authData.refreshToken;
    const response = await apiInstance.post("/api/v1/member/refresh-token", {
      refreshToken,
    });
    const newAccessToken = response.data.accessToken;
    setTokens(newAccessToken, refreshToken);
    return newAccessToken;
  } catch (error) {
    throw error;
  }
}

export function clearTokens() {
  const authData = JSON.parse(localStorage.getItem("auth"));

  if (authData) {
    delete authData.accessToken;
    delete authData.refreshToken;

    localStorage.setItem("auth", JSON.stringify(authData));
  }
}

export function getAccessToken() {
  const authData = localStorage.getItem("auth");
  return authData ? authData.accessToken : null;
}

export function setLocalStorage(loginData) {
  if (!loginData.memberId) {
    console.error("memberId가 null입니다. 로그인 데이터:", loginData);
  }

  loginData.accessToken = `Bearer ${loginData.accessToken}`;
  loginData.refreshToken = `Bearer ${loginData.refreshToken}`;

  setTokens(loginData.accessToken, loginData.refreshToken);

  localStorage.setItem("auth", JSON.stringify(loginData.accessToken));
  localStorage.setItem("imageUrl", JSON.stringify(loginData.imageUrl));
}

export const decodeToken = (token) => {
  if (!token) return null;
  try {
    return jwtDecode(token);
  } catch (e) {
    console.error("JWT 디코딩 실패:", e);
    return null;
  }
};
