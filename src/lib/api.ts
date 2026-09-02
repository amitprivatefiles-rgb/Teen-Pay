const API_BASE = '/api';

class ApiClient {
  private getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  setToken(token: string | null) {
    if (token) {
      localStorage.setItem('auth_token', token);
    } else {
      localStorage.removeItem('auth_token');
    }
  }

  async request<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = this.getToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> || {}),
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    // Convert path-based IDs to query params for Vercel index.ts routes
    // e.g., /companies/123 -> /companies?id=123
    // e.g., /users/123/suspend -> /users?id=123&action=suspend
    // e.g., /guest-submissions/check?taskId=x -> /guest-submissions?action=check&taskId=x
    let url = `${API_BASE}${endpoint}`;
    const segments = endpoint.split('?')[0].split('/').filter(Boolean);
    const queryFromEndpoint = endpoint.includes('?') ? endpoint.split('?')[1] : '';
    
    if (segments.length >= 2) {
      const base = segments[0]; // e.g., "companies", "auth", "admin"
      // Skip auth routes (they use [...action] catch-all)
      if (base !== 'auth' && base !== 'admin') {
        const sub = segments.slice(1);
        const params = new URLSearchParams(queryFromEndpoint);
        if (sub.length === 1 && sub[0] !== 'check') {
          params.set('id', sub[0]);
        } else if (sub.length === 1 && sub[0] === 'check') {
          params.set('action', 'check');
        } else if (sub.length === 2) {
          params.set('id', sub[0]);
          params.set('action', sub[1]);
        }
        const qs = params.toString();
        url = `${API_BASE}/${base}${qs ? '?' + qs : ''}`;
      }
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Request failed' }));
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    // Handle 204 No Content
    if (response.status === 204) return {} as T;

    return response.json();
  }

  get<T = any>(endpoint: string) {
    return this.request<T>(endpoint);
  }

  post<T = any>(endpoint: string, data?: any) {
    return this.request<T>(endpoint, { method: 'POST', body: data ? JSON.stringify(data) : undefined });
  }

  put<T = any>(endpoint: string, data?: any) {
    return this.request<T>(endpoint, { method: 'PUT', body: data ? JSON.stringify(data) : undefined });
  }

  patch<T = any>(endpoint: string, data?: any) {
    return this.request<T>(endpoint, { method: 'PATCH', body: data ? JSON.stringify(data) : undefined });
  }

  delete<T = any>(endpoint: string) {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

export const api = new ApiClient();
