import { useAuthStore } from '~/stores/auth'

export default defineNuxtRouteMiddleware((to, from) => {
    const auth = useAuthStore()

    // En SSR no hay sessionStorage; deferir al cliente para hidratar antes de decidir
    if (process.server) return

    // En cliente: hidratar si hay token en sessionStorage y no está en store
    const hasSessionToken = sessionStorage.getItem('auth_token')
    if (hasSessionToken && !auth.token) {
        auth.init()
    }

    // Si hay token en sessionStorage, permitir el paso (el store se hidrata inmediatamente)
    if (hasSessionToken && to.path !== '/login' && to.path !== '/register') {
        return
    }

    // Sin token => redirigir a login salvo rutas públicas
    if (!auth.isAuthenticated && to.path !== '/login' && to.path !== '/register') {
        return navigateTo('/login')
    }
})
