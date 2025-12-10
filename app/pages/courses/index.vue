<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'

definePageMeta({
  middleware: ['auth']
})

const auth = useAuthStore()
const { data: courses } = await useFetch('/api/courses')
</script>

<template>
  <div class="py-12 px-4">
    <div class="container mx-auto">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-4xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">Cursos</h1>
        <div class="flex items-center gap-4">
          <NuxtLink v-if="auth.isAdmin" to="/admin/courses" class="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-full font-medium hover:from-cyan-600 hover:to-blue-700 transition-all">
            Gestionar Cursos
          </NuxtLink>
          <NuxtLink v-if="auth.isAdmin" to="/admin/users" class="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-full font-medium hover:from-cyan-600 hover:to-blue-700 transition-all">
            Gestionar Usuarios
          </NuxtLink>
          <span class="text-sm text-gray-600">{{ auth.user?.name }}</span>
          <button @click="auth.logout()" class="text-red-600 hover:text-red-800">Cerrar sesión</button>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div v-for="course in courses" :key="course.id" class="bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-gray-700 hover:border-cyan-400 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl group">
          <div class="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
            </svg>
          </div>
          <h2 class="text-2xl font-semibold mb-2 text-white group-hover:text-cyan-400 transition-colors">{{ course.title }}</h2>
          <p class="text-gray-300 mb-6 line-clamp-3">{{ course.description }}</p>
          <div class="flex justify-between items-center text-sm text-gray-400 mb-4">
            <span>Profesor: {{ course.teacherName }}</span>
            <NuxtLink :to="`/courses/${course.id}`" class="inline-block px-3 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-full font-medium hover:from-cyan-600 hover:to-blue-700 transition-all">Ver Curso</NuxtLink>
          </div>
        </div>

        <div v-if="!courses?.length" class="col-span-full bg-gray-800/50 p-8 rounded-2xl shadow-xl border border-gray-700 text-center">
          <svg class="w-16 h-16 text-gray-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
          </svg>
          <p class="text-gray-400 text-lg">Aún no hay cursos disponibles. ¡Vuelve pronto!</p>
        </div>
      </div>
    </div>
  </div>
</template>
