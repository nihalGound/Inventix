"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

const chatbotResponses = [
  "Our inventory management system helps businesses like yours streamline operations and increase efficiency.",
  "You can track stock levels in real-time, reducing the risk of stockouts or overstocking.",
  "Our analytics tools provide valuable insights into sales trends and inventory turnover.",
  "The system supports multiple locations, perfect for businesses with multiple warehouses or stores.",
  "Automated reordering ensures you always have the right amount of stock without manual intervention.",
  "Would you like to schedule a demo to see how our system can benefit your specific business needs?",
]

export default function Chatbot({ isOpen, onClose }: {isOpen:boolean, onClose:()=>void}) {
  const [messages, setMessages] = useState([
    { text: "Hello! How can I help you understand our inventory management system?", isBot: true },
  ])
  const [input, setInput] = useState("")

  const handleSend = () => {
    if (input.trim()) {
      setMessages([...messages, { text: input, isBot: false }])
      setInput("")
      setTimeout(() => {
        const botResponse = chatbotResponses[Math.floor(Math.random() * chatbotResponses.length)]
        setMessages((prev) => [...prev, { text: botResponse, isBot: true }])
      }, 1000)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-20 right-4 w-80 bg-white rounded-lg shadow-xl overflow-hidden z-10"
        >
          <div className="bg-blue-600 text-white p-4 flex justify-between items-center">
            <h3 className="font-semibold">Inventory Assistant</h3>
            <button onClick={onClose} className="text-white hover:text-gray-200">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="h-80 overflow-y-auto p-4 bg-gray-100">
            {messages.map((message, index) => (
              <div key={index} className={`mb-4 ${message.isBot ? "text-left" : "text-right"}`}>
                <span
                  className={`inline-block p-2 rounded-lg ${message.isBot ? "bg-white text-gray-800" : "bg-blue-600 text-white"}`}
                >
                  {message.text}
                </span>
              </div>
            ))}
          </div>
          <div className="p-4 bg-white">
            <div className="flex">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-grow mr-2 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleSend}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-300"
              >
                Send
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

