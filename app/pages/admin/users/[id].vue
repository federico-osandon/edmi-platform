<script setup lang="ts">
const route = useRoute()
const userId = route.params.id

// Fetch user details (reusing existing API or fetching specific user if needed)
// For now, let's just assume we can fetch basic info or display placeholder
// Better to fetch the specific user. We don't have a single user API yet accessible for admins specifically by ID easily without filtering? 
// Actually we can reuse `api/admin/users` with a filter or create a new one.
// But the requirement is just "Usuario y el nombre completo".
// Let's create `server/api/admin/users/[id].get.ts` to be proper.

const { data: user } = await useFetch(`/api/admin/users/${userId}`)
</script>

<template>
  <div class="p-8">
    <NuxtLink to="/admin/users" class="text-indigo-600 hover:text-indigo-800 mb-4 inline-block">&larr; Volver al listado</NuxtLink>
    
    <div v-if="user" class="bg-gray-800/50 backdrop-blur-md p-10 rounded-3xl shadow-2xl border border-gray-700">
        <h1 class="text-3xl font-bold text-white mb-2">Usuario: {{ user.name }}</h1>
        <p class="text-gray-400">ID: {{ user.id }}</p>
    </div>
    <div v-else class="text-red-400">
        Usuario no encontrado
    </div>
  </div>
</template>
