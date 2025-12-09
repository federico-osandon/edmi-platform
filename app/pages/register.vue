<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'

const auth = useAuthStore()
const name = ref('')
const email = ref('')
const password = ref('')
const errorMsg = ref('')
const successMsg = ref('')

const handleRegister = async () => {
  errorMsg.value = ''
  successMsg.value = ''
  try {
    await auth.register({ name: name.value, email: email.value, password: password.value })
    successMsg.value = 'Registration successful! Please wait for admin approval.'
    setTimeout(() => navigateTo('/login'), 3000)
  } catch (e: any) {
    errorMsg.value = e.statusMessage || 'Registration failed'
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center px-4 py-12">
    <div class="bg-gray-800/50 backdrop-blur-md p-10 rounded-3xl shadow-2xl border border-gray-700 w-full max-w-md">
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent mb-2">Registrarse</h1>
        <p class="text-gray-400">Únete a la comunidad EDMI</p>
      </div>
      <form @submit.prevent="handleRegister" class="space-y-6">
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">Nombre Completo</label>
          <input v-model="name" type="text" required class="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all" placeholder="Tu nombre" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">Correo Electrónico</label>
          <input v-model="email" type="email" required class="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all" placeholder="tu@email.com" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">Contraseña</label>
          <input v-model="password" type="password" required class="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all" placeholder="••••••••" />
        </div>
        <div v-if="errorMsg" class="text-red-400 text-sm bg-red-900/20 p-3 rounded-lg">{{ errorMsg }}</div>
        <div v-if="successMsg" class="text-green-400 text-sm bg-green-900/20 p-3 rounded-lg">{{ successMsg }}</div>
        <button type="submit" class="w-full py-4 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-xl font-semibold hover:from-green-600 hover:to-teal-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
          Registrarse
        </button>
      </form>
      <div class="mt-8 text-center">
        <p class="text-gray-400">¿Ya tienes cuenta? <NuxtLink to="/login" class="text-green-400 hover:text-green-300 font-medium transition-colors">Inicia sesión aquí</NuxtLink></p>
      </div>
    </div>
  </div>
</template>
