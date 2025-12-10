export default defineNuxtPlugin(() => {
  const auth = useAuthStore()
  
  // Hydrate immediately on client
  auth.init()
  
  // Watch for storage events (multi-tab sync)
  if (process.client) {
    window.addEventListener('storage', (e) => {
      if (e.key === 'auth_token' || e.key === 'auth_user') {
        auth.init()
      }
    })
  }
})
