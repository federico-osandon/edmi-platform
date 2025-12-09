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
  <div class="p-8">
    <div class="mb-6">
      <NuxtLink to="/courses" class="text-indigo-600 hover:text-indigo-800">&larr; Back to Courses</NuxtLink>
    </div>
    
    <div v-if="course" class="bg-white p-8 rounded-lg shadow border">
      <h1 class="text-3xl font-bold mb-4">{{ course.title }}</h1>
      <p class="text-gray-600 mb-6 text-lg">{{ course.description }}</p>
      
      <div class="flex items-center justify-between border-t pt-6">
        <div class="text-gray-500">
          <p>Teacher: <span class="font-medium text-gray-900">{{ course.teacherName }}</span></p>
        </div>
        <button @click="enroll" class="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition">
          Enroll in Course
        </button>
      </div>
    </div>
    
    <div v-else-if="error" class="text-red-500">
      Course not found.
    </div>

    <div v-if="course" class="mt-8">
      <h2 class="text-2xl font-bold mb-4">Assignments</h2>
      <div class="bg-gray-50 p-6 rounded-lg border">
        <p class="text-gray-500 italic">Assignments feature coming soon...</p>
      </div>
    </div>
  </div>
</template>
