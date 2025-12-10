<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'

definePageMeta({
  middleware: ['auth']
})

const route = useRoute()
const auth = useAuthStore()
const courseId = route.params.id

const { data: course, error } = await useFetch(`/api/courses/${courseId}`)

const enroll = async () => {
  try {
    await $fetch(`/api/courses/${courseId}/enroll`, {
      method: 'POST',
      body: { userId: auth.user?.id }
    })
    alert('Enrolled successfully!')
  } catch (e: any) {
    alert(e.statusMessage || 'Enrollment failed')
  }
}
</script>

<template>
  <div class="py-12 px-4">
    <div class="container mx-auto">
      <div class="flex items-center gap-3 mb-8 text-sm text-cyan-300">
        <NuxtLink to="/courses" class="hover:text-cyan-200 transition">&larr; Volver a cursos</NuxtLink>
        <span class="text-gray-600">/</span>
        <span class="text-gray-400">Detalle</span>
      </div>

      <div v-if="course" class="bg-gray-800/60 backdrop-blur-sm border border-gray-700 rounded-2xl shadow-xl p-8">
        <div class="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div>
            <p class="text-xs uppercase tracking-[0.2em] text-cyan-400">Curso</p>
            <h1 class="text-4xl font-bold text-white mt-2 mb-3">{{ course.title }}</h1>
            <p class="text-gray-300 text-lg leading-relaxed max-w-3xl">{{ course.description }}</p>
          </div>
          <button
            @click="enroll"
            class="px-5 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl font-semibold shadow-lg hover:from-cyan-600 hover:to-blue-700 transition-all duration-300 transform hover:-translate-y-1"
          >
            Inscribirse en el curso
          </button>
        </div>

        <div class="mt-8 grid gap-6 md:grid-cols-3">
          <div class="col-span-2 bg-gray-900/50 border border-gray-700 rounded-xl p-6">
            <h2 class="text-xl font-semibold text-white mb-3">Detalles</h2>
            <div class="flex flex-col gap-3 text-gray-300">
              <div class="flex items-center gap-3">
                <span class="text-gray-400">Profesor:</span>
                <span class="font-medium text-white">{{ course.teacherName }}</span>
              </div>
            </div>
          </div>

          <div class="bg-gradient-to-br from-blue-500/20 to-cyan-500/10 border border-cyan-700/50 rounded-xl p-6">
            <h3 class="text-lg font-semibold text-white mb-2">Estado</h3>
            <p class="text-sm text-cyan-100">Accede al contenido y tareas del curso desde aquí.</p>
          </div>
        </div>
      </div>

      <div v-else-if="error" class="text-red-400 bg-red-900/30 border border-red-700 rounded-xl p-6">
        Curso no encontrado.
      </div>

      <div v-if="course" class="mt-10">
        <h2 class="text-2xl font-bold text-white mb-4">Tareas</h2>
        <div class="bg-gray-800/60 border border-gray-700 rounded-xl p-6">
          <p class="text-gray-400 italic">Las tareas estarán disponibles próximamente.</p>
        </div>
      </div>
    </div>
  </div>
</template>
