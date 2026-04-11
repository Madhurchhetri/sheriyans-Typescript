import axios from "axios";

const authInstance = axios.create({
    baseURL: "/api/auth",
    withCredentials: true,
})

export async function register({ email, password, fullname, contact, isSeller = false }) {
    const response = await authInstance.post("/register", {
        email,
        password,
        fullname,
        contact,
        isSeller,
    })
    return response.data;
}

export async function login({ email, password }) {
    const response = await authInstance.post("/login", {
        email,
        password,
    })
    return response.data;
}