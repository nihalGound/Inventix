"use client"

import { useState } from "react"
import Hero from "./_components/Hero"
import Features from "./_components/Features"
import SubscriptionPlans from "./_components/SubscriptionPlans"
import Chatbot from "./_components/Chatbot"

export default function LandingPage() {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false)

  return (
    <div className="bg-[#030303] text-white min-h-screen">
      <Hero />
      <Features />
      <SubscriptionPlans />
      <Chatbot isOpen={isChatbotOpen} onClose={() => setIsChatbotOpen(false)} />
      <button
        onClick={() => setIsChatbotOpen(true)}
        className="fixed bottom-4 right-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full p-4 shadow-lg transition-all duration-300 transform hover:scale-110"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
          />
        </svg>
      </button>
    </div>
  )
}

