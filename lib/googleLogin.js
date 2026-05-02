export const googleLogin = () => {
  return new Promise((resolve, reject) => {
    if (!window.google) {
      reject("Google SDK not loaded")
      return
    }

    window.google.accounts.id.initialize({
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      callback: (response) => {
        resolve(response.credential) // 🔥 REAL ID TOKEN
      },
    })

    window.google.accounts.id.prompt()
  })
}

