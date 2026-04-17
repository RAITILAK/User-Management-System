import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true, // sends cookies (refresh token) with every request
});

//attach access token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

//Handle token expirt auto
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Attempt to refresh the access token
        const res = await axios.post(
          "http://localhost:5000/api/auth/refresh",
          {},
          { withCredentials: true },
        );
        const newToken = res.data.accessToken;
        localStorage.setItem("accessToken", newToken);
        originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Handle refresh token error (e.g., token expired, invalid)
        localStorage.removeItem("accessToken");
        window.location.href = "/login"; // Redirect to login page
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  },
);

export default api;
