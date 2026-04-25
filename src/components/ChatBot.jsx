import { useState, useRef, useEffect, useCallback } from 'react'
import { X, Send, Loader2, ChevronDown, Sparkles, RotateCcw } from 'lucide-react'

const API = import.meta.env.VITE_API_URL || 'http://localhost:3001'

const QUICK_PROMPTS = [
  '🌿 What products do you have?',
  '🐛 Best insecticide for cotton?',
  '🍃 Fungicide for paddy blast?',
  '🌱 Fertilizer recommendations?',
  '📞 How to contact TulipCrop?',
]

const WELCOME_MSG = {
  role: 'assistant',
  content: `👋 Namaste! I'm **TulipBot**, your personal guide to TulipCrop products.

I can help you with:
• Product details & dosage
• Choosing the right product for your crop
• Disease & pest control solutions
• Company information

How can I assist you today? 🌾`,
}

const parseMarkdown = (text) => {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/^• (.+)$/gm, '<li>$1</li>')
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>)/gs, '<ul class="tulipbot-list">$1</ul>')
    .replace(/\n\n/g, '<br/><br/>')
    .replace(/\n/g, '<br/>')
}

export default function ChatBot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([WELCOME_MSG])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [unread, setUnread] = useState(0)
  const [showScrollBtn, setShowScrollBtn] = useState(false)
  const messagesEndRef = useRef(null)
  const messagesContainerRef = useRef(null)
  const inputRef = useRef(null)

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    if (open) {
      scrollToBottom()
      setUnread(0)
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [open, scrollToBottom])

  useEffect(() => {
    if (open) scrollToBottom()
    else if (messages.length > 1) setUnread((n) => n + 1)
  }, [messages, open, scrollToBottom])

  const handleScroll = () => {
    const el = messagesContainerRef.current
    if (!el) return
    const distFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight
    setShowScrollBtn(distFromBottom > 80)
  }

  const sendMessage = useCallback(async (text) => {
    const userText = (text || input).trim()
    if (!userText || loading) return
    setInput('')

    const userMsg = { role: 'user', content: userText }
    setMessages((prev) => [...prev, userMsg])
    setLoading(true)

    try {
      // Build history excluding the welcome message (system-only context)
      const history = messages
        .filter((m) => m.role !== 'assistant' || m !== WELCOME_MSG)
        .concat(userMsg)
        .map(({ role, content }) => ({ role, content }))

      const res = await fetch(`${API}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history }),
      })

      if (!res.ok) throw new Error(`Server error ${res.status}`)
      const { reply } = await res.json()
      setMessages((prev) => [...prev, { role: 'assistant', content: reply }])
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: '⚠️ Sorry, I encountered an error. Please try again.',
        },
      ])
    } finally {
      setLoading(false)
    }
  }, [input, loading, messages])

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const resetChat = () => {
    setMessages([WELCOME_MSG])
    setInput('')
    setUnread(0)
  }

  return (
    <>
      {/* ── Floating Button ── */}
      <button
        id="tulipbot-toggle"
        onClick={() => { setOpen((o) => !o); setUnread(0) }}
        className="tulipbot-fab"
        aria-label="Open TulipBot chat"
      >
        <div className="tulipbot-fab-inner">
          {open ? (
            <X className="tulipbot-fab-icon" />
          ) : (
            <img src="/logo.png" alt="TulipBot" className="tulipbot-logo-icon" />
          )}
        </div>
        {!open && unread > 0 && (
          <span className="tulipbot-badge">{unread > 9 ? '9+' : unread}</span>
        )}
        {!open && (
          <span className="tulipbot-pulse" />
        )}
      </button>

      {/* ── Chat Window ── */}
      <div className={`tulipbot-window ${open ? 'tulipbot-window--open' : ''}`} role="dialog" aria-label="TulipBot Chat">
        {/* Header */}
        <div className="tulipbot-header">
          <div className="tulipbot-header-left">
            <div className="tulipbot-avatar">
              <img src="/logo.png" alt="TulipBot" className="tulipbot-avatar-img" />
              <span className="tulipbot-online-dot" />
            </div>
            <div>
              <div className="tulipbot-header-name">TulipBot <Sparkles className="tulipbot-sparkle" /></div>
              <div className="tulipbot-header-status">AI Assistant · Always Online</div>
            </div>
          </div>
          <div className="tulipbot-header-actions">
            <button onClick={resetChat} className="tulipbot-action-btn" title="Reset chat" aria-label="Reset chat">
              <RotateCcw size={14} />
            </button>
            <button onClick={() => setOpen(false)} className="tulipbot-action-btn" title="Close" aria-label="Close chat">
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div
          ref={messagesContainerRef}
          className="tulipbot-messages"
          onScroll={handleScroll}
        >
          {messages.map((msg, i) => (
            <div key={i} className={`tulipbot-msg-row ${msg.role === 'user' ? 'tulipbot-msg-row--user' : ''}`}>
              {msg.role === 'assistant' && (
                <div className="tulipbot-msg-avatar">
                  <img src="/logo.png" alt="" />
                </div>
              )}
              <div
                className={`tulipbot-bubble ${msg.role === 'user' ? 'tulipbot-bubble--user' : 'tulipbot-bubble--bot'}`}
                dangerouslySetInnerHTML={{ __html: parseMarkdown(msg.content) }}
              />
            </div>
          ))}

          {loading && (
            <div className="tulipbot-msg-row">
              <div className="tulipbot-msg-avatar">
                <img src="/logo.png" alt="" />
              </div>
              <div className="tulipbot-typing">
                <span /><span /><span />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Scroll to bottom button */}
        {showScrollBtn && (
          <button className="tulipbot-scroll-btn" onClick={scrollToBottom} aria-label="Scroll to bottom">
            <ChevronDown size={16} />
          </button>
        )}

        {/* Quick Prompts */}
        {messages.length <= 1 && !loading && (
          <div className="tulipbot-quick-prompts">
            {QUICK_PROMPTS.map((p) => (
              <button key={p} className="tulipbot-quick-btn" onClick={() => sendMessage(p)}>
                {p}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="tulipbot-input-area">
          <textarea
            ref={inputRef}
            id="tulipbot-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about products, crops, dosage..."
            rows={1}
            className="tulipbot-input"
            disabled={loading}
          />
          <button
            id="tulipbot-send"
            onClick={() => sendMessage()}
            disabled={!input.trim() || loading}
            className="tulipbot-send-btn"
            aria-label="Send message"
          >
            {loading ? <Loader2 size={18} className="tulipbot-spin" /> : <Send size={18} />}
          </button>
        </div>

        <div className="tulipbot-footer">
          Powered by <strong>TulipCrop AI</strong> · Groq Llama
        </div>
      </div>
    </>
  )
}
