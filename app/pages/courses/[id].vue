<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'

definePageMeta({
  middleware: ['auth']
})

const route = useRoute()
const auth = useAuthStore()
const courseId = route.params.id

// Fetch course data with user ID to check enrollment status
const { data: course, error, refresh } = await useFetch(`/api/courses/${courseId}`, {
  query: { userId: auth.user?.id }
})

// Candidates selection
const showEnrollModal = ref(false)
const selectedCandidates = ref<number[]>([])
const candidates = ref<any[]>([])

// Enrolled Students
const showStudentsModal = ref(false)
const enrolledStudents = ref<any[]>([])

const loadCandidates = async () => {
  try {
    const data = await $fetch('/api/admin/candidates', {
      query: { courseId }
    })
    candidates.value = data
  } catch (e) {
    console.error('Failed to load candidates', e)
    alert('Error loading candidates list')
  }
}

const loadEnrolledStudents = async () => {
  try {
    const data = await $fetch(`/api/courses/${courseId}/students`)
    enrolledStudents.value = data
  } catch (e) {
    console.error('Failed to load enrolled students', e)
    alert('Error loading students list')
  }
}

const toggleCandidate = (id: number) => {
  if (selectedCandidates.value.includes(id)) {
    selectedCandidates.value = selectedCandidates.value.filter(cid => cid !== id)
  } else {
    selectedCandidates.value.push(id)
  }
}

const enrollSelected = async () => {
  if (selectedCandidates.value.length === 0) return

  try {
    await $fetch(`/api/courses/${courseId}/enroll`, {
      method: 'POST',
      body: { userIds: selectedCandidates.value }
    })
    
    alert('Alumnos matriculados correctamente')
    showEnrollModal.value = false
    selectedCandidates.value = []
    
    refresh()
    loadCandidates()
    
  } catch (e: any) {
    alert(e.statusMessage || 'Error al matricular alumnos')
  }
}

const unenrollStudent = async (userId: number) => {
    if(!confirm('¿Estás seguro de que quieres desmatricular a este alumno?')) return

    try {
        await $fetch(`/api/courses/${courseId}/unenroll`, {
            method: 'POST',
            body: { userId }
        })
        alert('Alumno desmatriculado')
        loadEnrolledStudents()
        refresh() // Update enrollment status if viewing as that user (unlikely but good practice)
    } catch (e: any) {
        alert(e.statusMessage || 'Error al desmatricular')
    }
}

// Open modals
const openEnrollModal = () => {
  showEnrollModal.value = true
  loadCandidates()
}

