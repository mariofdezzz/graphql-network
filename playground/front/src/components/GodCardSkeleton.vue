<script setup lang="ts"></script>

<template>
  <div class="bg-white rounded-lg shadow-md p-6 border border-gray-200">
    <!-- Header skeleton -->
    <div class="flex justify-between items-start mb-4">
      <div class="flex-1">
        <div class="h-8 bg-gray-300 rounded animate-pulse w-3/4 mb-2"></div>
        <div class="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
      </div>
      <div class="h-8 bg-gray-300 rounded animate-pulse w-12"></div>
    </div>

    <!-- Domain skeleton -->
    <div class="space-y-3">
      <div>
        <div class="h-3 bg-gray-200 rounded animate-pulse w-16 mb-2"></div>
        <div class="h-5 bg-gray-300 rounded animate-pulse w-2/3"></div>
      </div>

      <!-- Parent skeleton -->
      <div class="pt-2 border-t border-gray-200">
        <div class="h-3 bg-gray-200 rounded animate-pulse w-16 mb-2"></div>
        <div class="h-5 bg-gray-300 rounded animate-pulse w-1/2"></div>
      </div>

      <!-- Description skeleton -->
      <div class="pt-2 border-t border-gray-200">
        <div class="h-3 bg-gray-200 rounded animate-pulse w-20 mb-2"></div>
        <div class="space-y-2">
          <div class="h-4 bg-gray-300 rounded animate-pulse w-full"></div>
          <div class="h-4 bg-gray-300 rounded animate-pulse w-5/6"></div>
          <div class="h-4 bg-gray-300 rounded animate-pulse w-4/5"></div>
        </div>
      </div>
    </div>
  </div>
</template>
