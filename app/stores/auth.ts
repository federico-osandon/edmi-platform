import { defineStore } from 'pinia'

interface User {
    id: number
    email: string
    name: string
    role: string
}

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null as User | null,
        token: null as string | null,
    }),
    getters: {
        isAuthenticated: (state) => !!state.token,
        isAdmin: (state) => state.user?.role === 'admin' || state.user?.role === 'superadmin',
        isSuperAdmin: (state) => state.user?.role === 'superadmin',
    },
    actions: {
        async login(credentials: any) {
            try {
                const { data, error } = await useFetch('/api/auth/login', {
                    method: 'POST',
                    body: credentials
                })

                if (error.value) throw error.value

                if (data.value) {
                    this.token = data.value.token
                    this.user = data.value.user
                    return true
                }
            } catch (e) {
                throw e
            }
        },
        async register(userData: any) {
            try {
                const { data, error } = await useFetch('/api/auth/register', {
                    method: 'POST',
                    body: userData
                })

                if (error.value) throw error.value

                return data.value
            } catch (e) {
                throw e
            }
        },
        logout() {
            this.user = null
            this.token = null
            navigateTo('/login')
        }
    }
})
