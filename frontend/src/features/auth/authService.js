import axios from 'axios'

const BASE_URL = '/api/v1/auth/'

export async function registerService(userData) {
    const response = await axios.post(BASE_URL + 'register', userData)
    if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data))
    }
    return response.data
}

export async function getMeService(token) {
    const config = {
        headers:{
            Authorization: `Bearer ${token}`
        }
    }
    const response = await axios.get(BASE_URL + 'me', config)
    return response.data
}

export async function loginService(userData) {
    const response = await axios.post(BASE_URL + 'login', userData)
    if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data))
    }
    return response.data
}
