import axios from 'axios';

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
});

apiClient.interceptors.request.use(
    (config)=>{
        const token = localStorage.getItem('proPlannerAccessToken');

        if (!config.url.includes('/signup') && !config.url.includes('/login') && !config.url.includes('/reset-password') && token) {
            config.headers.Authorization = `Bearer ${token}`; // Bearer tells the server that the client is sending a token for authentication.
        }

        return config;
    },
    (error)=> Promise.reject(error)
);

apiClient.interceptors.response.use(
    (response) => response,

    async (error) => {
        if (error.response?.status === 403 || 
            (error.response?.status === 500 && 
             error.response?.data?.error === "Internal Server Error")) {
            try {
                const refreshResponse = await axios.post(`${import.meta.env.VITE_API_URL}/refresh`, {},{ withCredentials: true } );

                const newAccessToken = refreshResponse.data.accessToken;
                localStorage.setItem('proPlannerAccessToken', newAccessToken);

                // Clone the failed request and retry with the new access token
                const originalRequest = { ...error.config }; // Clone config
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

                return axios(originalRequest); // Retry the failed request with new token

            } catch (refreshError) {
                localStorage.removeItem('proPlannerAccessToken');
                localStorage.removeItem('proPlannerUsername');
                window.location.href = '/';
            }
        }
        return Promise.reject(error);
    }
);


export default apiClient;