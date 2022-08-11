import superjson from 'superjson'
import { createRouter } from './context'
import { wordsRouter } from './paths/words'

export const appRouter = createRouter()
    .transformer(superjson)
    .merge('words.', wordsRouter)

export type AppRouter = typeof appRouter
