<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'

definePageMeta({
  middleware: ['auth']
})

const auth = useAuthStore()
const selectedGroup = ref('')
const { data: users, refresh } = await useFetch('/api/admin/users', {
    query: { grupo: selectedGroup }
})

const toggleUserStatus = async (id: number) => {
  try {
    await $fetch(`/api/admin/users/${id}/approve`, { method: 'POST' })
    refresh()
  } catch (e) {
    alert('Failed to update user status')
  }
}
</script>

<template>
  <div class="p-8">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold">User Management</h1>
      <NuxtLink to="/courses" class="text-indigo-600 hover:text-indigo-800">Back to Courses</NuxtLink>
    </div>

    <!-- Filters -->
    <div class="mb-6 flex gap-4">
        <select v-model="selectedGroup" @change="() => refresh()" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5">
            <option value="">Todos los grupos</option>
            <option value="pastores">Pastores</option>
            <option value="servidores">Servidores</option>
        </select>
    </div>

    <div v-if="!auth.isSuperAdmin" class="text-red-500">
      Access Denied. You must be a superadmin to view this page.
    </div>

    <div v-else class="bg-white shadow overflow-hidden sm:rounded-lg">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Group</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="user in users" :key="user.id" 
              @click="navigateTo(`/admin/users/${user.id}`)"
              class="hover:bg-gray-50 cursor-pointer transition-colors"
          >
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm font-medium text-gray-900">{{ user.name }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-500">{{ user.email }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full" :class="user.grupo === 'pastores' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'">
                {{ user.grupo }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                {{ user.role }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span v-if="user.active" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                Active
              </span>
              <span v-else class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                Inactive
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              <button v-if="user.role !== 'superadmin'" @click.stop="toggleUserStatus(user.id)" class="text-indigo-600 hover:text-indigo-900">{{ user.active ? 'Deactivate' : 'Activate' }}</button>
              <span v-else class="text-gray-400">N/A</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
