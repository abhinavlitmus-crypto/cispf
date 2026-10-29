import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "",
  timeout: 15000,
});

axiosInstance.interceptors.request.use(
  (config) => {
    config.headers["X-Requested-With"] = "XMLHttpRequest";

    if (typeof window !== "undefined" && window.document) {
      const cookieToken = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="));

      if (cookieToken) {
        config.headers.authorization = cookieToken.replace("token=", "Bearer ");
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Reject with the API's error body when there is one
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error.response ? error.response.data : error)
);

export default axiosInstance;
