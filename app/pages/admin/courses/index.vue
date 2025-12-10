<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'

definePageMeta({
  middleware: ['auth']
})

const auth = useAuthStore()

// Check if user is admin
const isAdmin = computed(() => auth.user?.role === 'admin' || auth.user?.role === 'superadmin')

// Fetch courses
const { data: courses, refresh } = await useFetch('/api/courses', {
  query: { all: isAdmin.value ? 'true' : 'false' }
})

const formatDate = (date: string | null) => {
  if (!date) return 'No definida'
  return new Date(date).toLocaleDateString('es-ES', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  })
}

const getLevelBadgeClass = (level: string | null) => {
  switch (level) {
    case 'beginner': return 'bg-green-100 text-green-700'
    case 'intermediate': return 'bg-yellow-100 text-yellow-700'
    case 'advanced': return 'bg-red-100 text-red-700'
    default: return 'bg-gray-100 text-gray-700'
  }
}

const getStatusBadgeClass = (published: boolean) => {
  return published 
    ? 'bg-blue-100 text-blue-700' 
    : 'bg-gray-100 text-gray-700'
}

const getGrupoBadgeClass = (grupo: string | null) => {
  return grupo === 'pastores'
    ? 'bg-purple-100 text-purple-700'
    : 'bg-teal-100 text-teal-700'
}
</script>

<template>
  <div class="min-h-screen bg-slate-900">
    <!-- Header -->
    <div class="bg-slate-800 border-b border-slate-700">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex justify-between items-center">
          <div>
            <h1 class="text-3xl font-bold text-white">Gestión de Cursos</h1>
            <p class="mt-1 text-sm text-gray-400">
              Administra y visualiza todos los cursos disponibles
            </p>
          </div>
          <div class="flex items-center gap-4">
            <NuxtLink 
              v-if="isAdmin" 
              to="/admin/courses/create"
              class="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transition-colors"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              Crear Curso
            </NuxtLink>
            <button 
              @click="refresh()"
              class="inline-flex items-center px-3 py-2 border border-slate-600 rounded-lg text-sm font-medium text-gray-300 bg-slate-700 hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transition-colors"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Courses List -->
      <div class="bg-slate-800 rounded-lg shadow-sm border border-slate-700 overflow-hidden">
        <!-- List Header -->
        <div class="grid grid-cols-12 gap-4 px-6 py-4 bg-slate-900 border-b border-slate-700 text-xs font-semibold text-gray-400 uppercase tracking-wider">
          <div class="col-span-3">Curso</div>
          <div class="col-span-2">Profesor</div>
          <div class="col-span-1">Grupo</div>
          <div class="col-span-2">Nivel</div>
          <div class="col-span-2">Fecha Inicio</div>
          <div class="col-span-1">Estado</div>
          <div class="col-span-1 text-right">Acciones</div>
        </div>

        <!-- List Items -->
        <div v-if="courses && courses.length > 0">
          <div 
            v-for="course in courses" 
            :key="course.id"
            class="grid grid-cols-12 gap-4 px-6 py-4 border-b border-slate-700 hover:bg-slate-700 transition-colors cursor-pointer group"
            @click="navigateTo(`/courses/${course.id}`)"
          >
            <!-- Course Info -->
            <div class="col-span-3 flex items-center">
              <div class="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg mr-4">
                {{ course.title.charAt(0).toUpperCase() }}
              </div>
              <div class="min-w-0 flex-1">
                <h3 class="text-sm font-semibold text-white truncate group-hover:text-cyan-400 transition-colors">
                  {{ course.title }}
                </h3>
                <p class="text-xs text-gray-400 truncate mt-0.5">
                  {{ course.category || 'Sin categoría' }}
                </p>
              </div>
            </div>

            <!-- Teacher -->
            <div class="col-span-2 flex items-center">
              <span class="text-sm text-gray-300">
                {{ course.teacherName || 'Sin asignar' }}
              </span>
            </div>

            <!-- Grupo -->
            <div class="col-span-1 flex items-center">
              <span 
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                :class="getGrupoBadgeClass(course.grupo)"
              >
                {{ course.grupo === 'pastores' ? 'Pastores' : 'Servidores' }}
              </span>
            </div>

            <!-- Level -->
            <div class="col-span-2 flex items-center">
              <span 
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                :class="getLevelBadgeClass(course.level)"
              >
                {{ course.level === 'beginner' ? 'Principiante' : course.level === 'intermediate' ? 'Intermedio' : course.level === 'advanced' ? 'Avanzado' : 'N/A' }}
              </span>
            </div>

            <!-- Start Date -->
            <div class="col-span-2 flex items-center">
              <span class="text-sm text-gray-300">
                {{ formatDate(course.startAt) }}
              </span>
            </div>

            <!-- Status -->
            <div class="col-span-1 flex items-center">
              <span 
                class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
                :class="getStatusBadgeClass(course.published)"
              >
                {{ course.published ? 'Publicado' : 'Borrador' }}
              </span>
            </div>

            <!-- Actions -->
            <div class="col-span-1 flex items-center justify-end">
              <button
                @click.stop="navigateTo(`/courses/${course.id}`)"
                class="text-cyan-400 hover:text-cyan-300 text-sm font-medium"
              >
                Ver →
              </button>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="px-6 py-16 text-center">
          <svg class="mx-auto h-12 w-12 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <h3 class="mt-2 text-sm font-medium text-white">No hay cursos</h3>
          <p class="mt-1 text-sm text-gray-400">Comienza creando un nuevo curso.</p>
          <div class="mt-6" v-if="isAdmin">
            <NuxtLink
              to="/admin/courses/create"
              class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              Crear Primer Curso
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6" v-if="courses && courses.length > 0">
        <div class="bg-slate-800 rounded-lg shadow-sm border border-slate-700 p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0 bg-cyan-900 rounded-lg p-3">
              <svg class="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div class="ml-4">
              <h3 class="text-sm font-medium text-gray-400">Total Cursos</h3>
              <p class="text-2xl font-bold text-white">{{ courses.length }}</p>
            </div>
          </div>
        </div>

        <div class="bg-slate-800 rounded-lg shadow-sm border border-slate-700 p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0 bg-green-900 rounded-lg p-3">
              <svg class="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div class="ml-4">
              <h3 class="text-sm font-medium text-gray-400">Publicados</h3>
              <p class="text-2xl font-bold text-white">{{ courses.filter(c => c.published).length }}</p>
            </div>
          </div>
        </div>

        <div class="bg-slate-800 rounded-lg shadow-sm border border-slate-700 p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0 bg-yellow-900 rounded-lg p-3">
              <svg class="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div class="ml-4">
              <h3 class="text-sm font-medium text-gray-400">Borradores</h3>
              <p class="text-2xl font-bold text-white">{{ courses.filter(c => !c.published).length }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
