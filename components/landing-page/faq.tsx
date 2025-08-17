"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

const faqs = [
  {
    id: 1,
    question: "What can I expect when we work together?",
    answer:
      "We start with a discovery call to understand your needs, then provide a detailed proposal with timeline and cost estimates. Once approved, we begin development with regular updates and feedback sessions.",
  },
  {
    id: 2,
    question: "How long do projects take to build?",
    answer:
      "Project timelines vary based on complexity. Simple websites might take 2-4 weeks, while complex platforms can take 3-6 months. We provide detailed timelines during the proposal phase.",
  },
  {
    id: 3,
    question: "What tools do you use to build?",
    answer:
      "We use modern frameworks like React, Next.js, and Node.js, along with AI tools and cloud services. Our stack is tailored to each project's specific requirements.",
  },
  {
    id: 4,
    question: "How much does a typical project cost?",
    answer:
      "Project costs vary widely based on requirements. Simple websites start around $5,000, while complex platforms can range from $25,000 to $100,000+. We provide detailed quotes after our discovery process.",
  },
  {
    id: 5,
    question: "How do you manage payments?",
    answer:
      "We typically work with a 50% upfront deposit and the remaining 50% upon project completion. For larger projects, we may establish milestone-based payment schedules.",
  },
  {
    id: 6,
    question: "Can you manage my app's technical support with users?",
    answer:
      "Yes, we offer ongoing technical support and maintenance packages. These can include user support, bug fixes, feature updates, and performance monitoring.",
  },
]

export default function Faq() {
  const [openItem, setOpenItem] = useState<number | null>(null)

  const toggleItem = (id: number) => {
    setOpenItem(openItem === id ? null : id)
  }

  return (
    <section id="faq" className="my-20">
      <div className="card p-8 md:p-10 shadow-lg">
        <h2 className="text-black dark:text-white mb-6">
          Frequently Asked
          <span className="block text-[#7A7FEE] dark:text-[#7A7FEE]">Questions</span>
        </h2>
        <p className="mb-8 max-w-2xl text-gray-700 dark:text-gray-300">
          Have questions about our services? Find answers to the most common questions.
        </p>

        <div className="space-y-4">
          {/* FAQ 1 */}
          <div className="border-b pb-4 border-gray-300 dark:border-gray-700">
            <button
              onClick={() => toggleItem(1)}
              className="flex justify-between items-center w-full text-left py-2 font-medium text-black dark:text-white hover:text-[#7A7FEE] dark:hover:text-[#7A7FEE] transition-colors"
              aria-expanded={openItem === 1}
              aria-controls="faq-answer-1"
            >
              <span className="font-medium">What is Fast LC?</span>
              <ChevronDown
                className={`w-5 h-5 transition-transform ${openItem === 1 ? "rotate-180 text-[#7A7FEE]" : ""}`}
              />
            </button>
            {openItem === 1 && (
              <div id="faq-answer-1" className="mt-2 text-gray-700 dark:text-gray-300">
                Fast LC is a blockchain-powered platform designed to make trade finance faster, smarter, and more secure. It streamlines the entire process of issuing, managing, and settling Letters of Credit (LCs) by leveraging blockchain technology and smart contracts. This ensures that all parties—importers, exporters, and banks—can transact with greater trust, transparency, and efficiency.
              </div>
            )}
          </div>
          {/* FAQ 2 */}
          <div className="border-b pb-4 border-gray-300 dark:border-gray-700">
            <button
              onClick={() => toggleItem(2)}
              className="flex justify-between items-center w-full text-left py-2 font-medium text-black dark:text-white hover:text-[#7A7FEE] dark:hover:text-[#7A7FEE] transition-colors"
              aria-expanded={openItem === 2}
              aria-controls="faq-answer-2"
            >
              <span className="font-medium">How does it save time?</span>
              <ChevronDown
                className={`w-5 h-5 transition-transform ${openItem === 2 ? "rotate-180 text-[#7A7FEE]" : ""}`}
              />
            </button>
            {openItem === 2 && (
              <div id="faq-answer-2" className="mt-2 text-gray-700 dark:text-gray-300">
                Fast LC digitizes and automates every step of the trade finance process—from LC issuance and document verification to shipment tracking and settlement. By eliminating manual paperwork and automating compliance checks, transactions that once took weeks can now be completed in just days. This means faster access to working capital and quicker delivery of goods.
              </div>
            )}
          </div>
          {/* FAQ 3 */}
          <div className="border-b pb-4 border-gray-300 dark:border-gray-700">
            <button
              onClick={() => toggleItem(3)}
              className="flex justify-between items-center w-full text-left py-2 font-medium text-black dark:text-white hover:text-[#7A7FEE] dark:hover:text-[#7A7FEE] transition-colors"
              aria-expanded={openItem === 3}
              aria-controls="faq-answer-3"
            >
              <span className="font-medium">Is it secure?</span>
              <ChevronDown
                className={`w-5 h-5 transition-transform ${openItem === 3 ? "rotate-180 text-[#7A7FEE]" : ""}`}
              />
            </button>
            {openItem === 3 && (
              <div id="faq-answer-3" className="mt-2 text-gray-700 dark:text-gray-300">
                Yes, Fast LC is built on blockchain technology and uses smart contracts to automate and secure transactions. All operations are tamper-proof and fully auditable, providing transparency and trust for every party involved. Sensitive data is encrypted, and the decentralized nature of blockchain ensures that records cannot be altered or deleted.
              </div>
            )}
          </div>
          {/* FAQ 4 */}
          <div className="border-b pb-4 border-gray-300 dark:border-gray-700">
            <button
              onClick={() => toggleItem(4)}
              className="flex justify-between items-center w-full text-left py-2 font-medium text-black dark:text-white hover:text-[#7A7FEE] dark:hover:text-[#7A7FEE] transition-colors"
              aria-expanded={openItem === 4}
              aria-controls="faq-answer-4"
            >
              <span className="font-medium">Can banks and SMEs use it?</span>
              <ChevronDown
                className={`w-5 h-5 transition-transform ${openItem === 4 ? "rotate-180 text-[#7A7FEE]" : ""}`}
              />
            </button>
            {openItem === 4 && (
              <div id="faq-answer-4" className="mt-2 text-gray-700 dark:text-gray-300">
                Absolutely. Fast LC is designed for both large enterprises and small-to-medium businesses (SMEs) engaged in global trade. Banks, exporters, importers, and logistics providers can all use the platform to simplify their trade finance operations, reduce risk, and improve efficiency. Our flexible architecture supports a wide range of business needs and regulatory requirements.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
