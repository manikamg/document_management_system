import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    // withCredentials: true,
    timeout: 15000
})

// request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken')
    // if (token) config.headers.Authorization = `Bearer ${token}`
    if (token) {
        config.headers = config.headers || {};
        config.headers.token = token;
    }

    if (config.data instanceof FormData) {
        delete config.headers["Content-Type"];
    } else {
        config.headers["Content-Type"] = "application/json";
    }

    return config
})

// response
api.interceptors.response.use((res) => res, (err) => {
    console.log(err)
    if (err.response?.status === 401) {
        // const isAuthRoute = window.location.pathname === "/login";

        // if (!isAuthRoute) {
        //     localStorage.removeItem('accessToken')
        //     localStorage.removeItem('userData')
        //     window.location.href = '/login'
        // }

    }
    return Promise.reject(err)
})

export default api