const openStudentsModal = () => {
    showStudentsModal.value = true
    loadEnrolledStudents()
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
          
          <!-- Admin Actions -->
          <div v-if="auth.isAdmin || auth.isSuperAdmin" class="flex gap-2">
            <button
                @click="openEnrollModal"
                class="px-5 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl font-semibold shadow-lg hover:from-cyan-600 hover:to-blue-700 transition-all duration-300 transform hover:-translate-y-1"
            >
              Matricular Alumnos
            </button>
             <button
              @click="openStudentsModal"
              class="px-5 py-3 bg-gray-700 border border-gray-600 text-white rounded-xl font-semibold shadow hover:bg-gray-600 transition-all duration-300"
            >
              Ver Alumnos ({{ enrolledStudents.length || '...' }}) 
            </button>
          </div>

           <!-- Student Status -->
          <div v-else>
             <div v-if="!course.isEnrolled" class="bg-yellow-900/30 border border-yellow-700/50 text-yellow-200 px-6 py-4 rounded-xl">
                 <p class="font-medium">⚠️ Pronto será matriculado en este curso.</p>
             </div>
             <div v-else class="bg-green-900/30 border border-green-700/50 text-green-200 px-6 py-4 rounded-xl">
                 <p class="font-medium">✓ Estás matriculado en este curso.</p>
             </div>
          </div>

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
            <p v-if="course.isEnrolled || auth.isAdmin || auth.isSuperAdmin" class="text-sm text-cyan-100">Accede al contenido y tareas del curso desde aquí.</p>
             <p v-else class="text-sm text-gray-400">Contenido restringido.</p>
          </div>
        </div>
      </div>

      <div v-else-if="error" class="text-red-400 bg-red-900/30 border border-red-700 rounded-xl p-6">
        Curso no encontrado.
      </div>

      <!-- Content (only for enrolled or admin) -->
      <div v-if="course && (course.isEnrolled || auth.isAdmin || auth.isSuperAdmin)" class="mt-10">
        <h2 class="text-2xl font-bold text-white mb-4">Tareas</h2>
        <div class="bg-gray-800/60 border border-gray-700 rounded-xl p-6">
          <p class="text-gray-400 italic">Las tareas estarán disponibles próximamente.</p>
        </div>
      </div>
      
      <!-- Enroll Modal -->
      <div v-if="showEnrollModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
        <div class="bg-gray-800 border border-gray-700 rounded-2xl w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl">
          <div class="p-6 border-b border-gray-700 flex justify-between items-center">
            <h3 class="text-xl font-bold text-white">Matricular Alumnos</h3>
            <button @click="showEnrollModal = false" class="text-gray-400 hover:text-white">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div class="p-6 overflow-y-auto flex-1">
            <div v-if="candidates.length === 0" class="text-center py-8 text-gray-400">
              No hay alumnos activos pendientes de matricular.
            </div>
            <div v-else class="space-y-2">
              <div v-for="student in candidates" :key="student.id" 
                @click="toggleCandidate(student.id)"
                class="flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all"
                :class="selectedCandidates.includes(student.id) ? 'bg-cyan-900/30 border-cyan-500/50' : 'bg-gray-700/30 border-gray-600 hover:bg-gray-700/50'"
              >
                <div>
                  <p class="font-medium text-white">{{ student.name }}</p>
                  <p class="text-sm text-gray-400">{{ student.email }}</p>
                </div>
                <div class="w-6 h-6 rounded-full border flex items-center justify-center"
                  :class="selectedCandidates.includes(student.id) ? 'bg-cyan-500 border-cyan-500' : 'border-gray-500'"
                >
                  <svg v-if="selectedCandidates.includes(student.id)" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
          
          <div class="p-6 border-t border-gray-700 flex justify-end gap-3 bg-gray-800/50 rounded-b-2xl">
            <button @click="showEnrollModal = false" class="px-5 py-2.5 text-gray-300 hover:text-white font-medium">Cancel</button>
            <button 
              @click="enrollSelected" 
              :disabled="selectedCandidates.length === 0"
              class="px-5 py-2.5 bg-cyan-600 text-white rounded-lg font-medium hover:bg-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Matricular ({{ selectedCandidates.length }})
            </button>
          </div>
        </div>
      </div>

      <!-- Enrolled Students Modal -->
      <div v-if="showStudentsModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
        <div class="bg-gray-800 border border-gray-700 rounded-2xl w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl">
          <div class="p-6 border-b border-gray-700 flex justify-between items-center">
            <h3 class="text-xl font-bold text-white">Alumnos Matriculados</h3>
            <button @click="showStudentsModal = false" class="text-gray-400 hover:text-white">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div class="p-6 overflow-y-auto flex-1">
            <div v-if="enrolledStudents.length === 0" class="text-center py-8 text-gray-400">
              No hay alumnos matriculados.
            </div>
            <div v-else class="space-y-3">
              <div v-for="student in enrolledStudents" :key="student.id" 
                class="flex items-center justify-between p-4 rounded-xl border bg-gray-700/30 border-gray-600"
              >
                <div>
                  <p class="font-medium text-white">{{ student.name }}</p>
                  <p class="text-sm text-gray-400">{{ student.email }}</p>
                  <p class="text-xs text-gray-500 mt-1">Matriculado: {{ new Date(student.enrolledAt).toLocaleDateString() }}</p>
                </div>
                <div class="flex gap-2">
                    <button @click="unenrollStudent(student.id)" class="text-red-400 hover:text-red-300 p-2 hover:bg-red-900/20 rounded-lg transition-colors" title="Desmatricular">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                             <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                </div>
              </div>
            </div>
          </div>
          
          <div class="p-6 border-t border-gray-700 flex justify-end gap-3 bg-gray-800/50 rounded-b-2xl">
            <button @click="showStudentsModal = false" class="px-5 py-2.5 text-gray-300 hover:text-white font-medium">Cerrar</button>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>
