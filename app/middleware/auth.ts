import { useAuthStore } from '~/stores/auth'

export default defineNuxtRouteMiddleware((to, from) => {
    const auth = useAuthStore()

    if (!auth.isAuthenticated && to.path !== '/login' && to.path !== '/register') {
        return navigateTo('/login')
    }
})
