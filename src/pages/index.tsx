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
        if (words.isFetching) {
            return <Spinner />
        }

        if (words.data?.length) {
            return words.data.map((word) => (
                <span key={word.id}>{word.text}</span>
            ))
        }
    }

    return (
        <main className="flex flex-col gap-y-4 items-center justify-center h-[100vh] w-[100vw]">
            <form
                className="flex gap-x-5 w-[400px]"
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
