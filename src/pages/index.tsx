import { Button, Input, Spinner } from '@chakra-ui/react'
import type { NextPage } from 'next'
import { useEffect, useRef } from 'react'
import { useQueryClient } from 'react-query'
import { useInputState } from '../components/hooks'
import { trpc } from '../utils/trpc'

const Home: NextPage = () => {
    const [text, setText] = useInputState('')
    const listRef = useRef<HTMLUListElement>(null)

    const qc = useQueryClient()
    const addWords = trpc.useMutation(['words.add'], {
        onSuccess: () => {
            qc.invalidateQueries('words.getAll')
            setText('')
        },
    })
    const words = trpc.useQuery(['words.getAll'])

    useEffect(() => {
        const list = listRef.current
        if (list) {
            list.scrollTop = list.scrollHeight
        }
    }, [words.data])

    const renderContent = () => {
        if (words.isLoading) {
            return <Spinner />
        }

        if (words.data?.length) {
            return (
                <ul
                    ref={listRef}
                    className="h-full overflow-y-auto flex flex-col gap-y-2 w-full items-center pb-3"
                >
                    {words.data.map((word) => (
                        <li key={word.id}>{word.text}</li>
                    ))}
                </ul>
            )
        }
    }

    return (
        <main className="flex flex-col gap-y-4 items-center h-[100vh] w-[100vw]">
            {renderContent()}
            <form
                className="flex gap-x-5 w-[400px] my-10"
                onSubmit={(e) => {
                    e.preventDefault()
                    addWords.mutate({ text })
                }}
            >
                <Input
                    placeholder="Enter nice words"
                    className="flex-1"
                    value={text}
                    onChange={setText}
                />
                <Button
                    type="submit"
                    colorScheme="blue"
                    isLoading={addWords.isLoading}
                >
                    Send
                </Button>
            </form>
        </main>
    )
}

export default Home
