<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'

definePageMeta({
  middleware: ['auth']
})

const auth = useAuthStore()
const { data: courses } = await useFetch('/api/courses')
</script>

<template>
  <div class="p-8">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold">Courses</h1>
      <div class="flex items-center gap-4">
        <NuxtLink v-if="auth.isAdmin" to="/admin/users" class="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition">
          Gestionar Usuarios
        </NuxtLink>
        <span>Welcome, {{ auth.user?.name }}</span>
        <button @click="auth.logout()" class="text-red-600 hover:text-red-800">Logout</button>
      </div>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="course in courses" :key="course.id" class="bg-white p-6 rounded-lg shadow border hover:shadow-lg transition">
        <h2 class="text-xl font-semibold mb-2">{{ course.title }}</h2>
        <p class="text-gray-600 mb-4 line-clamp-3">{{ course.description }}</p>
        <div class="flex justify-between items-center text-sm text-gray-500">
          <span>Teacher: {{ course.teacherName }}</span>
          <NuxtLink :to="`/courses/${course.id}`" class="text-indigo-600 hover:text-indigo-800 font-medium">View Course</NuxtLink>
        </div>
      </div>
      <div v-if="!courses?.length" class="col-span-full bg-white p-6 rounded-lg shadow border text-center">
        <p class="text-gray-500">No courses available yet.</p>
      </div>
    </div>
  </div>
</template>
