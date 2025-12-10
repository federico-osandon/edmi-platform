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
        _hydrated: false
    }),
    getters: {
        isAuthenticated: (state) => !!state.token,
        isAdmin: (state) => state.user?.role === 'admin' || state.user?.role === 'superadmin',
        isSuperAdmin: (state) => state.user?.role === 'superadmin',
    },
    actions: {
        // Initialize store from sessionStorage
        init() {
            if (this._hydrated) return
            
            if (process.client) {
                const token = sessionStorage.getItem('auth_token')
                const user = sessionStorage.getItem('auth_user')
                
                if (token && user) {
                    this.token = token
                    this.user = JSON.parse(user)
                }
                this._hydrated = true
            }
        },
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
                    
                    // Persist to sessionStorage
                    if (process.client) {
                        sessionStorage.setItem('auth_token', data.value.token)
                        sessionStorage.setItem('auth_user', JSON.stringify(data.value.user))
                    }
                    
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
            
            // Clear sessionStorage
            if (process.client) {
                sessionStorage.removeItem('auth_token')
                sessionStorage.removeItem('auth_user')
            }
            
            navigateTo('/login')
        }
    }
})
