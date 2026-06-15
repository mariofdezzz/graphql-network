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

const toasts = ref<Toast[]>([])
const { result, loading, error, refetch } = useQuery<{ gods: God[] }>(GODS_QUERY)
const { mutate: createGod } = useMutation(CREATE_GOD_MUTATION)
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
      </div>
    </div>
  </UApp>
</template>

<style scoped></style>
