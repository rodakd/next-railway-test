import { withTRPC } from '@trpc/next'
import type { AppRouter } from '../server/router'
import type { AppType } from 'next/dist/shared/lib/utils'
import superjson from 'superjson'
import { SessionProvider } from 'next-auth/react'
import '../styles/globals.css'
import Head from 'next/head'

import { ChakraProvider, theme as chakraTheme } from '@chakra-ui/react'
// @ts-ignore
import resolveConfig from 'tailwindcss/resolveConfig'
import tailwindConfig from '../../tailwind.config.cjs'

const tailwind = resolveConfig(tailwindConfig)

// @ts-ignore
chakraTheme.colors.blue = tailwind.theme.colors.blue

export const theme = {
    ...chakraTheme,
    colors: {
        ...chakraTheme.colors,
        blue: {
            ...chakraTheme.colors.blue,
            50: chakraTheme.colors.gray[50],
            100: chakraTheme.colors.gray[100],
        },
        darkBlue: {
            ...chakraTheme.colors.blue,
            50: chakraTheme.colors.gray[50],
            500: chakraTheme.colors.blue[800],
            600: chakraTheme.colors.blue[700],
            700: chakraTheme.colors.blue[800],
            800: chakraTheme.colors.blue[900],
            900: chakraTheme.colors.blue[900],
        },
    },
}

const MyApp: AppType = ({
    Component,
    pageProps: { session, ...pageProps },
}) => {
    return (
        <SessionProvider session={session}>
            <Head>
                <title>Kind Words</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <ChakraProvider theme={theme}>
                <Component {...pageProps} />
            </ChakraProvider>
        </SessionProvider>
    )
}

const getBaseUrl = () => {
    if (typeof window !== 'undefined') {
        return ''
    }

    if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`

    return `http://localhost:${process.env.PORT ?? 3000}`
}

export default withTRPC<AppRouter>({
    config() {
        const url = `${getBaseUrl()}/api/trpc`
        return {
            url,
            transformer: superjson,
            queryClientConfig: {
                defaultOptions: {
                    queries: {
                        refetchOnWindowFocus: false,
                    },
                },
            },
        }
    },
    ssr: false,
})(MyApp)
