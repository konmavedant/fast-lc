"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { 
  Search, 
  Filter, 
  Eye, 
  Download, 
  CheckCircle, 
  Clock,
  Package,
  Ship,
  Calendar,
  DollarSign,
  FileText,
  AlertCircle,
  BarChart3,
  TrendingUp,
  Activity,
  CreditCard,
  Receipt,
  Send,
  Upload,
  FileUp
} from "lucide-react"
import { useLCStore, LC } from "@/lib/store"
import { useToast } from "@/hooks/use-toast"
import DocumentUploadComponent from "./document-upload"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"

export default function ExporterDashboard() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [activeTab, setActiveTab] = useState("overview")
  const [selectedLC, setSelectedLC] = useState<LC | null>(null)
  const [showDocumentUpload, setShowDocumentUpload] = useState(false)
  
  const { lcs, setCurrentUser, setUserRole } = useLCStore()
  const { toast } = useToast()

  // Set exporter role and user
  useState(() => {
    setUserRole('EXPORTER')
    setCurrentUser('exporter-user-001')
  })

  const getStatusColor = (status: LC['status']) => {
    switch (status) {
      case 'CREATED': return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case 'AWAITING_EXPORTER_DOCS': return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case 'AWAITING_ADMIN_REVIEW': return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
      case 'ONCHAIN': return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
      case 'SHIPMENT_INITIATED': return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case 'SHIPMENT_IN_TRANSIT': return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200"
      case 'SHIPMENT_COMPLETED': return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const getStatusLabel = (status: LC['status']) => {
    return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
  }

  // Filter LCs for this exporter (by beneficiary name)
  const exporterLCs = lcs.filter(lc => 
    lc.formData.beneficiaryName.toLowerCase().includes('exporter') || 
    lc.formData.beneficiaryName.toLowerCase().includes('trading') ||
    lc.formData.beneficiaryName.toLowerCase().includes('export')
  )

  // Calculate stats
  const totalLCs = exporterLCs.length
  const awaitingDocs = exporterLCs.filter(lc => lc.status === 'AWAITING_EXPORTER_DOCS').length
  const docsSubmitted = exporterLCs.filter(lc => lc.status === 'AWAITING_ADMIN_REVIEW').length
  const onChain = exporterLCs.filter(lc => lc.status === 'ONCHAIN').length
  const inShipment = exporterLCs.filter(lc => lc.status.includes('SHIPMENT')).length
  const totalValue = exporterLCs.reduce((sum, lc) => sum + parseFloat(lc.formData.lcAmount), 0)

  const handleViewLC = (lc: LC) => {
    setSelectedLC(lc)
  }

  const handleSubmitDocuments = (lc: LC) => {
    setSelectedLC(lc)
    setShowDocumentUpload(true)
  }

  const filteredLCs = exporterLCs.filter(lc => {
    const matchesSearch = lc.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lc.formData.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lc.formData.beneficiaryName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === "all" || lc.status === filterStatus
    return matchesSearch && matchesStatus
  })

  if (showDocumentUpload && selectedLC) {
    return (
      <DocumentUploadComponent 
        lc={selectedLC} 
        onBack={() => {
          setShowDocumentUpload(false)
          setSelectedLC(null)
        }} 
      />
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Exporter Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage your Letters of Credit and submit required documents</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Reports
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Analytics
            </Button>
          </div>
        </div>

        {/* Main Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="awaiting-docs">Awaiting Documents</TabsTrigger>
            <TabsTrigger value="submitted">Documents Submitted</TabsTrigger>
            <TabsTrigger value="tracking">Shipment Tracking</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Quick Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total LCs</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalLCs}</div>
                  <p className="text-xs text-muted-foreground">All LCs</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Awaiting Documents</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{awaitingDocs}</div>
                  <p className="text-xs text-muted-foreground">Need document submission</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Docs Submitted</CardTitle>
                  <Upload className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{docsSubmitted}</div>
                  <p className="text-xs text-muted-foreground">Under admin review</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">On-chain</CardTitle>
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{onChain}</div>
                  <p className="text-xs text-muted-foreground">Blockchain verified</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Value</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${totalValue.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">All LCs</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent LC Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent LC Activity</CardTitle>
                <CardDescription>Latest Letter of Credit updates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {exporterLCs.slice(0, 5).map((lc) => (
                    <div key={lc.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <FileText className="h-8 w-8 text-blue-500" />
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white">
                            {lc.reference}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {lc.formData.applicantName} → {lc.formData.beneficiaryName}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge className={getStatusColor(lc.status)}>
                          {getStatusLabel(lc.status)}
                        </Badge>
                        <span className="text-sm text-gray-500">
                          {lc.updatedAt.toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Awaiting Documents Tab */}
          <TabsContent value="awaiting-docs" className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">LCs Awaiting Document Submission</h2>
            
            {/* Search and Filter */}
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  placeholder="Search LCs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <select 
                value={filterStatus} 
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border rounded-md"
              >
                <option value="all">All Statuses</option>
                <option value="CREATED">Created</option>
                <option value="AWAITING_EXPORTER_DOCS">Awaiting Documents</option>
                <option value="AWAITING_ADMIN_REVIEW">Under Review</option>
                <option value="ONCHAIN">On-chain</option>
                <option value="SHIPMENT_INITIATED">Shipment Started</option>
                <option value="SHIPMENT_IN_TRANSIT">In Transit</option>
                <option value="SHIPMENT_COMPLETED">Completed</option>
              </select>
            </div>

            {/* LC Table */}
            <Card>
              <CardHeader>
                <CardTitle>Letters of Credit</CardTitle>
                <CardDescription>Submit required documents for pending LCs</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>LC Reference</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Importer</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Route</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLCs.map((lc) => (
                      <TableRow key={lc.id}>
                        <TableCell className="font-medium">{lc.reference}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(lc.status)}>
                            {getStatusLabel(lc.status)}
                          </Badge>
                        </TableCell>
                        <TableCell>{lc.formData.applicantName}</TableCell>
                        <TableCell>
                          {lc.formData.currency} {lc.formData.lcAmount}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Package className="h-4 w-4 text-gray-500" />
                            <span className="text-sm">
                              {lc.formData.portOfLoading} → {lc.formData.portOfDischarge}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleViewLC(lc)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            {lc.status === 'AWAITING_EXPORTER_DOCS' && (
                                                           <Button 
                               size="sm"
                               onClick={() => handleSubmitDocuments(lc)}
                               className="bg-blue-600 hover:bg-blue-700"
                             >
                               <FileUp className="h-4 w-4" />
                               Submit Docs
                             </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Documents Submitted Tab */}
          <TabsContent value="submitted" className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Documents Submitted</h2>
            
            <Card>
              <CardHeader>
                <CardTitle>LCs Under Admin Review</CardTitle>
                <CardDescription>LCs where documents have been submitted and are awaiting admin approval</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {exporterLCs.filter(lc => lc.status === 'AWAITING_ADMIN_REVIEW').map((lc) => (
                    <div key={lc.id} className="border rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">{lc.reference}</h3>
                        <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
                          Under Review
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <Label className="text-sm font-medium text-gray-500">Importer</Label>
                          <p className="font-medium">{lc.formData.applicantName}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-500">Amount</Label>
                          <p className="font-medium">
                            {lc.formData.currency} {lc.formData.lcAmount}
                          </p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-500">Documents Submitted</Label>
                          <p className="font-medium">
                            {lc.exporterDocs?.documents.length || 0} documents
                          </p>
                        </div>
                      </div>

                      {lc.exporterDocs && (
                        <div className="mb-4">
                          <Label className="text-sm font-medium text-gray-500">Submitted Documents</Label>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {lc.exporterDocs.documents.map((doc) => (
                              <Badge key={doc.id} variant="secondary" className="text-xs">
                                {doc.type.replace('_', ' ')}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleViewLC(lc)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                        <Button variant="outline" size="sm">
                          <Clock className="h-4 w-4 mr-2" />
                          Check Status
                        </Button>
                      </div>
                    </div>
                  ))}
                  
                  {exporterLCs.filter(lc => lc.status === 'AWAITING_ADMIN_REVIEW').length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                      <p>No documents submitted yet</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Shipment Tracking Tab */}
          <TabsContent value="tracking" className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Shipment Tracking</h2>
            
            <Card>
              <CardHeader>
                <CardTitle>Active Shipments</CardTitle>
                <CardDescription>Track the progress of your LC shipments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {exporterLCs.filter(lc => lc.status.includes('SHIPMENT')).map((lc) => (
                    <div key={lc.id} className="border rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">{lc.reference}</h3>
                        <Badge className={getStatusColor(lc.status)}>
                          {getStatusLabel(lc.status)}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <Label className="text-sm font-medium text-gray-500">Route</Label>
                          <p className="font-medium">
                            {lc.formData.portOfLoading} → {lc.formData.portOfDischarge}
                          </p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-500">Amount</Label>
                          <p className="font-medium">
                            {lc.formData.currency} {lc.formData.lcAmount}
                          </p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-500">Latest Update</Label>
                          <p className="font-medium">{lc.updatedAt.toLocaleDateString()}</p>
                        </div>
                      </div>

                      {lc.shipment && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <Label className="text-sm font-medium text-gray-500">Shipment Provider</Label>
                            <p className="font-medium">{lc.shipment.provider}</p>
                          </div>
                          {lc.shipment.trackingNumber && (
                            <div>
                              <Label className="text-sm font-medium text-gray-500">Tracking Number</Label>
                              <p className="font-mono text-sm">{lc.shipment.trackingNumber}</p>
                            </div>
                          )}
                        </div>
                      )}
                      
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleViewLC(lc)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                        <Button variant="outline" size="sm">
                          <Ship className="h-4 w-4 mr-2" />
                          Track Shipment
                        </Button>
                      </div>
                    </div>
                  ))}
                  
                  {exporterLCs.filter(lc => lc.status.includes('SHIPMENT')).length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <Ship className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                      <p>No active shipments yet</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* LC Detail Dialog */}
      <Dialog open={!!selectedLC} onOpenChange={() => setSelectedLC(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>LC Details</DialogTitle>
            <DialogDescription>
              View Letter of Credit details and status
            </DialogDescription>
          </DialogHeader>
          
          {selectedLC && (
            <div className="space-y-6">
              {/* LC Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>LC Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Reference</Label>
                      <p className="font-medium">{selectedLC.reference}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Status</Label>
                      <Badge className={getStatusColor(selectedLC.status)}>
                        {getStatusLabel(selectedLC.status)}
                      </Badge>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Importer</Label>
                      <p className="font-medium">{selectedLC.formData.applicantName}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Amount</Label>
                      <p className="font-medium">
                        {selectedLC.formData.currency} {selectedLC.formData.lcAmount}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Route</Label>
                      <p className="font-medium">
                        {selectedLC.formData.portOfLoading} → {selectedLC.formData.portOfDischarge}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Created</Label>
                      <p className="font-medium">{selectedLC.createdAt.toLocaleDateString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Trade Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Trade Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Goods Description</Label>
                      <p className="font-medium">{selectedLC.formData.descriptionOfGoods}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Quantity</Label>
                      <p className="font-medium">
                        {selectedLC.formData.quantity} {selectedLC.formData.unit}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Incoterms</Label>
                      <p className="font-medium">{selectedLC.formData.incoterms}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Latest Shipment Date</Label>
                      <p className="font-medium">
                        {selectedLC.formData.latestShipmentDate?.toLocaleDateString() || 'Not specified'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex gap-2">
                {selectedLC.status === 'AWAITING_EXPORTER_DOCS' && (
                                     <Button
                     onClick={() => handleSubmitDocuments(selectedLC)}
                     className="flex-1 bg-blue-600 hover:bg-blue-700"
                   >
                     <FileUp className="h-4 w-4 mr-2" />
                     Submit Documents
                   </Button>
                )}
                <Button
                  variant="outline"
                  onClick={() => setSelectedLC(null)}
                  className="flex-1"
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
