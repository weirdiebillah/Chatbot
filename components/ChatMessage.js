import classNames from 'classnames'

const ChatMessage = ({ text, isUser }) => {
  const messageClass = classNames('px-2 py-1 rounded-xl shadow-sm', {
    'bg-white text-gray-900 rounded-br-none': isUser,
    'bg-blue-400 text-white rounded-bl-none': !isUser
  })

  return (
    <div className={messageClass}>
      {text.split('\n').map((line, index) => (
        <p key={index}>{line}</p>
      ))}
    </div>
  )
}

export default ChatMessage
