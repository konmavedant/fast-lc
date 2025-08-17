"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Play,
  FileText,
  Upload,
  CheckCircle,
  Blockchain,
  Truck,
  Ship,
  Package,
  ArrowRight,
  Users,
  Building,
  Globe,
  DollarSign,
  Clock,
  AlertCircle
} from "lucide-react"
import { useLCStore } from "@/lib/store"
import { useToast } from "@/hooks/use-toast"

export default function DemoPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  
  const { lcs, createLC, submitExporterDocs, approveLC, updateShipmentStatus, setCurrentUser, setUserRole } = useLCStore()
  const { toast } = useToast()

  const demoSteps = [
    {
      id: 1,
      title: "Importer Creates LC",
      description: "Importer fills out LC form and submits",
      icon: <FileText className="h-6 w-6" />,
      status: "pending"
    },
    {
      id: 2,
      title: "Exporter Submits Documents",
      description: "Exporter uploads required trade documents",
      icon: <Upload className="h-6 w-6" />,
      status: "pending"
    },
    {
      id: 3,
      title: "Admin Reviews & Approves",
      description: "Admin reviews documents and pushes to blockchain",
      icon: <CheckCircle className="h-6 w-6" />,
      status: "pending"
    },
    {
      id: 4,
      title: "LC Goes On-chain",
      description: "LC is stored on Avalanche blockchain",
      icon: <Blockchain className="h-6 w-6" />,
      status: "pending"
    },
    {
      id: 5,
      title: "Shipment Provider Takes Over",
      description: "Shipment provider initiates and tracks shipment",
      icon: <Truck className="h-6 w-6" />,
      status: "pending"
    },
    {
      id: 6,
      title: "Shipment Completed",
      description: "Goods delivered and trade completed",
      icon: <Package className="h-6 w-6" />,
      status: "pending"
    }
  ]

  const runDemo = async () => {
    setIsRunning(true)
    
    try {
      // Step 1: Importer creates LC
      setCurrentStep(1)
      setCurrentUser("demo-importer")
      setUserRole("IMPORTER")
      
      const demoLCData = {
        applicantName: "Global Import Solutions Ltd.",
        applicantAddress: "123 Business Ave, Suite 100, New York, NY 10001",
        contactPerson: "John Smith",
        contactEmail: "john.smith@globalimport.com",
        contactPhone: "+1 (555) 123-4567",
        beneficiaryName: "Shanghai Trading Co.",
        beneficiaryAddress: "456 Nanjing Road, Shanghai, China",
        beneficiaryCountry: "China",
        lcType: "Irrevocable",
        lcAmount: "50000",
        currency: "USD",
        expiryDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days from now
        placeOfExpiry: "New York",
        applicantBankName: "Bank of America",
        beneficiaryBankName: "Industrial and Commercial Bank of China",
        swiftCode: "BOFAUS3N",
        descriptionOfGoods: "Electronics components and semiconductor chips",
        quantity: "1000",
        unit: "Pieces",
        incoterms: "FOB",
        portOfLoading: "Shanghai Port",
        portOfDischarge: "New York Port",
        latestShipmentDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000) // 60 days from now
      }
      
      const newLC = createLC(demoLCData, "demo-importer")
      toast({
        title: "Step 1 Complete!",
        description: "LC created successfully by importer",
      })
      
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Step 2: Exporter submits documents
      setCurrentStep(2)
      setCurrentUser("demo-exporter")
      setUserRole("EXPORTER")
      
      const demoDocuments = [
        {
          id: "doc-1",
          type: "INVOICE" as const,
          name: "Commercial Invoice.pdf",
          file: new File(["demo invoice content"], "invoice.pdf", { type: "application/pdf" }),
          uploadedAt: new Date(),
          uploadedBy: "demo-exporter",
          fileSize: 1024 * 50, // 50KB
          mimeType: "application/pdf"
        },
        {
          id: "doc-2",
          type: "BILL_OF_LADING" as const,
          name: "Bill of Lading.pdf",
          file: new File(["demo BOL content"], "bol.pdf", { type: "application/pdf" }),
          uploadedAt: new Date(),
          uploadedBy: "demo-exporter",
          fileSize: 1024 * 75, // 75KB
          mimeType: "application/pdf"
        },
        {
          id: "doc-3",
          type: "INSURANCE" as const,
          name: "Insurance Certificate.pdf",
          file: new File(["demo insurance content"], "insurance.pdf", { type: "application/pdf" }),
          uploadedAt: new Date(),
          uploadedBy: "demo-exporter",
          fileSize: 1024 * 30, // 30KB
          mimeType: "application/pdf"
        }
      ]
      
      submitExporterDocs(newLC.id, demoDocuments, "demo-exporter")
      toast({
        title: "Step 2 Complete!",
        description: "Documents submitted by exporter",
      })
      
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Step 3: Admin reviews and approves
      setCurrentStep(3)
      setCurrentUser("demo-admin")
      setUserRole("ADMIN")
      
      const onchainData = {
        txHash: "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
        blockNumber: "12345678",
        timestamp: new Date(),
        network: "Avalanche C-Chain",
        gasUsed: "150000",
        gasPrice: "25.5"
      }
      
      approveLC(newLC.id, "demo-admin", onchainData)
      toast({
        title: "Step 3 Complete!",
        description: "LC approved and pushed to blockchain",
      })
      
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Step 4: LC goes on-chain
      setCurrentStep(4)
      toast({
        title: "Step 4 Complete!",
        description: "LC is now on Avalanche blockchain",
      })
      
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Step 5: Shipment provider takes over
      setCurrentStep(5)
      setCurrentUser("demo-shipment")
      setUserRole("SHIPMENT_PROVIDER")
      
      updateShipmentStatus(newLC.id, "INITIATED", "Global Shipping Co.", "Shipment initiated from Shanghai port")
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      updateShipmentStatus(newLC.id, "IN_TRANSIT", "Global Shipping Co.", "Shipment in transit across Pacific Ocean")
      toast({
        title: "Step 5 Complete!",
        description: "Shipment provider managing logistics",
      })
      
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Step 6: Shipment completed
      setCurrentStep(6)
      updateShipmentStatus(newLC.id, "COMPLETED", "Global Shipping Co.", "Goods delivered to importer warehouse")
      toast({
        title: "Demo Complete!",
        description: "Full LC lifecycle demonstrated successfully",
      })
      
    } catch (error) {
      toast({
        title: "Demo Error",
        description: "There was an error running the demo",
        variant: "destructive"
      })
    } finally {
      setIsRunning(false)
    }
  }

  const resetDemo = () => {
    setCurrentStep(0)
    // Note: In a real app, you'd want to clear the store data
    // For demo purposes, we'll just reset the step counter
  }

  const getStepStatus = (stepId: number) => {
    if (stepId < currentStep) return "completed"
    if (stepId === currentStep) return "current"
    return "pending"
  }

  const getStepColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-500 text-white"
      case "current": return "bg-blue-500 text-white"
      default: return "bg-gray-300 text-gray-600"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            Letter of Credit Flow Demo
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Experience the complete end-to-end flow of a Letter of Credit from creation to completion, 
            demonstrating how all dashboards work together with real-time state management.
          </p>
        </div>

        {/* Demo Controls */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Play className="h-5 w-5" />
              Demo Controls
            </CardTitle>
            <CardDescription>
              Run the complete LC lifecycle demo to see all dashboards in action
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <Button 
                onClick={runDemo}
                disabled={isRunning}
                size="lg"
                className="flex-1"
              >
                {isRunning ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Running Demo...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Start Demo
                  </>
                )}
              </Button>
              <Button 
                onClick={resetDemo}
                variant="outline"
                size="lg"
              >
                Reset Demo
              </Button>
            </div>
            
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <p>This demo will:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Create a sample LC as an importer</li>
                <li>Submit documents as an exporter</li>
                <li>Approve and push to blockchain as admin</li>
                <li>Manage shipment as shipment provider</li>
                <li>Complete the full trade lifecycle</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Demo Progress */}
        <Card>
          <CardHeader>
            <CardTitle>Demo Progress</CardTitle>
            <CardDescription>Current step in the LC lifecycle</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {demoSteps.map((step, index) => (
                <div key={step.id} className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${getStepColor(getStepStatus(step.id))}`}>
                    {getStepStatus(step.id) === "completed" ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      step.icon
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 dark:text-white">{step.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{step.description}</p>
                  </div>
                  
                  {index < demoSteps.length - 1 && (
                    <ArrowRight className="h-5 w-5 text-gray-400" />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Dashboard Access */}
        <Card>
          <CardHeader>
            <CardTitle>Access Different Dashboards</CardTitle>
            <CardDescription>
              Switch between different user roles to see how the LC data flows across all dashboards
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="border-2 hover:border-blue-500 transition-colors">
                <CardContent className="p-4 text-center">
                  <Users className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                  <h3 className="font-medium">Importer Dashboard</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Create and manage LCs
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-3 w-full"
                    onClick={() => window.location.href = '/importer-dashboard'}
                  >
                    Access Dashboard
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-green-500 transition-colors">
                <CardContent className="p-4 text-center">
                  <Building className="h-8 w-8 mx-auto mb-2 text-green-500" />
                  <h3 className="font-medium">Exporter Dashboard</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Submit documents and track LCs
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-3 w-full"
                    onClick={() => window.location.href = '/exporter-dashboard'}
                  >
                    Access Dashboard
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-purple-500 transition-colors">
                <CardContent className="p-4 text-center">
                  <CheckCircle className="h-8 w-8 mx-auto mb-2 text-purple-500" />
                  <h3 className="font-medium">Admin Dashboard</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Review and approve LCs
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-3 w-full"
                    onClick={() => window.location.href = '/admin-dashboard'}
                  >
                    Access Dashboard
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-orange-500 transition-colors">
                <CardContent className="p-4 text-center">
                  <Truck className="h-8 w-8 mx-auto mb-2 text-orange-500" />
                  <h3 className="font-medium">Shipment Dashboard</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Manage shipments and logistics
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-3 w-full"
                    onClick={() => window.location.href = '/shipment-dashboard'}
                  >
                    Access Dashboard
                  </Button>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        {/* Current State */}
        <Card>
          <CardHeader>
            <CardTitle>Current Application State</CardTitle>
            <CardDescription>
              Real-time view of the Zustand store data across all dashboards
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <FileText className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                  <div className="text-2xl font-bold text-blue-600">{lcs.length}</div>
                  <div className="text-sm text-blue-600">Total LCs</div>
                </div>
                
                <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-500" />
                  <div className="text-2xl font-bold text-green-600">
                    {lcs.filter(lc => lc.status === 'ONCHAIN').length}
                  </div>
                  <div className="text-sm text-green-600">On-chain LCs</div>
                </div>
                
                <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                  <Truck className="h-8 w-8 mx-auto mb-2 text-orange-500" />
                  <div className="text-2xl font-bold text-orange-600">
                    {lcs.filter(lc => lc.status.includes('SHIPMENT')).length}
                  </div>
                  <div className="text-sm text-orange-600">Active Shipments</div>
                </div>
              </div>
              
              {lcs.length > 0 && (
                <div className="mt-6">
                  <h4 className="font-medium mb-3">Recent LC Activity:</h4>
                  <div className="space-y-2">
                    {lcs.slice(-3).reverse().map((lc) => (
                      <div key={lc.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div>
                          <span className="font-medium">{lc.reference}</span>
                          <span className="text-gray-500 ml-2">→</span>
                          <span className="text-gray-600">{lc.formData.applicantName}</span>
                        </div>
                        <Badge variant="secondary">{lc.status.replace('_', ' ')}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Features Highlight */}
        <Card>
          <CardHeader>
            <CardTitle>Key Features Demonstrated</CardTitle>
            <CardDescription>
              What this demo showcases about the application architecture
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                  <Globe className="h-4 w-4 text-blue-500" />
                  Global State Management
                </h4>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <li>• Zustand store with localStorage persistence</li>
                  <li>• Real-time updates across all dashboards</li>
                  <li>• Role-based access control</li>
                  <li>• Centralized data flow</li>
                </ul>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-green-500" />
                  Complete LC Lifecycle
                </h4>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <li>• LC creation and form management</li>
                  <li>• Document upload and verification</li>
                  <li>• Admin review and blockchain integration</li>
                  <li>• Shipment tracking and completion</li>
                </ul>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                  <Clock className="h-4 w-4 text-purple-500" />
                  Real-time Updates
                </h4>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <li>• Instant status changes across dashboards</li>
                  <li>• Live notifications and alerts</li>
                  <li>• Synchronized data between users</li>
                  <li>• No page refresh required</li>
                </ul>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-orange-500" />
                  User Experience
                </h4>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <li>• Intuitive dashboard interfaces</li>
                  <li>• Responsive design for all devices</li>
                  <li>• Clear status indicators and progress</li>
                  <li>• Seamless role switching</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
