import type { GraphQLRequest } from '@/types/graphql-request'
import { faker } from '@faker-js/faker'
import { pascalCase } from 'case-anything'

let referenceDate = faker.date.recent().getTime()

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

    return {
      id: faker.string.uuid(),
      name: pascalCase(faker.lorem.words({ min: 2, max: 5 })),
      status: faker.helpers.arrayElement([200, 201, 400, 403, 404, 500]),
      errors: faker.number.int({ min: 0, max: 3 }),
      operation: faker.helpers.arrayElement(['query', 'mutation', 'subscription', 'unknown']),
      size: faker.number.int({ min: 500, max: 5000 }),
      timings: {
        startedAt: new Date(referenceDate).toISOString(),
        total,
        _blocked_queueing,
        blocked,
        dns,
        connect,
        send,
        wait,
        receive,
        ssl,
        waterfall: 0,
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
    } satisfies GraphQLRequest
  },
  { count: 15 },
)
