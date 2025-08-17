"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Download, FileText, Building2, User, Globe, Banknote, Package, Ship, CheckCircle, ArrowLeft } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import jsPDF from "jspdf"
import { useLCStore, LCFormData } from "@/lib/store"
import { useToast } from "@/hooks/use-toast"

const initialFormData: LCFormData = {
  applicantName: "",
  applicantAddress: "",
  contactPerson: "",
  contactEmail: "",
  contactPhone: "",
  beneficiaryName: "",
  beneficiaryAddress: "",
  beneficiaryCountry: "",
  lcType: "",
  lcAmount: "",
  currency: "",
  expiryDate: undefined,
  placeOfExpiry: "",
  applicantBankName: "",
  beneficiaryBankName: "",
  swiftCode: "",
  descriptionOfGoods: "",
  quantity: "",
  unit: "",
  incoterms: "",
  portOfLoading: "",
  portOfDischarge: "",
  latestShipmentDate: undefined
}

export default function LCForm() {
  const [formData, setFormData] = useState<LCFormData>(initialFormData)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  
  const { createLC, setCurrentUser } = useLCStore()
  const { toast } = useToast()

  const handleInputChange = (field: keyof LCFormData, value: string | Date | undefined) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const generatePDF = () => {
    const doc = new jsPDF()
    
    // Set font and styling
    doc.setFontSize(20)
    doc.setFont("helvetica", "bold")
    doc.text("LETTER OF CREDIT", 105, 20, { align: "center" })
    
    doc.setFontSize(12)
    doc.setFont("helvetica", "normal")
    
    let yPosition = 40
    
    // Applicant Details
    doc.setFont("helvetica", "bold")
    doc.text("1. APPLICANT (IMPORTER) DETAILS", 20, yPosition)
    yPosition += 10
    
    doc.setFont("helvetica", "normal")
    doc.text(`Company Name: ${formData.applicantName}`, 20, yPosition)
    yPosition += 7
    doc.text(`Address: ${formData.applicantAddress}`, 20, yPosition)
    yPosition += 7
    doc.text(`Contact Person: ${formData.contactPerson}`, 20, yPosition)
    yPosition += 7
    doc.text(`Email: ${formData.contactEmail}`, 20, yPosition)
    yPosition += 7
    doc.text(`Phone: ${formData.contactPhone}`, 20, yPosition)
    yPosition += 15
    
    // Beneficiary Details
    doc.setFont("helvetica", "bold")
    doc.text("2. BENEFICIARY (EXPORTER) DETAILS", 20, yPosition)
    yPosition += 10
    
    doc.setFont("helvetica", "normal")
    doc.text(`Company Name: ${formData.beneficiaryName}`, 20, yPosition)
    yPosition += 7
    doc.text(`Address: ${formData.beneficiaryAddress}`, 20, yPosition)
    yPosition += 7
    doc.text(`Country: ${formData.beneficiaryCountry}`, 20, yPosition)
    yPosition += 15
    
    // LC Details
    doc.setFont("helvetica", "bold")
    doc.text("3. LETTER OF CREDIT DETAILS", 20, yPosition)
    yPosition += 10
    
    doc.setFont("helvetica", "normal")
    doc.text(`LC Type: ${formData.lcType}`, 20, yPosition)
    yPosition += 7
    doc.text(`Amount: ${formData.currency} ${formData.lcAmount}`, 20, yPosition)
    yPosition += 7
    doc.text(`Expiry Date: ${formData.expiryDate ? format(formData.expiryDate, 'dd/MM/yyyy') : 'Not specified'}`, 20, yPosition)
    yPosition += 7
    doc.text(`Place of Expiry: ${formData.placeOfExpiry}`, 20, yPosition)
    yPosition += 15
    
    // Banking Details
    doc.setFont("helvetica", "bold")
    doc.text("4. BANKING DETAILS", 20, yPosition)
    yPosition += 10
    
    doc.setFont("helvetica", "normal")
    doc.text(`Applicant's Bank: ${formData.applicantBankName}`, 20, yPosition)
    yPosition += 7
    doc.text(`Beneficiary's Bank: ${formData.beneficiaryBankName}`, 20, yPosition)
    yPosition += 7
    doc.text(`Swift Code: ${formData.swiftCode || 'Not specified'}`, 20, yPosition)
    yPosition += 15
    
    // Trade Details
    doc.setFont("helvetica", "bold")
    doc.text("5. TRADE DETAILS", 20, yPosition)
    yPosition += 10
    
    doc.setFont("helvetica", "normal")
    doc.text(`Description of Goods: ${formData.descriptionOfGoods}`, 20, yPosition)
    yPosition += 7
    doc.text(`Quantity: ${formData.quantity} ${formData.unit}`, 20, yPosition)
    yPosition += 7
    doc.text(`Incoterms: ${formData.incoterms}`, 20, yPosition)
    yPosition += 7
    doc.text(`Port of Loading: ${formData.portOfLoading}`, 20, yPosition)
    yPosition += 7
    doc.text(`Port of Discharge: ${formData.portOfDischarge}`, 20, yPosition)
    yPosition += 7
    doc.text(`Latest Shipment Date: ${formData.latestShipmentDate ? format(formData.latestShipmentDate, 'dd/MM/yyyy') : 'Not specified'}`, 20, yPosition)
    
    // Footer
    doc.setFontSize(10)
    doc.text(`Generated on: ${format(new Date(), 'dd/MM/yyyy HH:mm')}`, 20, 280)
    
    // Save the PDF
    doc.save(`LC-${formData.applicantName.replace(/\s+/g, '-')}-${format(new Date(), 'yyyyMMdd')}.pdf`)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      // Set current user (in a real app, this would come from auth)
      setCurrentUser("importer-user-001")
      
      // Create LC in store
      const newLC = createLC(formData, "importer-user-001")
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      setIsSubmitting(false)
      setIsSuccess(true)
      
      // Generate PDF after successful submission
      generatePDF()
      
      // Show success toast
      toast({
        title: "LC Created Successfully!",
        description: `Letter of Credit ${newLC.reference} has been created and is now awaiting exporter documents.`,
      })
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setIsSuccess(false)
        setFormData(initialFormData)
      }, 3000)
      
    } catch (error) {
      setIsSubmitting(false)
      toast({
        title: "Error Creating LC",
        description: "There was an error creating the Letter of Credit. Please try again.",
        variant: "destructive"
      })
    }
  }

  const isFormValid = () => {
    return (
      formData.applicantName &&
      formData.applicantAddress &&
      formData.contactPerson &&
      formData.contactEmail &&
      formData.contactPhone &&
      formData.beneficiaryName &&
      formData.beneficiaryAddress &&
      formData.beneficiaryCountry &&
      formData.lcType &&
      formData.lcAmount &&
      formData.currency &&
      formData.expiryDate &&
      formData.placeOfExpiry &&
      formData.applicantBankName &&
      formData.beneficiaryBankName &&
      formData.descriptionOfGoods &&
      formData.quantity &&
      formData.unit &&
      formData.incoterms &&
      formData.portOfLoading &&
      formData.portOfDischarge &&
      formData.latestShipmentDate
    )
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">LC Created Successfully!</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Your Letter of Credit has been created and the PDF has been downloaded.
            </p>
            <p className="text-sm text-gray-500 mb-4">
              The LC is now in the system and awaiting exporter documents.
            </p>
            <Button onClick={() => window.location.reload()} className="w-full">
              Create Another LC
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-between mb-6">
            <Button 
              variant="outline" 
              onClick={() => window.history.back()}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
            <div className="flex-1"></div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Create Letter of Credit</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Fill in the details below to create a new Letter of Credit
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Applicant (Importer) Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Applicant (Importer) Details
              </CardTitle>
              <CardDescription>Your company and contact information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="applicantName">Company Name *</Label>
                  <Input
                    id="applicantName"
                    value={formData.applicantName}
                    onChange={(e) => handleInputChange("applicantName", e.target.value)}
                    placeholder="Enter company name"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="contactPerson">Contact Person *</Label>
                  <Input
                    id="contactPerson"
                    value={formData.contactPerson}
                    onChange={(e) => handleInputChange("contactPerson", e.target.value)}
                    placeholder="Enter contact person name"
                    required
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="applicantAddress">Company Address *</Label>
                <Textarea
                  id="applicantAddress"
                  value={formData.applicantAddress}
                  onChange={(e) => handleInputChange("applicantAddress", e.target.value)}
                  placeholder="Enter complete company address"
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="contactEmail">Email *</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={formData.contactEmail}
                    onChange={(e) => handleInputChange("contactEmail", e.target.value)}
                    placeholder="Enter email address"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="contactPhone">Phone *</Label>
                  <Input
                    id="contactPhone"
                    value={formData.contactPhone}
                    onChange={(e) => handleInputChange("contactPhone", e.target.value)}
                    placeholder="Enter phone number"
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Beneficiary (Exporter) Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Beneficiary (Exporter) Details
              </CardTitle>
              <CardDescription>Exporter company information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="beneficiaryName">Company Name *</Label>
                  <Input
                    id="beneficiaryName"
                    value={formData.beneficiaryName}
                    onChange={(e) => handleInputChange("beneficiaryName", e.target.value)}
                    placeholder="Enter exporter company name"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="beneficiaryCountry">Country *</Label>
                  <Select value={formData.beneficiaryCountry} onValueChange={(value) => handleInputChange("beneficiaryCountry", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="China">China</SelectItem>
                      <SelectItem value="Germany">Germany</SelectItem>
                      <SelectItem value="Japan">Japan</SelectItem>
                      <SelectItem value="India">India</SelectItem>
                      <SelectItem value="Brazil">Brazil</SelectItem>
                      <SelectItem value="Mexico">Mexico</SelectItem>
                      <SelectItem value="South Korea">South Korea</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label htmlFor="beneficiaryAddress">Company Address *</Label>
                <Textarea
                  id="beneficiaryAddress"
                  value={formData.beneficiaryAddress}
                  onChange={(e) => handleInputChange("beneficiaryAddress", e.target.value)}
                  placeholder="Enter exporter company address"
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* LC Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Letter of Credit Details
              </CardTitle>
              <CardDescription>Core LC specifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="lcType">LC Type *</Label>
                  <Select value={formData.lcType} onValueChange={(value) => handleInputChange("lcType", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select LC type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Irrevocable">Irrevocable</SelectItem>
                      <SelectItem value="Revocable">Revocable</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="currency">Currency *</Label>
                  <Select value={formData.currency} onValueChange={(value) => handleInputChange("currency", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                      <SelectItem value="GBP">GBP</SelectItem>
                      <SelectItem value="JPY">JPY</SelectItem>
                      <SelectItem value="CNY">CNY</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="lcAmount">LC Amount *</Label>
                  <Input
                    id="lcAmount"
                    type="number"
                    value={formData.lcAmount}
                    onChange={(e) => handleInputChange("lcAmount", e.target.value)}
                    placeholder="Enter amount"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="placeOfExpiry">Place of Expiry *</Label>
                  <Input
                    id="placeOfExpiry"
                    value={formData.placeOfExpiry}
                    onChange={(e) => handleInputChange("placeOfExpiry", e.target.value)}
                    placeholder="Enter place of expiry"
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="expiryDate">Expiry Date *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !formData.expiryDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.expiryDate ? format(formData.expiryDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.expiryDate}
                        onSelect={(date) => handleInputChange("expiryDate", date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Banking Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Banknote className="h-5 w-5" />
                Banking Details
              </CardTitle>
              <CardDescription>Bank information for both parties</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="applicantBankName">Applicant's Bank Name *</Label>
                  <Input
                    id="applicantBankName"
                    value={formData.applicantBankName}
                    onChange={(e) => handleInputChange("applicantBankName", e.target.value)}
                    placeholder="Enter your bank name"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="beneficiaryBankName">Beneficiary's Bank Name *</Label>
                  <Input
                    id="beneficiaryBankName"
                    value={formData.beneficiaryBankName}
                    onChange={(e) => handleInputChange("beneficiaryBankName", e.target.value)}
                    placeholder="Enter exporter's bank name"
                    required
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="swiftCode">Swift Code / Bank Identifier</Label>
                <Input
                  id="swiftCode"
                  value={formData.swiftCode}
                  onChange={(e) => handleInputChange("swiftCode", e.target.value)}
                  placeholder="Enter swift code (optional)"
                />
              </div>
            </CardContent>
          </Card>

          {/* Trade Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Trade Details
              </CardTitle>
              <CardDescription>Goods and shipment information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="descriptionOfGoods">Description of Goods *</Label>
                <Textarea
                  id="descriptionOfGoods"
                  value={formData.descriptionOfGoods}
                  onChange={(e) => handleInputChange("descriptionOfGoods", e.target.value)}
                  placeholder="Describe the goods or services in detail"
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="quantity">Quantity *</Label>
                  <Input
                    id="quantity"
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => handleInputChange("quantity", e.target.value)}
                    placeholder="Enter quantity"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="unit">Unit *</Label>
                  <Select value={formData.unit} onValueChange={(value) => handleInputChange("unit", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pieces">Pieces</SelectItem>
                      <SelectItem value="Kilograms">Kilograms</SelectItem>
                      <SelectItem value="Tons">Tons</SelectItem>
                      <SelectItem value="Meters">Meters</SelectItem>
                      <SelectItem value="Units">Units</SelectItem>
                      <SelectItem value="Cartons">Cartons</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="incoterms">Incoterms *</Label>
                  <Select value={formData.incoterms} onValueChange={(value) => handleInputChange("incoterms", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select incoterms" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="FOB">FOB (Free On Board)</SelectItem>
                      <SelectItem value="CIF">CIF (Cost, Insurance & Freight)</SelectItem>
                      <SelectItem value="CFR">CFR (Cost & Freight)</SelectItem>
                      <SelectItem value="EXW">EXW (Ex Works)</SelectItem>
                      <SelectItem value="DDP">DDP (Delivered Duty Paid)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="portOfLoading">Port of Loading *</Label>
                  <Input
                    id="portOfLoading"
                    value={formData.portOfLoading}
                    onChange={(e) => handleInputChange("portOfLoading", e.target.value)}
                    placeholder="Enter port of loading"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="portOfDischarge">Port of Discharge *</Label>
                  <Input
                    id="portOfDischarge"
                    value={formData.portOfDischarge}
                    onChange={(e) => handleInputChange("portOfDischarge", e.target.value)}
                    placeholder="Enter port of discharge"
                    required
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="latestShipmentDate">Latest Shipment Date *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.latestShipmentDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.latestShipmentDate ? format(formData.latestShipmentDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.latestShipmentDate}
                      onSelect={(date) => handleInputChange("latestShipmentDate", date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-center">
            <Button
              type="submit"
              size="lg"
              disabled={!isFormValid() || isSubmitting}
              className="flex items-center gap-2 px-8 py-3"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Creating LC...
                </>
              ) : (
                <>
                  <FileText className="h-5 w-5" />
                  Create Letter of Credit
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
