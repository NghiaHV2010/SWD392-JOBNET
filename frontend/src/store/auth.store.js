import { create } from "zustand";
import { axiosConfig } from "../config/axios.config";
import { HTTP_SUCCESS } from "../../../backend/src/constants/httpCode";

export const useAuthStore = create((get, set) => ({
    isCheckingAuth: true,
    authUser: null,

    checkAuth: async () => {
        try {
            const response = await axiosConfig('check');

            if(response.status === HTTP_SUCCESS.OK) {
                set({authUser: response.data.data})
            }
        } catch (error) {
            console.error("Error: ", error.response.data);
            set({authUser: null});
            
        } finally {
            set({isCheckingAuth: false});
        }
    }
}))