import axios, { AxiosInstance, AxiosResponse, AxiosError } from "axios";
import { toast } from "react-toastify";

interface ApiResponse {
    message?: string;
    [key: string]: any;
}

function createAxios(
    role: "librarian" | "user" | "common" | "" = "",
    token: string = ""
): AxiosInstance {
    const baseURL = import.meta.env.VITE_API_BASE_URL;
    const timeout = Number(import.meta.env.VITE_TIMEOUT) || 5000;

    if (!baseURL) {
        throw new Error(
            "VITE_API_BASE_URL is not defined in the environment variables."
        );
    }
    console.log(role, token);
    const axiosAPI: AxiosInstance = axios.create({
        baseURL: `${baseURL}/${role}`,
        timeout: timeout,
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token || localStorage.getItem("token") || ""}`
        }
    });

    axiosAPI.interceptors.response.use(
        (response: AxiosResponse<ApiResponse>) => {
            if (response.data?.message) {
                toast.success(response.data.message);
            }
            return response;
        },
        (error: AxiosError<ApiResponse>) => {
            const errorMessage =
                error.response?.data?.message ||
                "Internal error occurred. Please try again later.";
            toast.error(errorMessage, {
                onClose: () => {
                    if (role && error.response?.status === 401) {
                        localStorage.removeItem("token");
                        window.location.href = "/login";
                    }
                }
            });
            return Promise.reject(error);
        }
    );

    return axiosAPI;
}

export default createAxios;
