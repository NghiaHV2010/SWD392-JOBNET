import { create } from "zustand";
import { axiosConfig } from "../config/axios.config.js";
import { HTTP_SUCCESS } from "../../../backend/src/constants/httpCode.js";

export const useAuthStore = create((set, get) => ({
    isCheckingAuth: true,
    authUser: null,

    checkAuth: async () => {
        try {
            const response = await axiosConfig.get('/check');
            
            if(response.status === HTTP_SUCCESS.OK) {
                set({ authUser: response.data.data })
            }
        } catch (error) {
            console.error("Error: ", error.response.data);
            set({ authUser: null });            
        } finally {
            set({ isCheckingAuth: false });
        }
    }
}))