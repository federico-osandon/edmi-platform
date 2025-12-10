<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'

definePageMeta({
  middleware: ['auth']
})

const auth = useAuthStore()
const router = useRouter()

// Initialize auth from sessionStorage on mount
onMounted(() => {
  auth.init()
})

// Check if user is admin
const isAdmin = computed(() => auth.user?.role === 'admin' || auth.user?.role === 'superadmin')

if (!isAdmin.value) {
  navigateTo('/courses')
}

// Form state
const form = reactive({
  title: '',
  slug: '',
  description: '',
  grupo: 'servidores' as 'pastores' | 'servidores',
  category: '',
  level: 'beginner' as 'beginner' | 'intermediate' | 'advanced',
  capacity: 0,
  startAt: '',
  endAt: '',
  published: false,
  thumbnailUrl: '',
  language: 'español',
  priceCents: null as number | null,
  currency: 'USD',
  requirements: '',
  isOnline: true,
  location: '',
  teacherId: null as number | null
})

// Lista fija de categorías para el frontend
const CATEGORY_OPTIONS = [
  'Desarrollo Ministerial', 
  'Estudios Bíblicos y Exégesis',
  'Teología y Doctrina',
  'Ministerio Pastoral y Práctico',
  'Liderazgo y Desarrollo de Equipos',
  'Misiones y Evangelismo',
  'Historia de la Iglesia',
  'Consejería y Cuidado de Almas',
  'Ética y Apologética',
  'Formación Espiritual y Vida Consagrada'
]

// Form validation
const errors = ref<Record<string, string>>({})
const loading = ref(false)
const successMessage = ref('')

const validateForm = () => {
  errors.value = {}
  
  if (!form.title.trim()) {
    errors.value.title = 'El título es requerido'
  }
  
  if (form.startAt && form.endAt) {
    const start = new Date(form.startAt)
    const end = new Date(form.endAt)
    if (end <= start) {
      errors.value.endAt = 'La fecha de fin debe ser posterior a la fecha de inicio'
    }
  }
  
  if (form.capacity < 0) {
    errors.value.capacity = 'La capacidad no puede ser negativa'
  }
  
  if (form.priceCents !== null && form.priceCents < 0) {
    errors.value.priceCents = 'El precio no puede ser negativo'
  }
  
  return Object.keys(errors.value).length === 0
}

const handleSubmit = async () => {
  if (!validateForm()) {
    return
  }
  
  loading.value = true
  errors.value = {}
  successMessage.value = ''
  
  try {
    // Get token from sessionStorage directly to ensure it's available
    const token = auth.token || (process.client ? sessionStorage.getItem('auth_token') : null)
    
    if (!token) {
      errors.value.general = 'No estás autenticado. Por favor inicia sesión.'
      navigateTo('/login')
      return
    }
    
    const response = await $fetch('/api/courses', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: {
        ...form,
        teacherId: form.teacherId || auth.user?.id,
        priceCents: form.priceCents != null ? parseInt(String(form.priceCents)) : null,
        capacity: form.capacity != null ? parseInt(String(form.capacity)) : 0
      }
    })
    
    successMessage.value = 'Curso creado exitosamente'
    
    // Redirect after success
    setTimeout(() => {
      router.push('/admin/courses')
    }, 1500)
    
  } catch (error: any) {
    console.error('Error creating course:', error)
    if (error.data?.errors) {
      error.data.errors.forEach((err: string) => {
        const field = err.split(' ')[0]
        errors.value[field] = err
      })
    } else {
      errors.value.general = error.data?.statusMessage || 'Error al crear el curso'
    }
  } finally {
    loading.value = false
  }
}

const generateSlug = () => {
  if (form.title) {
    form.slug = form.title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }
}

// Auto-generate slug when title changes
watch(() => form.title, () => {
  if (!form.slug || form.slug === '') {
    generateSlug()
  }
})
</script>

