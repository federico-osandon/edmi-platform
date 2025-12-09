<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'

const auth = useAuthStore()
const email = ref('')
const password = ref('')
const errorMsg = ref('')

const handleLogin = async () => {
  errorMsg.value = ''
  try {
    await auth.login({ email: email.value, password: password.value })
    navigateTo('/courses')
  } catch (e: any) {
    errorMsg.value = e.statusMessage || 'Login failed'
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center px-4 py-12">
    <div class="bg-gray-800/50 backdrop-blur-md p-10 rounded-3xl shadow-2xl border border-gray-700 w-full max-w-md">
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-2">Iniciar Sesión</h1>
        <p class="text-gray-400">Accede a tu cuenta EDMI</p>
      </div>
      <form @submit.prevent="handleLogin" class="space-y-6">
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">Correo Electrónico</label>
          <input v-model="email" type="email" required class="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all" placeholder="tu@email.com" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">Contraseña</label>
          <input v-model="password" type="password" required class="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all" placeholder="••••••••" />
        </div>
        <div v-if="errorMsg" class="text-red-400 text-sm bg-red-900/20 p-3 rounded-lg">{{ errorMsg }}</div>
        <button type="submit" class="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl font-semibold hover:from-cyan-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
          Iniciar Sesión
        </button>
      </form>
      <div class="mt-8 text-center">
        <p class="text-gray-400">¿No tienes cuenta? <NuxtLink to="/register" class="text-cyan-400 hover:text-cyan-300 font-medium transition-colors">Regístrate aquí</NuxtLink></p>
      </div>
    </div>
  </div>
</template>
