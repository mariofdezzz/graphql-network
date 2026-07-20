<script setup lang="ts">
import { useMutation, useQuery, useSubscription } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import { onMounted, ref } from 'vue'
import GodCard from './components/GodCard.vue'
import GodCardSkeleton from './components/GodCardSkeleton.vue'

type GodActionType = 'KILLED' | 'BLESSED' | 'CHALLENGED' | 'BETRAYED' | 'SAVED'
type Protocol = 'SSE' | 'WS'

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
  protocol: Protocol
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

const toasts = ref<Toast[]>([])
const uploadGodId = ref('1')
const uploadFile = ref<File | null>(null)
const uploadStatus = ref<string | null>(null)

// Connection status tracking
const sseConnected = ref(false)
const wsConnected = ref(false)
const sseEventCount = ref(0)
const wsEventCount = ref(0)

const { result, loading, error, refetch } = useQuery<{ gods: God[] }>(GODS_QUERY)
const { mutate: createGod } = useMutation(CREATE_GOD_MUTATION)
const { mutate: uploadFavicon } = useMutation(UPLOAD_FAVICON_MUTATION)
const { mutate: uploadGodAvatar, loading: uploadAvatarLoading } = useMutation(
  UPLOAD_GOD_AVATAR_MUTATION,
)

async function handleGodAvatarUpload() {
  if (!uploadFile.value) return

  uploadStatus.value = null

  try {
    const result = await uploadGodAvatar({
      id: uploadGodId.value,
      file: uploadFile.value,
    })

    if (result?.data) {
      uploadStatus.value = `Uploaded for ${result.data.uploadGodAvatar.name}`
    }
  } catch (e) {
    uploadStatus.value = `Error: ${(e as Error).message}`
  }
}

// SSE Subscription (port 4000)
const { onResult: onResultSSE } = useSubscription(GOD_ACTION_SUBSCRIPTION)

// WebSocket Subscription (port 4001)
const { onResult: onResultWS } = useSubscription(GOD_ACTION_SUBSCRIPTION, null, {
  clientId: 'wsClient',
})

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

// Handle SSE subscription results
onResultSSE((result) => {
  if (result.data?.godAction) {
    sseConnected.value = true
    sseEventCount.value++
    const { event, actor, affected } = result.data.godAction
    const toastId = `sse-${Date.now()}`
    const toast: Toast = { id: toastId, event, actor, affected, protocol: 'SSE' }
    toasts.value.push(toast)

    console.log('📡 SSE Event:', { event, actor: actor.name, affected: affected.name })

    setTimeout(() => {
      toasts.value = toasts.value.filter((t) => t.id !== toastId)
    }, 4000)
  }
})

// Handle WebSocket subscription results
onResultWS((result) => {
  if (result.data?.godAction) {
    wsConnected.value = true
    wsEventCount.value++
    const { event, actor, affected } = result.data.godAction
    const toastId = `ws-${Date.now()}`
    const toast: Toast = { id: toastId, event, actor, affected, protocol: 'WS' }
    toasts.value.push(toast)

    console.log('🔌 WebSocket Event:', { event, actor: actor.name, affected: affected.name })

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
      <!-- Connection Status Indicators -->
      <div class="fixed top-4 right-4 space-y-2 z-50">
        <div class="bg-white rounded-lg shadow-lg px-4 py-3 text-xs space-y-2">
          <div class="flex items-center gap-2">
            <div :class="['w-2 h-2 rounded-full', sseConnected ? 'bg-green-500' : 'bg-gray-300']" />
            <span class="font-medium">SSE (4000)</span>
            <span class="text-gray-500">{{ sseEventCount }} events</span>
          </div>
          <div class="flex items-center gap-2">
            <div :class="['w-2 h-2 rounded-full', wsConnected ? 'bg-blue-500' : 'bg-gray-300']" />
            <span class="font-medium">WebSocket (4001)</span>
            <span class="text-gray-500">{{ wsEventCount }} events</span>
          </div>
        </div>
      </div>

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
          <div class="flex items-center justify-between gap-3">
            <div class="flex items-center gap-2 flex-1">
              <span>{{ actionIcons[toast.event] }}</span>
              <span
                >{{ toast.actor.name }} {{ toast.event.toLowerCase() }}
                {{ toast.affected.name }}</span
              >
            </div>
            <span
              :class="[
                'text-[10px] font-bold px-2 py-0.5 rounded',
                toast.protocol === 'SSE'
                  ? 'bg-white/20 border border-white/30'
                  : 'bg-black/20 border border-white/30',
              ]"
            >
              {{ toast.protocol }}
            </span>
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
                  (e: Event) => {
                    uploadFile = (e.target as any)?.files?.[0] ?? null
                  }
                "
              />
            </div>
            <button
              :disabled="!uploadFile || uploadAvatarLoading"
              class="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              @click="handleGodAvatarUpload"
            >
              {{ uploadAvatarLoading ? 'Uploading…' : 'Upload avatar' }}
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
