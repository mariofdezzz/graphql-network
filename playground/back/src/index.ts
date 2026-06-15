import { createSchema, createYoga } from 'graphql-yoga'
import { createServer } from 'node:http'

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

interface GodAction {
  event: GodActionType
  actor: God
  affected: God
}

const godsData: God[] = [
  {
    id: '1',
    name: 'Zeus',
    domain: 'Sky & Thunder',
    symbol: 'Thunderbolt',
    romanEquivalent: 'Jupiter',
    parent: 'Cronos',
    description: 'King of the gods and ruler of the sky, wielding lightning bolts as his weapon.',
  },
  {
    id: '2',
    name: 'Poseidon',
    domain: 'Sea & Earthquakes',
    symbol: 'Trident',
    romanEquivalent: 'Neptune',
    parent: 'Cronos',
    description:
      'God of the seas, earthquakes, and horses. Often depicted carrying his iconic trident.',
  },
  {
    id: '3',
    name: 'Hades',
    domain: 'Underworld & Death',
    symbol: 'Helm of Darkness',
    romanEquivalent: 'Pluto',
    parent: 'Cronos',
    description:
      'Ruler of the underworld and the dead. Despite his dark domain, he is just and fair.',
  },
  {
    id: '4',
    name: 'Atenea',
    domain: 'Wisdom & Warfare',
    symbol: 'Owl',
    romanEquivalent: 'Minerva',
    parent: 'Zeus',
    description: "Goddess of wisdom, strategic warfare, and crafts. Born from Zeus's head.",
  },
  {
    id: '5',
    name: 'Apolo',
    domain: 'Sun, Music & Prophecy',
    symbol: 'Lyre',
    romanEquivalent: 'Apollo',
    parent: 'Zeus',
    description:
      'God of the sun, music, poetry, and prophecy. Known for his beauty and artistic talents.',
  },
  {
    id: '6',
    name: 'Artemisa',
    domain: 'Hunt & Moon',
    symbol: 'Bow',
    romanEquivalent: 'Diana',
    parent: 'Zeus',
    description: 'Goddess of the hunt and the moon. Protector of young women and nature.',
  },
  {
    id: '7',
    name: 'Ares',
    domain: 'War & Violence',
    symbol: 'Spear',
    romanEquivalent: 'Mars',
    parent: 'Zeus',
    description: 'God of war and bloodlust. Represents the brutal aspects of warfare.',
  },
  {
    id: '8',
    name: 'Afrodita',
    domain: 'Love & Beauty',
    symbol: 'Dove',
    romanEquivalent: 'Venus',
    parent: null,
    description:
      'Goddess of love, beauty, and desire. Born from sea foam and rules the hearts of gods and mortals.',
  },
]

export const schema = createSchema({
  typeDefs: /* GraphQL */ `
    enum GodActionType {
      KILLED
      BLESSED
      CHALLENGED
      BETRAYED
      SAVED
    }

    type God {
      id: ID!
      name: String!
      domain: String!
      symbol: String!
      romanEquivalent: String!
      parent: String
      description: String!
    }

    type GodAction {
      event: GodActionType!
      actor: God!
      affected: God!
    }

    input CreateGodInput {
      name: String!
      domain: String!
      symbol: String!
      romanEquivalent: String!
      parent: String
      description: String!
    }

    type Query {
      gods: [God!]!
    }

    type Mutation {
      createGod(input: CreateGodInput!): God!
    }

    type Subscription {
      godAction: GodAction!
    }
  `,
  resolvers: {
    Query: {
      gods: () => new Promise((resolve) => setTimeout(() => resolve(godsData), 1000)),
    },
    Mutation: {
      createGod: (_, { input }: { input: Omit<God, 'id'> }) => {
        const newGod: God = {
          id: String(godsData.length + 1),
          ...input,
        }
        godsData.push(newGod)
        return newGod
      },
    },
    Subscription: {
      godAction: {
        async *subscribe() {
          const actionTypes: GodActionType[] = [
            'KILLED',
            'BLESSED',
            'CHALLENGED',
            'BETRAYED',
            'SAVED',
          ]
          while (true) {
            const randomDelay = 2500 + (Math.random() * 600 - 300)
            await new Promise((resolve) => setTimeout(resolve, randomDelay))

            const actor = godsData[Math.floor(Math.random() * godsData.length)]
            let affected = godsData[Math.floor(Math.random() * godsData.length)]
            while (affected.id === actor.id) {
              affected = godsData[Math.floor(Math.random() * godsData.length)]
            }

            const event = actionTypes[Math.floor(Math.random() * actionTypes.length)]

            yield {
              godAction: { event, actor, affected } as GodAction,
            }
          }
        },
      },
    },
  },
})

const yoga = createYoga({ schema })

const server = createServer(yoga)

server.listen(4000, () => {
  console.info('Server is running on http://localhost:4000/graphql')
})
