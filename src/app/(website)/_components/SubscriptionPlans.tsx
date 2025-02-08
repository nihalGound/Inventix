import { motion } from "framer-motion"
import { Check } from "lucide-react"

const plans = [
  {
    name: "Free",
    price: "$0",
    features: ["Add 1 business", "Sales analytics", "Real-time notifications for low stock"],
    cta: "Get Started",
    highlighted: false,
  },
  {
    name: "Premium",
    price: "$49",
    features: [
      "Unlimited businesses",
      "Real-time notifications for low stock",
      "Advanced sales analytics",
      "Invoice generation",
      "Export sales data to CSV",
    ],
    cta: "Upgrade Now",
    highlighted: true,
  },
]


function PlanCard({ plan, index }:{plan:typeof plans[0], index:number}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.2 }}
      className={`bg-gray-800/50 rounded-lg p-8 shadow-lg transition-all duration-300 transform hover:scale-105 ${
        plan.highlighted ? "border-2 border-purple-500 relative overflow-hidden" : ""
      }`}
    >
      {plan.highlighted && (
        <div className="absolute top-0 right-0 bg-purple-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
          RECOMMENDED
        </div>
      )}
      <h3 className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
        {plan.name}
      </h3>
      <p className="text-4xl font-bold mb-6 text-white">
        {plan.price}
        <span className="text-lg font-normal text-gray-400">/month</span>
      </p>
      <ul className="mb-8 space-y-2">
        {plan.features.map((feature, idx) => (
          <li key={idx} className="flex items-center text-gray-300">
            <Check className="h-5 w-5 text-green-500 mr-2" />
            {feature}
          </li>
        ))}
      </ul>
      <button
        className={`w-full py-2 px-4 rounded-full font-semibold transition-all duration-300 ${
          plan.highlighted
            ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-lg"
            : "bg-gray-700 text-white hover:bg-gray-600"
        }`}
      >
        {plan.cta}
      </button>
    </motion.div>
  )
}

export default function SubscriptionPlans() {
  return (
    <section id="pricing" className="py-20 bg-[#030303]">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl font-bold text-center mb-12"
        >
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
            Choose Your Plan
          </span>
        </motion.h2>
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan, index) => (
            <PlanCard key={index} plan={plan} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}

