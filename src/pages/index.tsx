import { Button, Input, Spinner } from '@chakra-ui/react'
import type { NextPage } from 'next'
import { useQueryClient } from 'react-query'
import { useInputState } from '../components/hooks'
import { trpc } from '../utils/trpc'

const Home: NextPage = () => {
    const [text, setText] = useInputState('')

    const qc = useQueryClient()
    const addWords = trpc.useMutation(['words.add'], {
        onSuccess: () => {
            qc.invalidateQueries('words.getAll')
            setText('')
        },
    })
    const words = trpc.useQuery(['words.getAll'])

    const renderContent = () => {
        if (words.isLoading) {
            return <Spinner />
        }

        if (words.data?.length) {
            return (
                <ul className="h-full overflow-y-auto flex flex-col gap-y-2 w-full items-center pb-3">
                    {words.data.map((word) => (
                        <li key={word.id}>{word.text}</li>
                    ))}
                </ul>
            )
        }
    }

    return (
        <main className="flex flex-col gap-y-4 items-center h-[100vh] w-[100vw]">
            <form
                className="flex gap-x-5 w-[400px] mt-5"
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
            {renderContent()}
        </main>
    )
}

export default Home