<template>
  <div class="min-h-screen bg-slate-900">
    <!-- Header -->
    <div class="bg-slate-800 border-b border-slate-700">
      <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <NuxtLink to="/admin/courses" class="mr-4 text-cyan-400 hover:text-cyan-300 transition-colors">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </NuxtLink>
            <div>
              <h1 class="text-3xl font-bold text-white">Crear Nuevo Curso</h1>
              <p class="mt-1 text-sm text-gray-400">Completa la información del curso</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Success Message -->
      <div v-if="successMessage" class="mb-6 bg-green-50 border-l-4 border-green-400 p-4 rounded-r-lg">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
            </svg>
          </div>
          <div class="ml-3">
            <p class="text-sm text-green-700">{{ successMessage }}</p>
          </div>
        </div>
      </div>

      <!-- Error Message -->
      <div v-if="errors.general" class="mb-6 bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
            </svg>
          </div>
          <div class="ml-3">
            <p class="text-sm text-red-700">{{ errors.general }}</p>
          </div>
        </div>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- Basic Information -->
        <div class="bg-slate-800 p-6 rounded-2xl shadow-xl border border-slate-700 overflow-hidden">
          <div class="px-6 py-4 border-b border-slate-700">
            <h2 class="text-lg font-semibold text-white">Información Básica</h2>
          </div>
          <div class="px-6 py-6 space-y-6">
            <!-- Title -->
            <div>
              <label for="title" class="block text-sm font-medium text-gray-300 mb-2">
                Título del Curso <span class="text-red-400">*</span>
              </label>
              <input
                id="title"
                v-model="form.title"
                type="text"
                required
                class="w-full px-4 py-2 bg-slate-700 border border-slate-600 text-white rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all placeholder-gray-400"
                :class="{ 'border-red-500': errors.title }"
                placeholder="Ej: Introducción a la Programación"
              />
              <p v-if="errors.title" class="mt-1 text-sm text-red-400">{{ errors.title }}</p>
            </div>

            <!-- Slug -->
            <div>
              <label for="slug" class="block text-sm font-medium text-gray-300 mb-2">
                Slug (URL amigable)
              </label>
              <div class="flex gap-2">
                <input
                  id="slug"
                  v-model="form.slug"
                  type="text"
                class="flex-1 px-4 py-2 bg-slate-700 border border-slate-600 text-white rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all placeholder-gray-400"
                  placeholder="introduccion-a-la-programacion"
                />
                <button
                  type="button"
                  @click="generateSlug"
                  class="px-4 py-2 bg-slate-700 text-gray-200 border border-slate-600 rounded-lg hover:bg-slate-600 transition-colors"
                >
                  Generar
                </button>
              </div>
              <p class="mt-1 text-xs text-gray-400">Se genera automáticamente desde el título</p>
            </div>

            <!-- Description -->
            <div>
              <label for="description" class="block text-sm font-medium text-gray-300 mb-2">
                Descripción
              </label>
              <textarea
                id="description"
                v-model="form.description"
                rows="4"
                class="w-full px-4 py-2 bg-slate-700 border border-slate-600 text-white rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all resize-none placeholder-gray-400"
                placeholder="Describe el contenido y objetivos del curso..."
              ></textarea>
            </div>

            <!-- Category, Language & Grupo -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label for="category" class="block text-sm font-medium text-gray-300 mb-2">
                  Categoría
                </label>
                <select
                  id="category"
                  v-model="form.category"
                  class="w-full px-4 py-2 bg-slate-700 border border-slate-600 text-white rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                >
                  <option value="">Selecciona categoría</option>
                  <option v-for="opt in CATEGORY_OPTIONS" :key="opt" :value="opt">{{ opt }}</option>
                </select>
              </div>

              <div>
                <label for="language" class="block text-sm font-medium text-gray-300 mb-2">
                  Idioma
                </label>
                <input
                  id="language"
                  v-model="form.language"
                  type="text"
                class="w-full px-4 py-2 bg-slate-700 border border-slate-600 text-white rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all placeholder-gray-400"
                  placeholder="español"
                />
              </div>

              <div>
                <label for="grupo" class="block text-sm font-medium text-gray-300 mb-2">
                  Grupo Destino <span class="text-red-400">*</span>
                </label>
                <select
                  id="grupo"
                  v-model="form.grupo"
                  required
                class="w-full px-4 py-2 bg-slate-700 border border-slate-600 text-white rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                  :class="{ 'border-red-500': errors.grupo }"
                >
                  <option value="servidores">Servidores</option>
                  <option value="pastores">Pastores</option>
                </select>
                <p v-if="errors.grupo" class="mt-1 text-sm text-red-400">{{ errors.grupo }}</p>
                <p class="mt-1 text-xs text-gray-400">Indica el grupo al que está dirigido este curso</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Course Details -->
        <div class="bg-slate-800 p-6 rounded-2xl shadow-xl border border-slate-700 overflow-hidden">
          <div class="px-6 py-4 border-b border-slate-700">
            <h2 class="text-lg font-semibold text-white">Detalles del Curso</h2>
          </div>
          <div class="px-6 py-6 space-y-6">
            <!-- Level & Capacity -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label for="level" class="block text-sm font-medium text-gray-300 mb-2">
                  Nivel
                </label>
                <select
                  id="level"
                  v-model="form.level"
                class="w-full px-4 py-2 bg-slate-700 border border-slate-600 text-white rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                >
                  <option value="beginner">Principiante</option>
                  <option value="intermediate">Intermedio</option>
                  <option value="advanced">Avanzado</option>
                </select>
              </div>

              <div>
                <label for="capacity" class="block text-sm font-medium text-gray-300 mb-2">
                  Capacidad Máxima
                </label>
                <input
                  id="capacity"
                  v-model.number="form.capacity"
                  type="number"
                  min="0"
                  class="w-full px-4 py-2 bg-slate-700 border border-slate-600 text-white rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all placeholder-gray-400"
                  :class="{ 'border-red-500': errors.capacity }"
                  placeholder="0 = sin límite"
                />
                <p v-if="errors.capacity" class="mt-1 text-sm text-red-400">{{ errors.capacity }}</p>
              </div>
            </div>

            <!-- Start & End Date -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label for="startAt" class="block text-sm font-medium text-gray-300 mb-2">
                  Fecha de Inicio
                </label>
                <input
                  id="startAt"
                  v-model="form.startAt"
                  type="datetime-local"
                  class="w-full px-4 py-2 bg-slate-700 border border-slate-600 text-white rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label for="endAt" class="block text-sm font-medium text-gray-300 mb-2">
                  Fecha de Fin
                </label>
                <input
                  id="endAt"
                  v-model="form.endAt"
                  type="datetime-local"
                  class="w-full px-4 py-2 bg-slate-700 border border-slate-600 text-white rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                  :class="{ 'border-red-500': errors.endAt }"
                />
                <p v-if="errors.endAt" class="mt-1 text-sm text-red-400">{{ errors.endAt }}</p>
              </div>
            </div>

            <!-- Thumbnail URL -->
            <div>
              <label for="thumbnailUrl" class="block text-sm font-medium text-gray-300 mb-2">
                URL de Imagen
              </label>
              <input
                id="thumbnailUrl"
                v-model="form.thumbnailUrl"
                type="url"
                class="w-full px-4 py-2 bg-slate-700 border border-slate-600 text-white rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all placeholder-gray-400"
                placeholder="https://ejemplo.com/imagen.jpg"
              />
            </div>

            <!-- Requirements -->
            <div>
              <label for="requirements" class="block text-sm font-medium text-gray-300 mb-2">
                Requisitos Previos
              </label>
              <textarea
                id="requirements"
                v-model="form.requirements"
                rows="3"
                class="w-full px-4 py-2 bg-slate-700 border border-slate-600 text-white rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all resize-none placeholder-gray-400"
                placeholder="Conocimientos o habilidades requeridas..."
              ></textarea>
            </div>
          </div>
        </div>

        <!-- Location & Price -->
        <div class="bg-slate-800 p-6 rounded-2xl shadow-xl border border-slate-700 overflow-hidden">
          <div class="px-6 py-4 border-b border-slate-700">
            <h2 class="text-lg font-semibold text-white">Ubicación y Precio</h2>
          </div>
          <div class="px-6 py-6 space-y-6">
            <!-- Is Online -->
            <div class="flex items-center">
              <input
                id="isOnline"
                v-model="form.isOnline"
                type="checkbox"
                class="h-4 w-4 text-cyan-500 focus:ring-cyan-500 border-slate-600 bg-slate-700 rounded"
              />
              <label for="isOnline" class="ml-2 block text-sm text-gray-300">
                Curso en línea
              </label>
            </div>

            <!-- Location (if not online) -->
            <div v-if="!form.isOnline">
              <label for="location" class="block text-sm font-medium text-gray-300 mb-2">
                Ubicación Física
              </label>
              <input
                id="location"
                v-model="form.location"
                type="text"
                class="w-full px-4 py-2 bg-slate-700 border border-slate-600 text-white rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all placeholder-gray-400"
                placeholder="Dirección del curso presencial"
              />
            </div>

            <!-- Price & Currency -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div class="md:col-span-2">
                <label for="priceCents" class="block text-sm font-medium text-gray-300 mb-2">
                  Precio (en centavos)
                </label>
                <input
                  id="priceCents"
                  v-model.number="form.priceCents"
                  type="number"
                  min="0"
                  class="w-full px-4 py-2 bg-slate-700 border border-slate-600 text-white rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all placeholder-gray-400"
                  :class="{ 'border-red-500': errors.priceCents }"
                  placeholder="9999 = $99.99"
                />
                <p v-if="errors.priceCents" class="mt-1 text-sm text-red-400">{{ errors.priceCents }}</p>
                <p class="mt-1 text-xs text-gray-400">Deja vacío para curso gratuito</p>
              </div>

              <div>
                <label for="currency" class="block text-sm font-medium text-gray-300 mb-2">
                  Moneda
                </label>
                <select
                  id="currency"
                  v-model="form.currency"
                  class="w-full px-4 py-2 bg-slate-700 border border-slate-600 text-white rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="MXN">MXN</option>
                  <option value="ARS">ARS</option>
                  <option value="CLP">CLP</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <!-- Publishing -->
        <div class="bg-slate-800 p-6 rounded-2xl shadow-xl border border-slate-700 overflow-hidden">
          <div class="px-6 py-4 border-b border-slate-700">
            <h2 class="text-lg font-semibold text-white">Publicación</h2>
          </div>
          <div class="px-6 py-6">
            <div class="flex items-center">
              <input
                id="published"
                v-model="form.published"
                type="checkbox"
                class="h-4 w-4 text-cyan-500 focus:ring-cyan-500 border-slate-600 bg-slate-700 rounded"
              />
              <label for="published" class="ml-2 block text-sm text-gray-300">
                Publicar curso inmediatamente
              </label>
            </div>
            <p class="mt-2 text-xs text-gray-400">
              Si no está publicado, el curso permanecerá como borrador y solo será visible para administradores.
            </p>
          </div>
        </div>

        <!-- Form Actions -->
        <div class="flex items-center justify-end gap-4 pt-6">
          <NuxtLink
            to="/admin/courses"
            class="px-6 py-2 border-2 border-cyan-400 rounded-full text-sm font-medium text-cyan-400 bg-transparent hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transition-colors"
          >
            Cancelar
          </NuxtLink>
          <button
            type="submit"
            :disabled="loading"
            class="px-6 py-2 border border-transparent rounded-full shadow-sm text-sm font-medium text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <span v-if="loading" class="flex items-center">
              <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creando...
            </span>
            <span v-else>Crear Curso</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
