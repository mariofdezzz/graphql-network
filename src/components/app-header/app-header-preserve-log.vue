<script setup lang="ts">
const preserveLog = defineModel('preserveLog', { type: Boolean })
</script>

<template>
  <div
    title="Do not clear log on page reload / navigation"
    class="flex gap-1 items-center px-2 text-xs"
  >
    <input type="checkbox" v-model="preserveLog" id="preserve-log" name="preserve-log" />

    <label for="preserve-log"> Preserve log </label>
  </div>
</template>
