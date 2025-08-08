import { create } from 'zustand'


const useStore = create((set) => ({
    
    token: localStorage.getItem("token") || "",
    setToken: (newToken) => {
        localStorage.setItem("token", newToken); 
        set({ token: newToken });
    },
}));

export default useStore;
