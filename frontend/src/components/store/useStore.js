import { useState, useEffect } from 'react'
import { create } from 'zustand'
import axios from 'axios'
import { toast } from 'react-hot-toast'

const useStore = create((set) => ({
    
    token: localStorage.getItem("token") || "",
    setToken: (newToken) => {
        localStorage.setItem("token", newToken); 
        set({ token: newToken });
    },
}));

export default useStore;
