import type { GraphQLNetworkRequest, GraphQLRequest } from '@/types/graphql-request'
import { faker } from '@faker-js/faker'
import { pascalCase } from 'case-anything'
import { computed, reactive, shallowReactive } from 'vue'

let referenceDate = faker.date.recent().getTime()

export const wsMockRequests = shallowReactive<GraphQLRequest[]>([
  {
    id: crypto.randomUUID(),
    name: 'NewMessage',
    status: 101,
    errors: computed(() => 0),
    operation: 'subscription',
    size: 0,
    timings: {
      startedAt: new Date().toISOString(),
      wallTime: 1231231,
      baseTimestamp: 1231231232,
    },
    headers: {
      general: {
        url: 'wss://example.com/graphql',
        method: 'GET',
        status: 101,
        remoteAddress: '127.0.0.1:443',
      },
      request: [],
      response: [],
    },
    initiator: {
      type: 'script',
      stack: {
        callFrames: [
          {
            functionName: 'startSubscription',
            scriptId: '1',
            url: 'https://example.com/app.js',
            lineNumber: 10,
            columnNumber: 15,
          },
        ],
      },
    },
    messages: reactive([
      {
        data: JSON.stringify({ type: 'connection_init' }),
        length: 25,
        time: new Date(),
        method: 'frameSent',
      },
      {
        data: JSON.stringify({ type: 'connection_ack' }),
        length: 25,
        time: new Date(),
        method: 'frameReceived',
      },
      {
        data: JSON.stringify({
          id: 'f0492f6e-78f2-4036-a8e2-875504dcebae',
          type: 'subscribe',
          payload: {
            variables: {},
            extensions: {},
            operationName: 'Reloj',
            query: 'subscription Reloj {\n  clock\n}',
          },
        }),
        length: 25,
        time: new Date(),
        method: 'frameSent',
      },
      {
        data: JSON.stringify({
          id: 'f0492f6e-78f2-4036-a8e2-875504dcebae',
          type: 'next',
          payload: { data: { clock: '2026-02-17T19:10:32.332Z' } },
        }),
        length: 25,
        time: new Date(),
        method: 'frameReceived',
      },
    ]),
  },
])

export const mockRequests: GraphQLRequest[] = faker.helpers.multiple(
  () => {
    referenceDate += faker.number.float({ min: 50, max: 1500, fractionDigits: 2 })
    const wait = faker.number.float({ min: 0, max: 100 })
    const send = faker.number.float({ min: 0, max: 100 })
    const connect = faker.number.float({ min: 0, max: 100 })
    const dns = faker.number.float({ min: 0, max: 100 })
    const blocked = faker.number.float({ min: 0, max: 100 })
    const _blocked_queueing = faker.number.float({ min: 0, max: 100 })
    const receive = faker.number.float({ min: 0, max: 1000 })
    const ssl = faker.number.float({ min: 0, max: connect })
    const total = blocked + dns + connect + send + wait + receive + ssl + _blocked_queueing
    const startedAt = new Date(referenceDate).toISOString()

    return {
      id: faker.string.uuid(),
      name: pascalCase(faker.lorem.words({ min: 2, max: 5 })),
      status: faker.helpers.arrayElement([200, 201, 400, 403, 404, 500]),
      errors: faker.number.int({ min: 0, max: 3 }),
      corsError: faker.datatype.boolean(),
      operation: faker.helpers.arrayElement(['query', 'mutation', 'unknown']),
      size: faker.number.int({ min: 500, max: 5000 }),
      timings: {
        startedAt: startedAt,
        total,
        _blocked_queueing,
        blocked,
        dns,
        connect,
        send,
        wait,
        receive,
        ssl,
        waterfall: new Date(startedAt).getTime() + _blocked_queueing,
      },
      headers: {
        general: {
          url: faker.internet.url(),
          method: faker.helpers.arrayElement(['GET', 'POST', 'PUT', 'DELETE']),
          status: faker.helpers.arrayElement([200, 201, 400, 401, 403, 404, 500]),
          remoteAddress: faker.internet.ipv4() + ':443',
        },
        response: [
          {
            name: 'content-type',
            value: 'application/json',
          },
          {
            name: 'cache-control',
            value: 'no-cache',
          },
        ],
        request: [
          {
            name: 'content-type',
            value: 'application/json',
          },
          {
            name: 'authorization',
            value: `Bearer ${faker.string.alphanumeric(20)}`,
          },
        ],
      },
      payload: {
        query: `query Character {
  characters {
    results {
      id
      name
    }
  }
}`,
        variables: {
          id: faker.number.int({ min: 1, max: 1000 }),
          group: {
            type: 'admin',
            permissions: ['read', 'write', 'execute'],
          },
          null: null,
        },
      },
      initiator: {
        type: 'script',
        stack: {
          callFrames: [
            {
              functionName: faker.hacker.verb() + pascalCase(faker.hacker.noun()),
              scriptId: faker.number.int({ min: 1, max: 100 }).toString(),
              url: faker.internet.url(),
              lineNumber: faker.number.int({ min: 1, max: 500 }),
              columnNumber: faker.number.int({ min: 1, max: 100 }),
            },
            {
              functionName: faker.hacker.verb() + pascalCase(faker.hacker.noun()),
              scriptId: faker.number.int({ min: 1, max: 100 }).toString(),
              url: faker.internet.url(),
              lineNumber: faker.number.int({ min: 1, max: 500 }),
              columnNumber: faker.number.int({ min: 1, max: 100 }),
            },
          ],
          parent: {
            description: 'Parent stack frame',
            callFrames: [
              {
                functionName: faker.hacker.verb() + pascalCase(faker.hacker.noun()),
                scriptId: faker.number.int({ min: 1, max: 100 }).toString(),
                url: faker.internet.url(),
                lineNumber: faker.number.int({ min: 1, max: 500 }),
                columnNumber: faker.number.int({ min: 1, max: 100 }),
              },
            ],
            parent: {
              description: 'Grandparent stack frame',
              callFrames: [
                {
                  functionName: faker.hacker.verb() + pascalCase(faker.hacker.noun()),
                  scriptId: faker.number.int({ min: 1, max: 100 }).toString(),
                  url: faker.internet.url(),
                  lineNumber: faker.number.int({ min: 1, max: 500 }),
                  columnNumber: faker.number.int({ min: 1, max: 100 }),
                },
              ],
            },
          },
        },
      },
      response: {
        data: {
          user: {
            id: faker.number.int({ min: 1, max: 1000 }),
            name: faker.person.fullName(),
            email: faker.internet.email(),
          },
        },
        errors: faker.datatype.boolean()
          ? [
              {
                message: 'An error occurred',
                locations: [{ line: 2, column: 4 }],
              },
            ]
          : undefined,
      },
    } satisfies GraphQLNetworkRequest
  },
  { count: 15 },
)
