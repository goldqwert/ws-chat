import React, { useEffect, useState, KeyboardEvent } from 'react';
import './App.css';

type MessageType = {
  userName: string,
  message: string
}

const detectUrls = (message: string) => {
  var expression = /(https:\/\/[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?)/gi;
  var regex = new RegExp(expression);
  var t = 'www.google.com';

  if (t.match(regex)) {
  } else {
  }

  return message.replace(expression, '<a href="$1">$1</a>')
}



function App() {

  

  const [socket, setSocket] = useState<WebSocket | null>(null)
  const [messages, setMessages] = useState<MessageType[]>([])
  const [message, setMessage] = useState('')

  useEffect(() => {
    const socket = new WebSocket('wss://social-network.samuraijs.com/handlers/chatHandler.ashx');
    setSocket(socket)
    socket.onmessage = (event) => {
      let serverMessage = JSON.parse(event.data)
      setMessages((actualMessages) => [...serverMessage, ...actualMessages])
    }
  }, [])

  const send = () => {
    socket!.send(message)
    setMessage('')
  }

  const onKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if(e.ctrlKey && e.charCode === 13) {
      send()
    }
  }

  return (
    <div className="App">
      <div style={{height: 500, overflowY: 'scroll'}}>{messages.map((m: MessageType, index) => {
        return <div key={index}>
          <b>{m.userName}</b>: {m.message}
        </div>
      })}
      </div>
      <hr/>
      <textarea value={message} onKeyPress={onKeyPress} onChange={(e) => {setMessage(e.currentTarget.value)}}></textarea>
      <button onClick={send}>Send</button>
    </div>
  );
}

export default App;
