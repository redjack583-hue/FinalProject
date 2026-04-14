const API_BASE_URL = "https://localhost:7045/api"; // Updated to match running port

export async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem("admin_token");
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { "Authorization": `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (response.status === 401) {
    localStorage.removeItem("admin_token");
    window.location.href = "/admin/login";
    throw new Error("Session expired. Please login again.");
  }

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data.data; // ApiResponse<T> wraps data in .data
}

export const api = {
  auth: {
    login: (credentials: any) => apiFetch<any>("/auth/login", { method: "POST", body: JSON.stringify(credentials) }),
    verifyOtp: (data: any) => apiFetch<any>("/auth/verify-otp", { method: "POST", body: JSON.stringify(data) }),
  },
  services: {
    getAll: () => apiFetch<any[]>("/services"),
    getById: (id: string) => apiFetch<any>(`/services/${id}`),
    create: (data: any) => apiFetch<any>("/services", { method: "POST", body: JSON.stringify(data) }),
    update: (id: string, data: any) => apiFetch<any>(`/services/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    delete: (id: string) => apiFetch<any>(`/services/${id}`, { method: "DELETE" }),
  },
  businesses: {
    getAll: () => apiFetch<any[]>("/businesses"),
    getById: (id: string) => apiFetch<any>(`/businesses/${id}`),
    create: (data: any) => apiFetch<any>("/businesses", { method: "POST", body: JSON.stringify(data) }),
    update: (id: string, data: any) => apiFetch<any>(`/businesses/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    delete: (id: string) => apiFetch<any>(`/businesses/${id}`, { method: "DELETE" }),
  },
  events: {
    getAll: () => apiFetch<any[]>("/events"),
    getById: (id: string) => apiFetch<any>(`/events/${id}`),
    create: (data: any) => apiFetch<any>("/events", { method: "POST", body: JSON.stringify(data) }),
    update: (id: string, data: any) => apiFetch<any>(`/events/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    delete: (id: string) => apiFetch<any>(`/events/${id}`, { method: "DELETE" }),
  },
  chatbot: {
    ask: (message: string) => apiFetch<string>("/chatbot/ask", {
      method: "POST",
      body: JSON.stringify({ message }),
    }),
  },
  search: {
    query: (q: string) => apiFetch<any>(`/search?q=${encodeURIComponent(q)}`),
  },
  filters: {
    getAll: () => apiFetch<any[]>("/filters"),
    create: (data: any) => apiFetch<any>("/filters", { method: "POST", body: JSON.stringify(data) }),
    update: (id: number, data: any) => apiFetch<any>(`/filters/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    delete: (id: number) => apiFetch<any>(`/filters/${id}`, { method: "DELETE" }),
  }
};
