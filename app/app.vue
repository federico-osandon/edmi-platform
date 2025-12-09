<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white font-sans">
    <nav class="bg-gray-800/90 backdrop-blur-md border-b border-gray-700 sticky top-0 z-50">
      <div class="container mx-auto px-4 py-4 flex justify-between items-center">
        <NuxtLink to="/" class="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent hover:scale-105 transition-transform">
          EDMI
        </NuxtLink>
        <div class="flex gap-6">
          <NuxtLink to="/login" class="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
            Iniciar Sesión
          </NuxtLink>
          <NuxtLink to="/register" class="px-6 py-3 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-full font-medium hover:from-green-600 hover:to-teal-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
            Registrarse
          </NuxtLink>
        </div>
      </div>
    </nav>
    <main class="flex-1 min-h-screen">
      <NuxtPage />
    </main>
    <footer class="bg-gray-800/50 border-t border-gray-700 py-8 mt-16">
      <div class="container mx-auto px-4 text-center text-gray-400">
        <p>&copy; 2025 EDMI Trabajos. Todos los derechos reservados.</p>
      </div>
    </footer>
  </div>
</template>
