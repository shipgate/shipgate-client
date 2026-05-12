/**
 * Cookie utility functions
 * These functions help manage authentication tokens and other cookies
 */

export function setAuthCookie(token: string, expiryDays: number = 7) {
  const date = new Date()
  date.setTime(date.getTime() + expiryDays * 24 * 60 * 60 * 1000)
  const expires = `expires=${date.toUTCString()}`
  
  document.cookie = `auth_token=${token};${expires};path=/;SameSite=Lax`
}

export function getAuthCookie(): string | null {
  const name = "auth_token="
  const decodedCookie = decodeURIComponent(document.cookie)
  const cookieArray = decodedCookie.split(";")
  
  for (const cookie of cookieArray) {
    const trimmed = cookie.trim()
    if (trimmed.startsWith(name)) {
      return trimmed.substring(name.length)
    }
  }
  
  return null
}

export function clearAuthCookie() {
  document.cookie = "auth_token=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;"
}

export function setUserRoleCookie(role: string, expiryDays: number = 7) {
  const date = new Date()
  date.setTime(date.getTime() + expiryDays * 24 * 60 * 60 * 1000)
  const expires = `expires=${date.toUTCString()}`
  
  document.cookie = `user_role=${role};${expires};path=/;SameSite=Lax`
}

export function getUserRoleCookie(): string | null {
  const name = "user_role="
  const decodedCookie = decodeURIComponent(document.cookie)
  const cookieArray = decodedCookie.split(";")
  
  for (const cookie of cookieArray) {
    const trimmed = cookie.trim()
    if (trimmed.startsWith(name)) {
      return trimmed.substring(name.length)
    }
  }
  
  return null
}
