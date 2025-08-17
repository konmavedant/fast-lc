"use client"

import Link from "next/link"
import type React from "react"

interface ContactFormButtonProps {
  className?: string
  children?: React.ReactNode
}

import { useRouter } from "next/navigation"

export default function ContactFormButton({ className = "", children }: ContactFormButtonProps) {
  const router = useRouter()

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    router.push("/login")
  }

  return (
    <a
      href="/login"
      className={className || "btn-primary"}
      onClick={handleClick}
    >
      {children || "Get Started"}
    </a>
  )
}
