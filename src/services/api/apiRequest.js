import api from './axios'

export const apiRequest = async({method, url, data, params}) => {
    const response = await api({
        method, url, data, params
    })

    return response.data
} 