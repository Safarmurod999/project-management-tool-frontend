import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

// asosiy client
export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// refresh uchun alohida client (MUHIM)
const refreshClient = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// request interceptor
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// refresh lock + queue
let isRefreshing = false;
let queue: {
  resolve: (token: string) => void;
  reject: (err: any) => void;
}[] = [];

const processQueue = (error: any, token: string | null) => {
  queue.forEach((p) => {
    if (error) {
      p.reject(error);
    } else if (token) {
      p.resolve(token);
    }
  });
  queue = [];
};

// response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest: any = error.config;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    const url = originalRequest.url || "";

    const shouldRefresh =
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !url.includes("/auth/login") &&
      !url.includes("/auth/refresh");

    if (!shouldRefresh) {
      return Promise.reject(error);
    }

    // agar refresh allaqachon ketayotgan bo‘lsa
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        queue.push({
          resolve: (token: string) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(apiClient(originalRequest));
          },
          reject,
        });
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const res = await refreshClient.post("/auth/refresh");
      const newToken = res.data;

      localStorage.setItem("access_token", newToken);

      processQueue(null, newToken);

      originalRequest.headers.Authorization = `Bearer ${newToken}`;
      return apiClient(originalRequest);
    } catch (err) {
      processQueue(err, null);

      localStorage.removeItem("access_token");
      window.location.href = "/login";

      return Promise.reject(err);
    } finally {
      isRefreshing = false;
    }
  },
);
