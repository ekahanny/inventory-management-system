import axios from "axios";

const BASE_URL = "http://localhost:5000";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  // withCredentials: true,
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle error response
    if (error.response?.status === 401) {
      localStorage.removeItem("token");

      // Jika menggunakan React Router v6
      // if (window.location.pathname !== "/login") {
      //   window.location.href = "/login";
      //   toast.error("Sesi telah berakhir, silakan login kembali");
      // }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
