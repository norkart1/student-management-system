export function setAuthToken(token: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem("auth_token", token)
  }
}

export function getAuthToken() {
  if (typeof window !== "undefined") {
    return localStorage.getItem("auth_token")
  }
  return null
}

export function clearAuthToken() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("auth_token")
  }
}

export function isAuthenticated(): boolean {
  return !!getAuthToken()
}

export function setAdminData(data: { id: string; username: string; email: string; profileImage?: string }) {
  if (typeof window !== "undefined") {
    localStorage.setItem("admin_data", JSON.stringify(data))
  }
}

export function getAdminData() {
  if (typeof window !== "undefined") {
    const data = localStorage.getItem("admin_data")
    return data ? JSON.parse(data) : null
  }
  return null
}

export function clearAdminData() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("admin_data")
  }
}
