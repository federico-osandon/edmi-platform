<script setup lang="ts">
const { data: courses } = await useFetch('/api/courses')
</script>

<template>
  <div>
    <!-- Hero Section -->
    <section class="py-20 px-4">
      <div class="container mx-auto text-center">
        <h1 class="text-6xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
          Aprende y Crece con EDMI
        </h1>
        <p class="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
          Descubre cursos de alta calidad para desarrollar tus habilidades en tecnología y más. Únete a nuestra comunidad de estudiantes y profesionales.
        </p>
        <div class="flex justify-center gap-4">
          <NuxtLink to="/register" class="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full font-semibold text-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
            ¡Empieza Ahora!
          </NuxtLink>
          <NuxtLink to="/courses" class="px-8 py-4 border-2 border-cyan-400 text-cyan-400 rounded-full font-semibold text-lg hover:bg-cyan-400 hover:text-black transition-all duration-300">
            Explorar Cursos
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Courses Section -->
    <section class="py-16 px-4">
      <div class="container mx-auto">
        <h2 class="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
          Nuestros Cursos Destacados
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div v-for="course in courses" :key="course.id" class="bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-gray-700 hover:border-cyan-400 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl group">
            <div class="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
              </svg>
            </div>
            <h3 class="text-2xl font-semibold mb-4 text-white group-hover:text-cyan-400 transition-colors">{{ course.title }}</h3>
            <p class="text-gray-300 mb-6 line-clamp-3">{{ course.description }}</p>
            <div class="flex justify-between items-center mb-6">
              <span class="text-sm text-gray-400">Profesor: {{ course.teacherName }}</span>
            </div>
            <NuxtLink :to="`/courses/${course.id}`" class="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-full font-medium hover:from-cyan-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-center block">
              Ver Detalles
            </NuxtLink>
          </div>
          <div v-if="!courses?.length" class="col-span-full bg-gray-800/50 p-8 rounded-2xl shadow-xl border border-gray-700 text-center">
            <svg class="w-16 h-16 text-gray-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
            </svg>
            <p class="text-gray-400 text-lg">No hay cursos disponibles aún. ¡Vuelve pronto!</p>
          </div>
        </div>
      </div>
    </section>
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
