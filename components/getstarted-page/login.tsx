"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Mail, Lock } from "lucide-react"

// Default user credentials
const DEFAULT_USERS = {
  "importer@gmail.com": { password: "123456", role: "importer", dashboard: "/importer-dashboard" },
  "exporter@gmail.com": { password: "123456", role: "exporter", dashboard: "/exporter-dashboard" },
  "shipment@gmail.com": { password: "123456", role: "shipment", dashboard: "/shipment-dashboard" },
  "admin@gmail.com": { password: "admin@123", role: "admin", dashboard: "/admin-dashboard" }
}

export default function Login() {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      // Check if user exists and credentials match
      const user = DEFAULT_USERS[formData.email as keyof typeof DEFAULT_USERS]
      
      if (!user) {
        setError("User not found. Please check your email.")
        setIsLoading(false)
        return
      }

      if (user.password !== formData.password) {
        setError("Invalid password. Please try again.")
        setIsLoading(false)
        return
      }

      // Success - navigate to respective dashboard
      console.log(`Login successful for ${user.role} user`)
      
      // Simulate a small delay for better UX
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Navigate to the appropriate dashboard
      router.push(user.dashboard)
      
    } catch (error) {
      setError("An error occurred. Please try again.")
      console.error("Login error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
    // Clear error when user starts typing
    if (error) setError("")
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Section - Login Form */}
      <div className="w-2/3 bg-gray-900 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          {/* Logo */}
          <div className="flex justify-center">
            <img
              src="/fast-lc.png"
              alt="Fast LC Logo"
              className="w-30 h-30 object-contain"
            />
          </div>

          {/* Heading */}
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold text-white">Welcome Back!</h1>
            <p className="text-gray-400 text-lg">
              Login to access your dashboard and manage your shipments.
            </p>
          </div>


          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-white text-sm font-medium">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="pl-10 bg-gray-800 border-gray-700 text-white placeholder:text-gray-400 h-12 rounded-lg"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-white text-sm font-medium">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="pl-10 pr-10 bg-gray-800 border-gray-700 text-white placeholder:text-gray-400 h-12 rounded-lg"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-300"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            

            {/* Login Button */}
            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full h-12 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Signing in..." : "LOGIN"}
            </Button>

            {/* Sign Up Link */}
            <div className="text-center text-sm text-gray-400">
              Don't have an account?{" "}
              <Link
                href="/signup"
                className="text-green-400 hover:text-green-300 font-medium transition-colors"
              >
                Sign up here
              </Link>
            </div>
          </form>
        </div>
      </div>

      {/* Right Section - Image */}
      <div className="w-1/3 hidden md:flex items-center justify-center bg-gray-800">
        <img
          src="https://images.ctfassets.net/jg6lo9a2ukvr/27nB85zQBKXGOyMzsGpH6r/0fc7d99bc7a53a90002614480e16f4c9/AVAX-TokenLaunch-Blog-Header.png"
          alt="Login Illustration"
          className="object-cover w-full h-full"
          style={{ maxHeight: "100vh" }}
        />
      </div>
    </div>
  )
}
