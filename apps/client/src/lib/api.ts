/* eslint-disable @typescript-eslint/no-explicit-any */
import Cookies from 'js-cookie';

const API_BASE_URL = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '') + '/api/v1';

interface ApiRequestOptions extends RequestInit {
    params?: Record<string, string>;
}

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];
let activeStoreId: string | null = null;

export const setApiStoreId = (id: string | null) => {
    activeStoreId = id;
};

const subscribeTokenRefresh = (cb: (token: string) => void) => {
    refreshSubscribers.push(cb);
};

const onRefreshed = (token: string) => {
    refreshSubscribers.map((cb) => cb(token));
    refreshSubscribers = [];
};

async function refreshToken() {
    try {
        const refresh_token = Cookies.get('refresh_token');
        if (!refresh_token) throw new Error('No refresh token');

        const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refresh_token }),
        });

        if (!response.ok) throw new Error('Refresh failed');

        const data = await response.json();
        const { access_token, refresh_token: new_refresh_token } = data.data;

        Cookies.set('access_token', access_token);
        if (new_refresh_token) {
            Cookies.set('refresh_token', new_refresh_token);
        }

        return access_token;
    } catch (error) {
        Cookies.remove('access_token');
        Cookies.remove('refresh_token');
        window.location.href = '/login';
        throw error;
    }
}

async function request(path: string, options: ApiRequestOptions = {}) {
    const { params, headers, ...rest } = options;

    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    let url = `${API_BASE_URL}${normalizedPath}`;
    if (params) {
        const searchParams = new URLSearchParams(params);
        url += `?${searchParams.toString()}`;
    }

    const token = Cookies.get('access_token');
    const storeId = activeStoreId;
    const authHeaders: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        ...(storeId ? { 'x-store-id': storeId } : {}),
        ...((headers as Record<string, string>) || {}),
    };

    const config = {
        ...rest,
        headers: authHeaders,
    };

    const response = await fetch(url, config);

    if (response.status === 401 && !url.includes('/auth/refresh')) {
        if (!isRefreshing) {
            isRefreshing = true;
            try {
                const newToken = await refreshToken();
                isRefreshing = false;
                onRefreshed(newToken);
            } catch (err) {
                isRefreshing = false;
                throw err;
            }
        }

        return new Promise((resolve) => {
            subscribeTokenRefresh((token: string) => {
                config.headers['Authorization'] = `Bearer ${token}`;
                resolve(fetch(url, config).then(res => handleResponse(res)));
            });
        });
    }

    return handleResponse(response);
}

async function handleResponse(response: Response) {
    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'API Error' }));
        throw new Error(error.error?.message || error.message || 'API Error');
    }
    const result = await response.json();
    return result.data || result;
}

export const api = {
    get: (path: string, params?: Record<string, string>, options?: ApiRequestOptions) =>
        request(path, { ...options, method: 'GET', params }),

    post: (path: string, body?: any, options?: ApiRequestOptions) =>
        request(path, { ...options, method: 'POST', body: JSON.stringify(body) }),

    put: (path: string, body?: any, options?: ApiRequestOptions) =>
        request(path, { ...options, method: 'PUT', body: JSON.stringify(body) }),

    patch: (path: string, body?: any, options?: ApiRequestOptions) =>
        request(path, { ...options, method: 'PATCH', body: JSON.stringify(body) }),

    delete: (path: string, options?: ApiRequestOptions) =>
        request(path, { ...options, method: 'DELETE' }),
};
