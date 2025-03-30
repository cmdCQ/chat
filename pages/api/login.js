import { useState, useEffect } from 'react'

export default function Home() {
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [password, setPassword] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      const res = await fetch('/api/messages')
      if (res.ok) {
        const data = await res.json()
        setMessages(data)
        setIsAuthenticated(true)
      }
    }
    checkAuth()
  }, [])

  const handleLogin = async (e) => {
    e.preventDefault()
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password })
    })
    if (res.ok) {
      setIsAuthenticated(true)
      fetchMessages()
    }
  }

  const fetchMessages = async () => {
    const res = await fetch('/api/messages')
    const data = await res.json()
    setMessages(data)
  }

  const submitMessage = async (e) => {
    e.preventDefault()
    await fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: newMessage })
    })
    setNewMessage('')
    fetchMessages()
  }

  if (!isAuthenticated) {
    return (
      <div style={{ maxWidth: '500px', margin: '2rem auto' }}>
        <form onSubmit={handleLogin}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="输入访问密码"
            required
          />
          <button type="submit">进入留言板</button>
        </form>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '800px', margin: '2rem auto' }}>
      <h1>紧急留言板</h1>
      
      <form onSubmit={submitMessage}>
        <textarea
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="输入留言内容"
          required
          style={{ width: '100%', height: '100px' }}
        />
        <button type="submit">提交留言</button>
      </form>

      <div style={{ marginTop: '2rem' }}>
        {messages.map((msg) => (
          <div key={msg._id} style={{ 
            padding: '1rem', 
            margin: '1rem 0',
            border: '1px solid #ddd'
          }}>
            <div style={{ color: '#666', fontSize: '0.8rem' }}>
              {new Date(msg.createdAt).toLocaleString()} - IP: {msg.ip}
            </div>
            <div style={{ marginTop: '0.5rem' }}>{msg.text}</div>
          </div>
        ))}
      </div>
    </div>
  )
              }
