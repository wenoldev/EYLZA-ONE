
import React, { useState, useEffect, useRef } from "react"
import { Search, MessageCircle, Phone, FileEdit, ChevronDown, ChevronRight, Send, X, Minimize2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { useStoreStore } from "@/stores/storeStore"
import Loader from "@/components/common/Loader"
import { useNavigate } from "react-router-dom"

// Types
interface Message {
  id: string
  content: string
  sender_type: 'vendor' | 'admin'
  sender_id: string
  sender_name: string
  timestamp: string
  is_read: boolean
}

interface ChatSession {
  id: string
  vendor_id: string
  vendor_name: string
  status: 'active' | 'resolved' | 'pending'
  last_message: string
  last_message_time: string
  unread_count: number
  created_at: string
}

// Chat API functions (replace with your actual API endpoints)
const chatAPI = {
  // Create new chat session
  createSession: async (vendorId: string): Promise<ChatSession> => {
    const response = await fetch('/api/chat/sessions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ vendor_id: vendorId })
    })
    if (!response.ok) throw new Error('Failed to create chat session')
    return response.json()
  },

  // Get vendor's chat session
  getVendorSession: async (vendorId: string): Promise<ChatSession | null> => {
    const response = await fetch(`/api/chat/sessions/vendor/${vendorId}`)
    if (response.status === 404) return null
    if (!response.ok) throw new Error('Failed to get chat session')
    return response.json()
  },

  // Get messages for a session
  getMessages: async (sessionId: string): Promise<Message[]> => {
    const response = await fetch(`/api/chat/sessions/${sessionId}/messages`)
    if (!response.ok) throw new Error('Failed to get messages')
    return response.json()
  },

  // Send message
  sendMessage: async (sessionId: string, content: string, senderType: 'vendor' | 'admin'): Promise<Message> => {
    const response = await fetch(`/api/chat/sessions/${sessionId}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content, sender_type: senderType })
    })
    if (!response.ok) throw new Error('Failed to send message')
    return response.json()
  },

  // Mark messages as read
  markAsRead: async (sessionId: string): Promise<void> => {
    const response = await fetch(`/api/chat/sessions/${sessionId}/mark-read`, {
      method: 'POST'
    })
    if (!response.ok) throw new Error('Failed to mark as read')
  }
}

// Live Chat Component
const LiveChatWidget: React.FC<{
  isOpen: boolean
  onClose: () => void
  onMinimize: () => void
  vendorId: string
  vendorName: string
}> = ({ isOpen, onClose, onMinimize, vendorId, vendorName }) => {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [chatSession, setChatSession] = useState<ChatSession | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Initialize chat session
  useEffect(() => {
    if (!isOpen || !vendorId) return

    const initializeChat = async () => {
      setIsLoading(true)
      try {
        // Try to get existing session first
        let session = await chatAPI.getVendorSession(vendorId)

        // If no session exists, create one
        if (!session) {
          session = await chatAPI.createSession(vendorId)
        }

        setChatSession(session)

        // Load messages
        const sessionMessages = await chatAPI.getMessages(session.id)
        setMessages(sessionMessages)

        // Mark messages as read
        await chatAPI.markAsRead(session.id)

      } catch (error) {
        console.error('Failed to initialize chat:', error)
        toast.error('Failed to load chat. Please try again.')
      } finally {
        setIsLoading(false)
      }
    }

    initializeChat()
  }, [isOpen, vendorId])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !chatSession || isSending) return

    setIsSending(true)
    try {
      const message = await chatAPI.sendMessage(chatSession.id, newMessage.trim(), 'vendor')
      setMessages(prev => [...prev, message])
      setNewMessage("")
      toast.success("Message sent")
    } catch (error) {
      console.error('Failed to send message:', error)
      toast.error('Failed to send message. Please try again.')
    } finally {
      setIsSending(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed bottom-4 right-4 w-96 h-[500px] bg-white rounded-lg shadow-2xl border z-50 flex flex-col">
      {/* Header */}
      <div className="bg-blue-600 text-white p-4 rounded-t-lg flex items-center justify-between">
        <div>
          <h3 className="font-semibold">Live Chat Support</h3>
          <p className="text-xs text-blue-100">We're here to help</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onMinimize}
            className="text-white hover:text-gray-200 p-1"
            title="Minimize"
          >
            <Minimize2 className="h-4 w-4" />
          </button>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 p-1"
            title="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            {/* Welcome message */}
            <div className="bg-blue-100 rounded-lg p-3 mb-4">
              <p className="text-sm text-blue-800">
                👋 Hello {vendorName}! How can we help you today?
              </p>
            </div>

            {/* Messages */}
            {messages.map((message) => (
              <div
                key={message.id}
                className={`mb-4 flex ${message.sender_type === 'vendor' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${message.sender_type === 'vendor'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white border shadow-sm'
                    }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <p className={`text-xs mt-1 ${message.sender_type === 'vendor' ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}

            {/* Typing indicator when sending */}
            {isSending && (
              <div className="flex justify-end mb-4">
                <div className="bg-blue-600 text-white rounded-lg p-3 max-w-[80%]">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 border-t bg-white rounded-b-lg">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <Input
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            disabled={isSending || isLoading}
            className="flex-1"
          />
          <Button
            type="submit"
            size="sm"
            disabled={!newMessage.trim() || isSending || isLoading}
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
        <p className="text-xs text-gray-500 mt-2">
          Press Enter to send
        </p>
      </div>
    </div>
  )
}

// Main Help Page Component
export function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [isChatMinimized, setIsChatMinimized] = useState(false)
  const [hasInitialized, setHasInitialized] = useState(false)
  const navigate = useNavigate()

  const { stores } = useStoreStore()
  const currentStore = stores?.[0]

  // Initialize component
  useEffect(() => {
    if (!hasInitialized) {
      setHasInitialized(true)
    }
  }, [hasInitialized])

  const faqs = [
    {
      id: 1,
      question: "How do I set up my store?",
      answer: "To set up your store, navigate to the store setup wizard from your dashboard. Follow the 3-step process to configure your store details, address, and URL. Make sure to complete all required fields for the best customer experience.",
      category: "Setup"
    },
    {
      id: 2,
      question: "How do I add products to my store?",
      answer: "Go to your store dashboard and click on 'Add Product'. Fill in the product details including name, description, pricing, and images. You can also set inventory levels, categories, and product variants. Don't forget to publish your product when ready.",
      category: "Products"
    },
    {
      id: 3,
      question: "How do I manage orders?",
      answer: "Access your orders from the main dashboard under the 'Orders' section. You can view order details, update order status, process refunds, and communicate with customers. Automated notifications are sent to customers when order status changes.",
      category: "Orders"
    },
    {
      id: 4,
      question: "How do I set up payments?",
      answer: "Configure payment methods in your store settings under 'Payment Configuration'. We support various payment gateways including PayPal, Stripe, Square, and bank transfers. Each gateway may require additional verification steps.",
      category: "Payments"
    },
    {
      id: 5,
      question: "How do I customize my store appearance?",
      answer: "Use the store customization tools in your dashboard to change themes, colors, layouts, and add your branding elements. You can upload your logo, set custom colors, and choose from various layout options to match your brand identity.",
      category: "Design"
    },
    {
      id: 6,
      question: "How do I track my store analytics?",
      answer: "Visit the Analytics section in your dashboard to view detailed reports on sales, traffic, customer behavior, and product performance. You can filter data by date ranges and export reports for further analysis.",
      category: "Analytics"
    },
    {
      id: 7,
      question: "What are the supported file formats for product images?",
      answer: "We support JPEG, PNG, and WebP formats. Images should be at least 800x800 pixels for best quality. Maximum file size is 5MB per image. We recommend using high-quality images to showcase your products effectively.",
      category: "Products"
    },
    {
      id: 8,
      question: "How do I handle returns and refunds?",
      answer: "Access the Returns section in your dashboard to manage return requests. You can approve or deny returns, issue refunds, and track returned items. Set up your return policy in store settings to manage customer expectations.",
      category: "Orders"
    }
  ]

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const toggleFaq = (id: number) => {
    setExpandedFaq(expandedFaq === id ? null : id)
  }

  const handleOpenChat = () => {
    setIsChatOpen(true)
    setIsChatMinimized(false)
  }

  const handleCloseChat = () => {
    setIsChatOpen(false)
    setIsChatMinimized(false)
  }

  const handleMinimizeChat = () => {
    setIsChatMinimized(true)
    setIsChatOpen(false)
  }

  // Show loader during initialization
  if (!hasInitialized) {
    return <Loader />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Help & Support Center</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Find answers to common questions, access helpful resources, or get in touch with our support team
          </p>
        </div>

        {/* Search */}
        <div className="mb-10">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              placeholder="Search help articles, FAQs, and guides..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 text-base rounded-xl border-2 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Contact Options */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card
            className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 border-2 hover:border-blue-200"
            onClick={handleOpenChat}
          >
            <CardHeader className="text-center pb-4">
              <div className="relative">
                <MessageCircle className="h-12 w-12 text-blue-600 mx-auto mb-3" />
                <Badge className="absolute -top-1 -right-1 bg-green-500 text-white text-xs px-2 py-1">
                  Online
                </Badge>
              </div>
              <CardTitle className="text-xl text-gray-900">Live Chat</CardTitle>
              <CardDescription className="text-gray-600">
                Get instant help from our support team. Average response time: 2 minutes
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button variant="outline" className="w-full">
                Start Chat
              </Button>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 border-2 hover:border-green-200">
            <CardHeader className="text-center pb-4">
              <Phone className="h-12 w-12 text-green-600 mx-auto mb-3" />
              <CardTitle className="text-xl text-gray-900">Phone Support</CardTitle>
              <CardDescription className="text-gray-600">
                Call our support hotline for immediate assistance
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="font-semibold text-green-600 mb-2">+1 (555) 123-4567</p>
              <p className="text-sm text-gray-500">Mon-Fri: 9 AM - 6 PM EST</p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 border-2 hover:border-purple-200">
            <CardHeader className="text-center pb-4">
              <FileEdit className="h-12 w-12 text-purple-600 mx-auto mb-3" />
              <CardTitle className="text-xl text-gray-900">Support Tickets</CardTitle>
              <CardDescription className="text-gray-600">
                Submit a formal support ticket and track its progress in your dashboard
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => navigate('/dashboard/tickets')}
              >
                Submit Ticket
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Section */}
        <Card className="shadow-lg">
          <CardHeader className="border-b bg-gradient-to-r from-blue-50 to-purple-50">
            <CardTitle className="text-2xl text-gray-900">Frequently Asked Questions</CardTitle>
            <CardDescription className="text-gray-600">
              Quick answers to the most common questions from our users
            </CardDescription>
            {searchQuery && (
              <p className="text-sm text-blue-600 mt-2">
                Found {filteredFaqs.length} result{filteredFaqs.length !== 1 ? 's' : ''} for "{searchQuery}"
              </p>
            )}
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-200">
              {filteredFaqs.length > 0 ? (
                filteredFaqs.map((faq) => (
                  <div key={faq.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <button
                      onClick={() => toggleFaq(faq.id)}
                      className="flex items-center justify-between w-full text-left group"
                    >
                      <div className="flex items-center gap-3">
                        <Badge variant="secondary" className="text-xs">
                          {faq.category}
                        </Badge>
                        <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {faq.question}
                        </h3>
                      </div>
                      <div className="flex items-center">
                        {expandedFaq === faq.id ? (
                          <ChevronDown className="h-5 w-5 text-gray-500 group-hover:text-blue-600 transition-colors" />
                        ) : (
                          <ChevronRight className="h-5 w-5 text-gray-500 group-hover:text-blue-600 transition-colors" />
                        )}
                      </div>
                    </button>
                    {expandedFaq === faq.id && (
                      <div className="mt-4 ml-20 pr-8">
                        <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="p-12 text-center">
                  <div className="text-gray-400 mb-4">
                    <Search className="h-12 w-12 mx-auto" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
                  <p className="text-gray-600">
                    Try searching with different keywords or{" "}
                    <button
                      onClick={handleOpenChat}
                      className="text-blue-600 hover:underline font-medium"
                    >
                      chat with our support team
                    </button>
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Additional Resources */}
        <div className="mt-12 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Additional Resources</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button variant="outline" className="h-12">
              📖 User Guide
            </Button>
            <Button variant="outline" className="h-12">
              🎥 Video Tutorials
            </Button>
            <Button variant="outline" className="h-12">
              💡 Best Practices
            </Button>
            <Button variant="outline" className="h-12">
              🔧 Developer API
            </Button>
          </div>
        </div>
      </div>

      {/* Live Chat Widget */}
      {currentStore && (
        <LiveChatWidget
          isOpen={isChatOpen}
          onClose={handleCloseChat}
          onMinimize={handleMinimizeChat}
          vendorId={currentStore.id}
          vendorName={currentStore.name || 'User'}
        />
      )}

      {/* Minimized Chat Button */}
      {isChatMinimized && (
        <button
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-4 right-4 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors z-50"
        >
          <MessageCircle className="h-6 w-6" />
        </button>
      )}
    </div>
  )
}