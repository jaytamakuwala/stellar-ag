import axios from 'axios';

const getAuthHeaders = () => {
    const token = sessionStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

const handleAuthError = (error) => {
    if (error.response?.status === 401) {
        sessionStorage.removeItem('token');
        window.location.href = '/signin';
    }
};

export const getRequest = async (url, payload) => {
    try {
        let requestUrl = url;
        if (payload) {
            const queryParams = new URLSearchParams(payload).toString();
            requestUrl = `${url}?${queryParams}`;
        }

        const response = await axios.get(requestUrl, {
            headers: getAuthHeaders(),
        });

        return {
            ok: true,
            data: response.data,
        };
    } catch (error) {
        handleAuthError(error);
        return {
            ok: false,
            error: error.response?.data || error.message,
        };
    }
};

export const postRequest = async (url, payload) => {
    try {
        const response = await axios.post(url, payload, {
            headers: getAuthHeaders(),
        });

        return {
            ok: true,
            data: response.data,
        };
    } catch (error) {
        handleAuthError(error);
        return {
            ok: false,
            error: error.response?.data || error.message,
        };
    }
};
