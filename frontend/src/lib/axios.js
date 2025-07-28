import axios from "axios"

export const axiosIstance = axios.create({
    baseURL: import.meta.env.MODE === "develeopment" ? "http://localhost:5001/api" : "/api",
    withCredentials: true
})