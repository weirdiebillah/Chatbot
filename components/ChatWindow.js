import { useEffect, useRef, useState } from 'react'
import ChatMessage from '@/components/ChatMessage'
import { data } from '@/data'

export default function ChatWindow() {
  const [userText, setUserText] = useState('')
  const [conversation, setConversation] = useState([
    {
      text: 'Greetings, user! Here are your options:',
      isUser: false
    },
    {
      text: '1. Type "/questions" to get a list of 5 random questions.',
      isUser: false
    },
    {
      text: '2. After getting random questions, type a number (1-5) to get the answer to a specific question.',
      isUser: false
    },
    {
      text: '3. Or just ask me anything!',
      isUser: false
    }
  ])

  const [randomQuestions, setRandomQuestions] = useState([])
  const containerRef = useRef(null);

  useEffect(() => {
    containerRef.current.scrollTop = containerRef.current.scrollHeight;
  }, [conversation]);

  const handleSendMessage = async (e) => {
    e.preventDefault()

    try {
      const userMessage = userText.trim()
      setUserText('')

      const updatedConversation = [
        ...conversation,
        {
          text: userMessage,
          isUser: true
        }
      ]

      setConversation(updatedConversation)

      let response

      if (userMessage.toLowerCase() === '/questions') {
        const newRandomQuestions = getRandomQuestions(5)
        setRandomQuestions(newRandomQuestions)
        response = {
          answer: "Here are 5 random questions you can ask:\n\n" + newRandomQuestions.map((q, i) => `${i + 1}. ${q}`).join('\n') + "\n\nPlease type a number (1-5) to get an answer to a specific question."
        }
      } else if (/^[1-5]$/.test(userMessage)) {
        if (randomQuestions.length > 0) {
          const questionIndex = parseInt(userMessage) - 1
          const selectedQuestion = randomQuestions[questionIndex]
          const answer = data.find(item => item.question === selectedQuestion)?.answer
          response = {
            answer: answer || "I'm sorry, I couldn't find an answer to that question."
          }
        } else {
          response = {
            answer: "I'm sorry, but you need to request random questions first by typing '/questions'. Then you can select a question by number."
          }
        }
      } else {
        // Check for common questions about the chatbot
        const lowercaseMessage = userMessage.toLowerCase()
        if (lowercaseMessage.includes('who are you') || lowercaseMessage.includes('what are you')) {
          response = {
            answer: "I'm a chatbot designed to answer questions and provide information. How can I assist you today?"
          }
        } else if (lowercaseMessage.includes('your name')) {
          response = {
            answer: "My name is ChatBot. It's nice to meet you!"
          }
        } else {
          // If it's not a common question about the chatbot, use the data array
          const matchingQuestion = data.find(item => 
            item.question.toLowerCase().includes(lowercaseMessage) || 
            lowercaseMessage.includes(item.question.toLowerCase())
          )
          
          if (matchingQuestion) {
            response = {
              answer: matchingQuestion.answer
            }
          } else {
            response = {
              answer: "I'm sorry, I don't have an answer for that question. Is there something else I can help you with?"
            }
          }
        }
      }

      const updatedConversationWithResponse = [
        ...updatedConversation,
        {
          text: response.answer,
          isUser: false
        }
      ]

      setConversation(updatedConversationWithResponse)
    } catch (error) {
      console.error('Error processing message:', error)
      // Provide a friendly error message to the user
      const errorResponse = {
        text: "I'm sorry, I encountered an error while processing your request. Please try again later.",
        isUser: false
      }
      setConversation([...updatedConversation, errorResponse])
    }
  }

  const getRandomQuestions = (count) => {
    const shuffled = [...data].sort(() => 0.5 - Math.random())
    return shuffled.slice(0, count).map(item => item.question)
  }

  return (
    <div className='w-[400px] h-[500px] bg-blue-400/25 rounded flex flex-col items-center justify-between'>
      <div ref={containerRef} className='flex-1 w-full py-2 px-3 rounded overflow-hidden overflow-y-scroll'>
        <div className='flex flex-col space-y-3'>
          {conversation.map((message, index) => (
            <div key={index} className={`flex justify-${message.isUser ? 'end' : 'start'}`}>
              <ChatMessage text={message.text} isUser={message.isUser} />
            </div>
          ))}
        </div>
      </div>
      <div className='w-full h-14 p-2 flex flex-col justify-center'>
        <form onSubmit={handleSendMessage} className='flex items-center justify-between space-x-3'>
          <input
            type='text'
            name='message'
            id='message'
            placeholder='Write your message'
            autoComplete='off'
            className='py-2 px-3 rounded-md flex-1 focus:ring-1 focus:ring-cyan-500 focus:outline-none'
            value={userText}
            onChange={e => setUserText(e.target.value)}
          />
          <button className='px-4 py-2 bg-cyan-500 rounded-md text-white' type='submit'>
            Send
          </button>
        </form>
      </div>
    </div>
  )
}
