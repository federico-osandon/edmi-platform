<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'

definePageMeta({
  middleware: ['auth']
})

const route = useRoute()
const userId = route.params.id

// Reuse the admin user fetch or create a specific one. 
// For simplicity, we'll fetch all users and filter (not efficient for large apps but fine for demo)
// Or better, let's create a specific endpoint or just show basic info if it's the current user.
// Let's assume we want to see another user's profile.

// TODO: Implement specific user fetch endpoint if needed.
// For now, we'll just show a placeholder or basic info if it's the current user.
const auth = useAuthStore()
const isCurrentUser = auth.user?.id === Number(userId)
</script>

<template>
  <div class="p-8">
    <div class="mb-6">
      <NuxtLink to="/courses" class="text-indigo-600 hover:text-indigo-800">&larr; Back to Courses</NuxtLink>
    </div>

    <div class="bg-white p-8 rounded-lg shadow border">
      <h1 class="text-3xl font-bold mb-4">User Profile</h1>
      <div v-if="isCurrentUser">
        <p class="text-lg">Name: {{ auth.user?.name }}</p>
        <p class="text-lg">Email: {{ auth.user?.email }}</p>
        <p class="text-lg">Role: {{ auth.user?.role }}</p>
      </div>
      <div v-else>
        <p class="text-gray-500">Viewing other users' profiles is not fully implemented yet.</p>
      </div>
    </div>
  </div>
</template>
