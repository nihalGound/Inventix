import { motion } from "framer-motion"
import React from "react"
import { useInView } from "react-intersection-observer"

const features = [
  {
    title: "Real-time Tracking",
    description: "Monitor your inventory levels in real-time, ensuring you never run out of stock or overstock.",
    icon: "📊",
  },
  {
    title: "Smart Analytics",
    description: "Gain valuable insights into your sales trends and inventory turnover with advanced analytics.",
    icon: "📈",
  },
  {
    title: "Automated Reordering",
    description: "Set up automatic reorder points to maintain optimal stock levels without manual intervention.",
    icon: "🔄",
  },
  {
    title: "Multi-location Support",
    description: "Manage inventory across multiple warehouses or stores from a single, unified dashboard.",
    icon: "🏢",
  },
]

type Props = {
    title: string,
    description: string,
    icon: React.ReactNode,
    index: number
}

function FeatureCard({ title, description, icon, index }:Props) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: index * 0.2 }}
      className="bg-gray-800/50 rounded-lg p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
    >
      <motion.div
        initial={{ scale: 0.5, rotate: -10 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        className="text-4xl mb-4"
      >
        {icon}
      </motion.div>
      <h3 className="text-xl font-semibold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
        {title}
      </h3>
      <p className="text-gray-400">{description}</p>
    </motion.div>
  )
}

export default function Features() {
  return (
    <section id="features" className="py-20 bg-[#030303]">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl font-bold text-center mb-12"
        >
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
            Powerful Features
          </span>
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}

