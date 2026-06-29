<script setup lang="ts">
import { useMutation, useQuery, useSubscription } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import { onMounted, ref } from 'vue'
import GodCard from './components/GodCard.vue'
import GodCardSkeleton from './components/GodCardSkeleton.vue'

type GodActionType = 'KILLED' | 'BLESSED' | 'CHALLENGED' | 'BETRAYED' | 'SAVED'

interface God {
  id: string
  name: string
  domain: string
  symbol: string
  romanEquivalent: string
  parent: string | null
  description: string
}

interface Toast {
  id: string
  event: GodActionType
  actor: God
  affected: God
}

const GODS_QUERY = gql`
  query Gods {
    gods {
      id
      name
      domain
      symbol
      romanEquivalent
      parent
      description
    }
  }
`

const CREATE_GOD_MUTATION = gql`
  mutation CreateGod($input: CreateGodInput!) {
    createGod(input: $input) {
      id
      name
      domain
      symbol
      romanEquivalent
      parent
      description
    }
  }
`

const UPLOAD_GOD_AVATAR_MUTATION = gql`
  mutation UploadGodAvatar($id: ID!, $file: File!) {
    uploadGodAvatar(id: $id, file: $file) {
      id
      name
    }
  }
`

const GOD_ACTION_SUBSCRIPTION = gql`
  subscription GodAction {
    godAction {
      event
      actor {
        id
        name
        domain
        symbol
        romanEquivalent
        parent
        description
      }
      affected {
        id
        name
        domain
        symbol
        romanEquivalent
        parent
        description
      }
    }
  }
`

const UPLOAD_FAVICON_MUTATION = gql`
  mutation UploadFavicon($file: File!) {
    uploadFavicon(file: $file) {
      name
      size
    }
  }
`

const SET_COOKIE_MUTATION = gql`
  mutation SetCookie {
    setCookie
  }
`

const toasts = ref<Toast[]>([])
const uploadGodId = ref('1')
const uploadFile = ref<File | null>(null)
const uploadStatus = ref<string | null>(null)
const uploadLoading = ref(false)

async function handleGodAvatarUpload() {
  if (!uploadFile.value) return

  uploadLoading.value = true
  uploadStatus.value = null

  const operations = JSON.stringify({
    query: `mutation UploadGodAvatar($id: ID!, $file: File!) { uploadGodAvatar(id: $id, file: $file) { id name } }`,
    variables: { id: uploadGodId.value, file: null },
  })
  const map = JSON.stringify({ '0': ['variables.file'] })

  const body = new FormData()
  body.append('operations', operations)
  body.append('map', map)
  body.append('0', uploadFile.value, uploadFile.value.name)

  try {
    const res = await fetch('http://localhost:4000/graphql', { method: 'POST', body })
    const json = await res.json()
    uploadStatus.value = json.data
      ? `Uploaded for ${json.data.uploadGodAvatar.name}`
      : `Error: ${json.errors?.[0]?.message}`
  } catch (e: any) {
    uploadStatus.value = `Error: ${e.message}`
  } finally {
    uploadLoading.value = false
  }
}
const { result, loading, error, refetch } = useQuery<{ gods: God[] }>(GODS_QUERY)
const { mutate: createGod } = useMutation(CREATE_GOD_MUTATION)
const { mutate: uploadFavicon } = useMutation(UPLOAD_FAVICON_MUTATION)
const { mutate: setCookie } = useMutation(SET_COOKIE_MUTATION)
const { onResult } = useSubscription(GOD_ACTION_SUBSCRIPTION)

const actionIcons: Record<GodActionType, string> = {
  KILLED: '⚡',
  BLESSED: '✨',
  CHALLENGED: '⚔️',
  BETRAYED: '🗡️',
  SAVED: '🛡️',
}

const actionColors: Record<GodActionType, string> = {
  KILLED: 'bg-red-500',
  BLESSED: 'bg-yellow-500',
  CHALLENGED: 'bg-purple-500',
  BETRAYED: 'bg-orange-500',
  SAVED: 'bg-green-500',
}

