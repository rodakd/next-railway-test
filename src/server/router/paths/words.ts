import { createRouter } from '../context'
import { z } from 'zod'

export const wordsRouter = createRouter()
    .mutation('add', {
        input: z.object({
            text: z.string(),
        }),
        async resolve({ ctx, input }) {
            await ctx.prisma.words.create({ data: { text: input.text } })
        },
    })
    .query('getAll', {
        async resolve({ ctx }) {
            return ctx.prisma.words.findMany()
        },
    })
