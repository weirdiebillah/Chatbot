import ChatWindow from '@/components/ChatWindow'
import { data } from '@/data'

export default function Home() {
  return (
    <main className={`flex min-h-screen flex-col items-center justify-center`}>
      <h1 className='font-semibold text-3xl text-cyan-700 mb-2'>ChatBot</h1>
      <ChatWindow />
    </main>
  )
}
