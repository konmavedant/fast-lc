"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Eye, EyeOff, Mail, Lock, User, Building, Globe, Ship, Package, Truck } from "lucide-react"

type UserRole = "importer" | "exporter" | "shipment-provider"

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null)
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    companyName: "",
    licenseNumber: "",
    country: "",
    preferredPorts: "",
    typeOfGoods: "",
    targetMarkets: "",
    fleetType: "",
    serviceRegions: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle signup logic here
    console.log("Signup attempt:", { role: selectedRole, ...formData })
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleRoleChange = (role: UserRole) => {
    setSelectedRole(role)
  }

  const renderRoleSpecificFields = () => {
    if (!selectedRole) return null

    switch (selectedRole) {
      case "importer":
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="companyName" className="text-white text-sm font-medium">
                Company Name
              </Label>
              <div className="relative">
                <Building className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  id="companyName"
                  name="companyName"
                  type="text"
                  placeholder="Enter company name"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  className="pl-10 bg-gray-800 border-gray-700 text-white placeholder:text-gray-400 h-12 rounded-lg"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="licenseNumber" className="text-white text-sm font-medium">
                Import License Number
              </Label>
              <Input
                id="licenseNumber"
                name="licenseNumber"
                type="text"
                placeholder="Enter import license number"
                value={formData.licenseNumber}
                onChange={handleInputChange}
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-400 h-12 rounded-lg"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="country" className="text-white text-sm font-medium">
                Country of Operation
              </Label>
              <Input
                id="country"
                name="country"
                type="text"
                placeholder="Enter country"
                value={formData.country}
                onChange={handleInputChange}
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-400 h-12 rounded-lg"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="preferredPorts" className="text-white text-sm font-medium">
                Preferred Ports/Locations
              </Label>
              <Input
                id="preferredPorts"
                name="preferredPorts"
                type="text"
                placeholder="Enter preferred ports or locations"
                value={formData.preferredPorts}
                onChange={handleInputChange}
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-400 h-12 rounded-lg"
                required
              />
            </div>
          </>
        )

      case "exporter":
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="companyName" className="text-white text-sm font-medium">
                Company Name
              </Label>
              <div className="relative">
                <Building className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  id="companyName"
                  name="companyName"
                  type="text"
                  placeholder="Enter company name"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  className="pl-10 bg-gray-800 border-gray-700 text-white placeholder:text-gray-400 h-12 rounded-lg"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="licenseNumber" className="text-white text-sm font-medium">
                Export License Number
              </Label>
              <Input
                id="licenseNumber"
                name="licenseNumber"
                type="text"
                placeholder="Enter export license number"
                value={formData.licenseNumber}
                onChange={handleInputChange}
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-400 h-12 rounded-lg"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="typeOfGoods" className="text-white text-sm font-medium">
                Type of Goods
              </Label>
              <Input
                id="typeOfGoods"
                name="typeOfGoods"
                type="text"
                placeholder="Enter type of goods"
                value={formData.typeOfGoods}
                onChange={handleInputChange}
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-400 h-12 rounded-lg"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="targetMarkets" className="text-white text-sm font-medium">
                Target Markets
              </Label>
              <Input
                id="targetMarkets"
                name="targetMarkets"
                type="text"
                placeholder="Enter target markets"
                value={formData.targetMarkets}
                onChange={handleInputChange}
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-400 h-12 rounded-lg"
                required
              />
            </div>
          </>
        )

      case "shipment-provider":
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="companyName" className="text-white text-sm font-medium">
                Company/Agency Name
              </Label>
              <div className="relative">
                <Building className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  id="companyName"
                  name="companyName"
                  type="text"
                  placeholder="Enter company or agency name"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  className="pl-10 bg-gray-800 border-gray-700 text-white placeholder:text-gray-400 h-12 rounded-lg"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="licenseNumber" className="text-white text-sm font-medium">
                Registration/License Number
              </Label>
              <Input
                id="licenseNumber"
                name="licenseNumber"
                type="text"
                placeholder="Enter registration or license number"
                value={formData.licenseNumber}
                onChange={handleInputChange}
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-400 h-12 rounded-lg"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fleetType" className="text-white text-sm font-medium">
                Fleet Type
              </Label>
              <Select value={formData.fleetType} onValueChange={(value) => setFormData({...formData, fleetType: value})}>
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white h-12 rounded-lg">
                  <SelectValue placeholder="Select fleet type" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700 text-white">
                  <SelectItem value="container-ships">Container Ships</SelectItem>
                  <SelectItem value="bulk-carriers">Bulk Carriers</SelectItem>
                  <SelectItem value="tankers">Tankers</SelectItem>
                  <SelectItem value="general-cargo">General Cargo</SelectItem>
                  <SelectItem value="reefer-ships">Reefer Ships</SelectItem>
                  <SelectItem value="ro-ro-ships">Ro-Ro Ships</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="serviceRegions" className="text-white text-sm font-medium">
                Service Regions 🌍
              </Label>
              <Input
                id="serviceRegions"
                name="serviceRegions"
                type="text"
                placeholder="Enter service regions"
                value={formData.serviceRegions}
                onChange={handleInputChange}
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-400 h-12 rounded-lg"
                required
              />
            </div>
          </>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Section - Signup Form */}
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
            <h1 className="text-4xl font-bold text-white">Create Your Account</h1>
            <p className="text-gray-400 text-lg">
              Join our platform to streamline your imports, exports, or shipments.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Step 1: Role Selection */}
            <div className="space-y-4">
              <Label className="text-white text-lg font-semibold">Tell us who you are:</Label>
              <RadioGroup value={selectedRole || ""} onValueChange={handleRoleChange} className="space-y-3">
                <div className="flex items-center space-x-3 p-4 bg-gray-800 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors">
                  <RadioGroupItem value="importer" id="importer" className="text-green-500" />
                  <Label htmlFor="importer" className="text-white font-medium cursor-pointer flex items-center space-x-2">
                    <Package className="h-5 w-5 text-blue-400" />
                    <span>Importer</span>
                  </Label>
                </div>
                
                <div className="flex items-center space-x-3 p-4 bg-gray-800 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors">
                  <RadioGroupItem value="exporter" id="exporter" className="text-green-500" />
                  <Label htmlFor="exporter" className="text-white font-medium cursor-pointer flex items-center space-x-2">
                    <Ship className="h-5 w-5 text-green-400" />
                    <span>Exporter</span>
                  </Label>
                </div>
                
                <div className="flex items-center space-x-3 p-4 bg-gray-800 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors">
                  <RadioGroupItem value="shipment-provider" id="shipment-provider" className="text-green-500" />
                  <Label htmlFor="shipment-provider" className="text-white font-medium cursor-pointer flex items-center space-x-2">
                    <Truck className="h-5 w-5 text-purple-400" />
                    <span>Shipment Provider</span>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Step 2: Common Fields */}
            {selectedRole && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-white text-sm font-medium">
                    Full Name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input
                      id="fullName"
                      name="fullName"
                      type="text"
                      placeholder="Enter your full name"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="pl-10 bg-gray-800 border-gray-700 text-white placeholder:text-gray-400 h-12 rounded-lg"
                      required
                    />
                  </div>
                </div>
                
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
                      placeholder="Create a password"
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

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-white text-sm font-medium">
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="pl-10 pr-10 bg-gray-800 border-gray-700 text-white placeholder:text-gray-400 h-12 rounded-lg"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-300"
                    >
                      {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                {/* Step 3: Role-Specific Fields */}
                {renderRoleSpecificFields()}

                {/* Create Account Button */}
                <Button 
                  type="submit" 
                  className="w-full h-12 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors"
                >
                  CREATE ACCOUNT
                </Button>
              </>
            )}

            {/* Sign In Link */}
            <div className="text-center text-sm text-gray-400">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-green-400 hover:text-green-300 font-medium transition-colors"
              >
                Sign in here
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