onResult((result) => {
  if (result.data?.godAction) {
    const { event, actor, affected } = result.data.godAction
    const toastId = Date.now().toString()
    const toast: Toast = { id: toastId, event, actor, affected }
    toasts.value.push(toast)

    setTimeout(() => {
      toasts.value = toasts.value.filter((t) => t.id !== toastId)
    }, 4000)
  }
})

onMounted(() => {
  setTimeout(async () => {
    await createGod({
      input: {
        name: 'Hermes',
        domain: 'Messengers & Trade',
        symbol: 'Caduceus',
        romanEquivalent: 'Mercury',
        parent: 'Zeus',
        description:
          'God of messengers, thieves, and commerce. Known for his winged sandals and swift movement.',
      },
    })
    await refetch()
  }, 1500)

  fetch('/favicon.ico')
    .then((res) => res.blob())
    .then((blob) => {
      const file = new File([blob], 'favicon.ico', { type: blob.type })
      return uploadFavicon({ file })
    })
})
</script>

<template>
  <UApp>
    <div class="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <!-- Toast Container -->
      <div class="fixed bottom-4 right-4 space-y-2 z-50">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          :class="[
            actionColors[toast.event],
            'rounded-lg shadow-lg p-4 text-white text-sm font-medium max-w-xs',
          ]"
        >
          <div class="flex items-center gap-2">
            <span>{{ actionIcons[toast.event] }}</span>
            <span
              >{{ toast.actor.name }} {{ toast.event.toLowerCase() }}
              {{ toast.affected.name }}</span
            >
          </div>
        </div>
      </div>
      <div class="max-w-7xl mx-auto">
        <!-- Header -->
        <div class="mb-12 text-center">
          <h1 class="text-4xl md:text-5xl font-bold text-gray-800 mb-2">Greek Gods</h1>
          <p class="text-gray-600 text-lg">Explore the mighty deities of ancient Greece</p>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <GodCardSkeleton v-for="i in 6" :key="`skeleton-${i}`" />
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p class="text-red-700 font-semibold">Error loading gods</p>
          <p class="text-red-600 text-sm mt-2">{{ error.message }}</p>
        </div>

        <!-- Data State -->
        <div v-else-if="result?.gods" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <GodCard v-for="god in result.gods" :key="god.id" :god="god" />
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-12">
          <p class="text-gray-600">No gods found</p>
        </div>

        <!-- Set Cookie Section -->
        <div class="mt-12 bg-white rounded-xl shadow p-6 max-w-md mx-auto text-center">
          <h2 class="text-xl font-semibold text-gray-800 mb-4">Set Cookie</h2>
          <p class="text-sm text-gray-500 mb-4">
            Sends a mutation that returns a <code class="bg-gray-100 px-1 rounded">Set-Cookie</code> response header.
          </p>
          <button
            class="bg-indigo-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
            @click="setCookie()"
          >
            Set Cookie
          </button>
        </div>

        <!-- Upload Avatar Section -->
        <div class="mt-12 bg-white rounded-xl shadow p-6 max-w-md mx-auto">
          <h2 class="text-xl font-semibold text-gray-800 mb-4">Upload God Avatar</h2>
          <p class="text-sm text-gray-500 mb-4">
            Sends a <code class="bg-gray-100 px-1 rounded">multipart/form-data</code> GraphQL
            mutation — visible in the extension as a FormData request.
          </p>
          <div class="space-y-3">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">God ID</label>
              <input
                v-model="uploadGodId"
                type="text"
                class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                placeholder="1"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Avatar file</label>
              <input
                type="file"
                accept="image/*"
                class="block w-full text-sm text-gray-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                @change="
                  (e) => {
                    uploadFile = (e.target as HTMLInputElement).files?.[0] ?? null
                  }
                "
              />
            </div>
            <button
              :disabled="!uploadFile || uploadLoading"
              class="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              @click="handleGodAvatarUpload"
            >
              {{ uploadLoading ? 'Uploading…' : 'Upload avatar' }}
            </button>
            <p
              v-if="uploadStatus"
              class="text-sm text-center"
              :class="uploadStatus.startsWith('Error') ? 'text-red-600' : 'text-green-600'"
            >
              {{ uploadStatus }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </UApp>
</template>

<style scoped></style>
