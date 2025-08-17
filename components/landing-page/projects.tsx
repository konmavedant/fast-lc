"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowUpRight } from "lucide-react"
import ProjectPopup from "../portfolio/project-popup"
import { fetchPortfolioData } from "@/utils/csv-parser"
import type { PortfolioItem } from "@/utils/csv-parser"

export default function Projects() {
  const [selectedProject, setSelectedProject] = useState<PortfolioItem | null>(null)
  const [projects, setProjects] = useState<PortfolioItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Fetch portfolio data on component mount
  useEffect(() => {
    async function loadProjects() {
      try {
        const data = await fetchPortfolioData()
        // Get the first 3 projects for the landing page
        setProjects(data.slice(0, 3))
      } catch (error) {
        console.error("Error loading projects:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadProjects()
  }, [])

  const openProjectPopup = (project: PortfolioItem) => {
    setSelectedProject(project)
  }

  const closeProjectPopup = () => {
    setSelectedProject(null)
  }

  return (
    <section id="projects" className="my-20">
      <h2 className="text-black dark:text-white mb-6">
        Why
        <span className="block text-[#7A7FEE] dark:text-[#7A7FEE]">Fast LC?</span>
      </h2>
      <p className="mb-12 max-w-2xl text-gray-700 dark:text-gray-300">
      We build next-gen trade finance tools that cut through complexity. From exporters to importers to banks, Fast LC ensures that every transaction is trustless, transparent, and instant.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            title: "Blockchain-backed security",
            description:
              "Every transaction is cryptographically secured and fully auditable, ensuring trust and transparency for all parties.",
            imageUrl: "https://agiletech.vn/wp-content/uploads/2019/01/Agiletech-_-blockchain-_-intergrate-_-IOT.jpg",
          },
          {
            title: "AI-powered compliance & risk checks",
            description:
              "Automated, intelligent checks for KYC, AML, and trade compliance—reducing manual work and minimizing risk.",
            imageUrl: "https://assets.channelinsider.com/uploads/2024/09/ci_20240923-onetrust-compliance-automation.png",
          },
          {
            title: "Faster settlements & reduced costs",
            description:
              "Smart contracts automate settlements, cutting out delays and unnecessary fees for a seamless trade experience.",
            imageUrl: "https://www.orioninc.com/wp-content/uploads/2022/09/Hero_Data_Virtualization_257957753.jpg",
          },
        ].map((feature, idx) => (
          <div
            key={feature.title}
            className="card overflow-hidden shadow-lg transform transition-transform duration-300 hover:scale-[1.02] cursor-pointer"
          >
            <div className="flex items-center justify-center p-0 bg-gray-100 dark:bg-gray-800 relative" style={{ height: "180px" }}>
              <div className="relative w-full h-full">
                <Image
                  src={feature.imageUrl}
                  alt={feature.title}
                  fill
                  className="object-cover w-full h-full rounded-t-md"
                  sizes="(max-width: 768px) 100vw, 33vw"
                  priority={idx === 0}
                />
              </div>
            </div>
            <div className="p-4 md:p-6">
              <h3 className="text-xl font-semibold text-black dark:text-white">{feature.title}</h3>
              <p className="text-gray-700 dark:text-gray-300 text-sm mt-1 mb-4">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>

      

      {/* Project Popup */}
      <ProjectPopup project={selectedProject} onClose={closeProjectPopup} />
    </section>
  )
}
