import { CircleDot, Layers, Rocket } from "lucide-react"

const services = [
  {
    id: 1,
    title: "Discovery",
    description: "Share your project details and help us see your vision.",
    icon: CircleDot,
    color: "bg-[#7A7FEE]",
  },
  {
    id: 2,
    title: "Build",
    description: "We craft scalable, reliable solutions using the best tools for the job.",
    icon: Layers,
    color: "bg-[#7A7FEE]",
  },
  {
    id: 3,
    title: "Launch + Iterate",
    description: "Seamlessly integrate, optimize, and expand as your business evolves.",
    icon: Rocket,
    color: "bg-[#7A7FEE]",
  },
]

export default function Services() {
  return (
    <section id="services" className="my-20">
      <h2 className="text-black dark:text-white mb-6">
        How It
        <span className="block text-[#7A7FEE] dark:text-[#7A7FEE]">Works?</span>
      </h2>
      <p className="mb-12 max-w-2xl text-gray-700 dark:text-gray-300">
      We connect global trade with AI and blockchain to make transactions secure and transparent. Our 3-step process ensures faster deals, smarter compliance, and seamless shipments.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
          <div className="bg-[#7A7FEE] w-12 h-12 rounded-full flex items-center justify-center mb-4 shadow-sm">
            <span className="text-white text-xl font-bold">1</span>
          </div>
          <h3 className="text-xl font-semibold mb-2 text-black dark:text-white">Initiate</h3>
          <p className="text-gray-700 dark:text-gray-300">
            Importers and exporters submit trade details securely on our platform.
          </p>
        </div>
        <div className="card p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
          <div className="bg-[#7A7FEE] w-12 h-12 rounded-full flex items-center justify-center mb-4 shadow-sm">
            <span className="text-white text-xl font-bold">2</span>
          </div>
          <h3 className="text-xl font-semibold mb-2 text-black dark:text-white">Verify &amp; Automate</h3>
          <p className="text-gray-700 dark:text-gray-300">
            AI validates documents, while blockchain ensures trust, transparency, and compliance.
          </p>
        </div>
        <div className="card p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
          <div className="bg-[#7A7FEE] w-12 h-12 rounded-full flex items-center justify-center mb-4 shadow-sm">
            <span className="text-white text-xl font-bold">3</span>
          </div>
          <h3 className="text-xl font-semibold mb-2 text-black dark:text-white">Execute &amp; Track</h3>
          <p className="text-gray-700 dark:text-gray-300">
            Smart contracts streamline payments, shipments, and real-time tracking across all parties.
          </p>
        </div>
      </div>
    </section>
  )
}
