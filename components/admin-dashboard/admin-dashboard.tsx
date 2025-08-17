"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { 
  Search, 
  Filter, 
  Eye, 
  Download, 
  CheckCircle, 
  XCircle,
  FileText,
  Clock,
  AlertCircle,
  BarChart3,
  TrendingUp,
  Activity,
  CreditCard,
  Receipt,
  Send,
  Copy,
  ExternalLink,
  Upload,
  Network,
  Package,
  Ship
} from "lucide-react"
import { useLCStore, LC, Document } from "@/lib/store"
import { useToast } from "@/hooks/use-toast"
import JSZip from "jszip"
import { saveAs } from "file-saver"

export default function AdminDashboard() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [activeTab, setActiveTab] = useState("overview")
  const [selectedLC, setSelectedLC] = useState<LC | null>(null)
  const [isApproving, setIsApproving] = useState(false)
  const [approvalComments, setApprovalComments] = useState("")
  
  const { lcs, approveLC, setCurrentUser, setUserRole } = useLCStore()
  const { toast } = useToast()

  // Set admin role and user
  useEffect(() => {
    setUserRole('ADMIN')
    setCurrentUser('admin-user-001')
  }, [setUserRole, setCurrentUser])

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

  // Calculate stats
  const totalLCs = lcs.length
  const pendingReview = lcs.filter(lc => lc.status === 'AWAITING_ADMIN_REVIEW').length
  const onChain = lcs.filter(lc => lc.status === 'ONCHAIN').length
  const inShipment = lcs.filter(lc => lc.status.includes('SHIPMENT')).length
  const completed = lcs.filter(lc => lc.status === 'SHIPMENT_COMPLETED').length
  const totalValue = lcs.reduce((sum, lc) => sum + parseFloat(lc.formData.lcAmount), 0)

  const handleApproveLC = async () => {
    if (!selectedLC) return

    setIsApproving(true)
    
    try {
      // Simulate onchain transaction
      const onchainData = {
        txHash: `0x${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`,
        blockNumber: (Math.floor(Math.random() * 1000000) + 1000000).toString(),
        timestamp: new Date(),
        network: "Avalanche C-Chain",
        gasUsed: (Math.floor(Math.random() * 100000) + 50000).toString(),
        gasPrice: (Math.random() * 20 + 10).toFixed(2)
      }

      // Approve LC in store
      approveLC(selectedLC.id, 'admin-user-001', onchainData)
      
      toast({
        title: "LC Approved Successfully!",
        description: `LC ${selectedLC.reference} has been approved and pushed to Avalanche blockchain.`,
      })

      setSelectedLC(null)
      setApprovalComments("")
      
    } catch (error) {
      toast({
        title: "Error Approving LC",
        description: "There was an error approving the LC. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsApproving(false)
    }
  }

  const downloadAllDocuments = async (lc: LC) => {
    if (!lc.exporterDocs?.documents.length) {
      toast({
        title: "No Documents",
        description: "This LC has no documents to download.",
        variant: "destructive"
      })
      return
    }

    try {
      const zip = new JSZip()
      
      // Add LC form data as JSON
      zip.file(`LC-${lc.reference}-details.json`, JSON.stringify(lc.formData, null, 2))
      
      // Add documents
      lc.exporterDocs.documents.forEach(doc => {
        zip.file(`documents/${doc.type}/${doc.name}`, doc.file)
      })

      // Generate and download zip
      const content = await zip.generateAsync({ type: "blob" })
      saveAs(content, `LC-${lc.reference}-documents.zip`)
      
      toast({
        title: "Documents Downloaded",
        description: "All documents have been downloaded as a ZIP file.",
      })
    } catch (error) {
      toast({
        title: "Download Error",
        description: "There was an error downloading the documents.",
        variant: "destructive"
      })
    }
  }

  const filteredLCs = lcs.filter(lc => {
    const matchesSearch = lc.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lc.formData.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lc.formData.beneficiaryName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === "all" || lc.status === filterStatus
    return matchesSearch && matchesStatus
  })

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-400">Review and approve Letters of Credit</p>
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
            <TabsTrigger value="lc-review">LC Review</TabsTrigger>
            <TabsTrigger value="onchain">On-chain LCs</TabsTrigger>
            <TabsTrigger value="shipments">Shipments</TabsTrigger>
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
                  <p className="text-xs text-muted-foreground">Created</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{pendingReview}</div>
                  <p className="text-xs text-muted-foreground">Awaiting approval</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">On-chain</CardTitle>
                  <Network className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{onChain}</div>
                  <p className="text-xs text-muted-foreground">Blockchain verified</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">In Shipment</CardTitle>
                  <Ship className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{inShipment}</div>
                  <p className="text-xs text-muted-foreground">Active shipments</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Value</CardTitle>
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${totalValue.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">All LCs</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent LC Activity</CardTitle>
                <CardDescription>Latest Letter of Credit updates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {lcs.slice(0, 5).map((lc) => (
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

          {/* LC Review Tab */}
          <TabsContent value="lc-review" className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">LC Review & Approval</h2>
            
            {/* Search and Filter */}
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
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
                <option value="AWAITING_EXPORTER_DOCS">Awaiting Exporter Docs</option>
                <option value="AWAITING_ADMIN_REVIEW">Awaiting Admin Review</option>
                <option value="ONCHAIN">On-chain</option>
                <option value="SHIPMENT_INITIATED">Shipment Initiated</option>
                <option value="SHIPMENT_IN_TRANSIT">Shipment In Transit</option>
                <option value="SHIPMENT_COMPLETED">Shipment Completed</option>
              </select>
            </div>

            {/* LC Table */}
            <Card>
              <CardHeader>
                <CardTitle>Letters of Credit</CardTitle>
                <CardDescription>Review and approve pending LCs</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>LC Reference</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Importer</TableHead>
                      <TableHead>Exporter</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Documents</TableHead>
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
                        <TableCell>{lc.formData.beneficiaryName}</TableCell>
                        <TableCell>
                          {lc.formData.currency} {lc.formData.lcAmount}
                        </TableCell>
                        <TableCell>
                          {lc.exporterDocs ? (
                            <span className="text-green-600 dark:text-green-400">
                              {lc.exporterDocs.documents.length} docs
                            </span>
                          ) : (
                            <span className="text-gray-500">No docs</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setSelectedLC(lc)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            {lc.exporterDocs && (
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => downloadAllDocuments(lc)}
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                            )}
                            {lc.status === 'AWAITING_ADMIN_REVIEW' && (
                              <Button 
                                size="sm"
                                onClick={() => setSelectedLC(lc)}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <CheckCircle className="h-4 w-4" />
                                Review
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

          {/* On-chain Tab */}
          <TabsContent value="onchain" className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">On-chain LCs</h2>
            
            <Card>
              <CardHeader>
                <CardTitle>Blockchain Verified LCs</CardTitle>
                <CardDescription>Letters of Credit that have been approved and pushed to Avalanche</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {lcs.filter(lc => lc.status === 'ONCHAIN').map((lc) => (
                    <div key={lc.id} className="border rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">{lc.reference}</h3>
                        <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                          On-chain
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <Label className="text-sm font-medium text-gray-500">Transaction Hash</Label>
                          <div className="flex items-center gap-2">
                            <p className="font-mono text-sm">{lc.onchain?.txHash}</p>
                            <Button variant="outline" size="sm">
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-500">Block Number</Label>
                          <p className="font-mono text-sm">{lc.onchain?.blockNumber}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-500">Network</Label>
                          <p className="text-sm">{lc.onchain?.network}</p>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          View on Explorer
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Download Proof
                        </Button>
                      </div>
                    </div>
                  ))}
                  
                  {lcs.filter(lc => lc.status === 'ONCHAIN').length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <Network className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                      <p>No on-chain LCs yet</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Shipments Tab */}
          <TabsContent value="shipments" className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Shipment Tracking</h2>
            
            <Card>
              <CardHeader>
                <CardTitle>Active Shipments</CardTitle>
                <CardDescription>Track the progress of LC shipments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {lcs.filter(lc => lc.shipment).map((lc) => (
                    <div key={lc.id} className="border rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">{lc.reference}</h3>
                        <Badge className={getStatusColor(lc.status)}>
                          {getStatusLabel(lc.status)}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium text-gray-500">Shipment Provider</Label>
                          <p className="font-medium">{lc.shipment?.provider}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-500">Status</Label>
                          <p className="font-medium">{lc.shipment?.status}</p>
                        </div>
                        {lc.shipment?.trackingNumber && (
                          <div>
                            <Label className="text-sm font-medium text-gray-500">Tracking Number</Label>
                            <p className="font-mono text-sm">{lc.shipment.trackingNumber}</p>
                          </div>
                        )}
                        {lc.shipment?.estimatedDelivery && (
                          <div>
                            <Label className="text-sm font-medium text-gray-500">Estimated Delivery</Label>
                            <p className="font-medium">{lc.shipment.estimatedDelivery.toLocaleDateString()}</p>
                          </div>
                        )}
                      </div>
                      
                      {lc.shipment?.notes && (
                        <div className="mt-4">
                          <Label className="text-sm font-medium text-gray-500">Notes</Label>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{lc.shipment.notes}</p>
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {lcs.filter(lc => lc.shipment).length === 0 && (
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

      {/* LC Review Dialog */}
      <Dialog open={!!selectedLC} onOpenChange={() => setSelectedLC(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Review Letter of Credit</DialogTitle>
            <DialogDescription>
              Review LC details and documents before approval
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
                      <Label className="text-sm font-medium text-gray-500">Amount</Label>
                      <p className="font-medium">
                        {selectedLC.formData.currency} {selectedLC.formData.lcAmount}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Importer</Label>
                      <p className="font-medium">{selectedLC.formData.applicantName}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Exporter</Label>
                      <p className="font-medium">{selectedLC.formData.beneficiaryName}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Documents */}
              {selectedLC.exporterDocs && (
                <Card>
                  <CardHeader>
                    <CardTitle>Submitted Documents</CardTitle>
                    <CardDescription>
                      {selectedLC.exporterDocs.documents.length} documents submitted
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {selectedLC.exporterDocs.documents.map((doc) => (
                        <div key={doc.id} className="flex items-center justify-between p-3 border rounded">
                          <div className="flex items-center gap-3">
                            <FileText className="h-5 w-5 text-blue-500" />
                            <div>
                              <p className="font-medium">{doc.name}</p>
                              <p className="text-sm text-gray-500">{doc.type}</p>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Approval Form */}
              <Card>
                <CardHeader>
                  <CardTitle>Approval Decision</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="comments">Comments (Optional)</Label>
                    <Textarea
                      id="comments"
                      placeholder="Add any comments about this LC..."
                      value={approvalComments}
                      onChange={(e) => setApprovalComments(e.target.value)}
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      onClick={handleApproveLC}
                      disabled={isApproving}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      {isApproving ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Approving...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Approve & Push On-chain
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setSelectedLC(null)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
