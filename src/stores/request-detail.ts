import type { GraphQLRequest } from '@/types/graphql-request'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useRequestDetailStore = defineStore('request-detail', () => {
  const requestDetail = ref<GraphQLRequest>()

  return {
    requestDetail,
  }
})
