import axios from "axios";

// Function to create an Axios instance with dynamic baseURL
const createAxiosInstance = (baseURL:any) => {
  const instance = axios.create({
    baseURL,
    headers: { "Content-Type": "application/json" },
  });

  instance.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  let isRefreshing = false;
  let refreshSubscribers: ((token: string) => void)[] = []; // Explicit type
  
  const onRefreshed = (token: string) => {
    refreshSubscribers.forEach((callback) => callback(token));
    refreshSubscribers = []; // Reset the array after executing callbacks
  };
  

  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        const refreshToken = localStorage.getItem("refresh_token");
        if (!refreshToken) {
          localStorage.removeItem("token");
          window.location.href = "/auth/login";
          return Promise.reject(error);
        }

        if (!isRefreshing) {
          isRefreshing = true;
          try {
            const res = await authAxios.post(
              `/AdminAuth/refresh-token`,{
                rtoken:refreshToken
              }
            );
            console.log("new token fetched");

            const { access_token, refresh_token: newRefreshToken } = res.data?.data;

            localStorage.setItem("token", access_token);
            localStorage.setItem("refresh_token", newRefreshToken);
            isRefreshing = false;
            onRefreshed(access_token);

            return instance(originalRequest);
          } catch (refreshError) {
            isRefreshing = false;
            localStorage.removeItem("token");
            localStorage.removeItem("refresh_token");
            window.location.href = "/auth/login";
            return Promise.reject(refreshError);
          }
        }

        return new Promise((resolve) => {
          refreshSubscribers.push((token:any) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(instance(originalRequest));
          });
        });
      }

      return Promise.reject(error.response?.data?.error || error.message);
    }
  );

  return instance;
};


export const authAxios = createAxiosInstance(import.meta.env.VITE_API_AUTH_URL);
export const businessAxios = createAxiosInstance(import.meta.env.VITE_API_BUSINESS_URL);
