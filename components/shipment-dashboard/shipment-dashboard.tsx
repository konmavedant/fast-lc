"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Search, 
  Filter, 
  Eye, 
  Download, 
  CheckCircle, 
  Clock,
  Truck,
  Ship,
  Package,
  MapPin,
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
  Copy,
  ExternalLink,
  Upload,
  Route,
  Navigation
} from "lucide-react"
import { useLCStore, LC } from "@/lib/store"
import { useToast } from "@/hooks/use-toast"

export default function ShipmentDashboard() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [activeTab, setActiveTab] = useState("overview")
  const [selectedLC, setSelectedLC] = useState<LC | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)
  const [shipmentNotes, setShipmentNotes] = useState("")
  const [trackingNumber, setTrackingNumber] = useState("")
  const [estimatedDelivery, setEstimatedDelivery] = useState("")
  
  const { lcs, updateShipmentStatus, setCurrentUser, setUserRole } = useLCStore()
  const { toast } = useToast()

  // Set shipment provider role and user
  useState(() => {
    setUserRole('SHIPMENT_PROVIDER')
    setCurrentUser('shipment-provider-001')
  })

  const getStatusColor = (status: LC['status']) => {
    switch (status) {
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

  // Filter LCs that are ready for shipment (on-chain) or already in shipment
  const shipmentLCs = lcs.filter(lc => 
    lc.status === 'ONCHAIN' || lc.status.includes('SHIPMENT')
  )

  // Calculate stats
  const totalShipments = shipmentLCs.length
  const readyForShipment = lcs.filter(lc => lc.status === 'ONCHAIN').length
  const inTransit = lcs.filter(lc => lc.status === 'SHIPMENT_IN_TRANSIT').length
  const completed = lcs.filter(lc => lc.status === 'SHIPMENT_COMPLETED').length
  const totalValue = shipmentLCs.reduce((sum, lc) => sum + parseFloat(lc.formData.lcAmount), 0)

  const handleUpdateShipmentStatus = async (lcId: string, status: 'INITIATED' | 'IN_TRANSIT' | 'COMPLETED') => {
    if (!selectedLC) return

    setIsUpdating(true)
    
    try {
      // Update shipment status in store
      updateShipmentStatus(lcId, status, 'shipment-provider-001', shipmentNotes)
      
      toast({
        title: "Shipment Status Updated!",
        description: `Shipment for LC ${selectedLC.reference} has been updated to ${status.toLowerCase().replace('_', ' ')}.`,
      })

      setSelectedLC(null)
      setShipmentNotes("")
      setTrackingNumber("")
      setEstimatedDelivery("")
      
    } catch (error) {
      toast({
        title: "Error Updating Status",
        description: "There was an error updating the shipment status. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const filteredLCs = shipmentLCs.filter(lc => {
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
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Shipment Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage and track LC shipments</p>
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
            <TabsTrigger value="ready-shipments">Ready for Shipment</TabsTrigger>
            <TabsTrigger value="active-shipments">Active Shipments</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Quick Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Shipments</CardTitle>
                  <Truck className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalShipments}</div>
                  <p className="text-xs text-muted-foreground">All shipments</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Ready for Shipment</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{readyForShipment}</div>
                  <p className="text-xs text-muted-foreground">Awaiting pickup</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">In Transit</CardTitle>
                  <Ship className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{inTransit}</div>
                  <p className="text-xs text-muted-foreground">Currently shipping</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Completed</CardTitle>
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{completed}</div>
                  <p className="text-xs text-muted-foreground">Delivered</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Value</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${totalValue.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">All shipments</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Shipment Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Shipment Activity</CardTitle>
                <CardDescription>Latest shipment updates and status changes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {shipmentLCs.slice(0, 5).map((lc) => (
                    <div key={lc.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <Truck className="h-8 w-8 text-blue-500" />
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white">
                            {lc.reference}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {lc.formData.portOfLoading} → {lc.formData.portOfDischarge}
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

          {/* Ready for Shipment Tab */}
          <TabsContent value="ready-shipments" className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Ready for Shipment</h2>
            
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
                <option value="ONCHAIN">Ready for Shipment</option>
                <option value="SHIPMENT_INITIATED">Shipment Initiated</option>
                <option value="SHIPMENT_IN_TRANSIT">In Transit</option>
                <option value="SHIPMENT_COMPLETED">Completed</option>
              </select>
            </div>

            {/* LC Table */}
            <Card>
              <CardHeader>
                <CardTitle>Letters of Credit Ready for Shipment</CardTitle>
                <CardDescription>LCs that have been approved and are ready to be shipped</CardDescription>
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
                      <TableHead>Route</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLCs.filter(lc => lc.status === 'ONCHAIN').map((lc) => (
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
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-gray-500" />
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
                              onClick={() => setSelectedLC(lc)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="sm"
                              onClick={() => setSelectedLC(lc)}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <Truck className="h-4 w-4" />
                              Start Shipment
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Active Shipments Tab */}
          <TabsContent value="active-shipments" className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Active Shipments</h2>
            
            <Card>
              <CardHeader>
                <CardTitle>Shipments in Progress</CardTitle>
                <CardDescription>Track active shipments and update their status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {lcs.filter(lc => lc.status.includes('SHIPMENT') && lc.status !== 'SHIPMENT_COMPLETED').map((lc) => (
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
                            <Label className="text-sm font-medium text-gray-500">Tracking Number</Label>
                            <p className="font-mono text-sm">{lc.shipment.trackingNumber || 'Not assigned'}</p>
                          </div>
                          {lc.shipment.estimatedDelivery && (
                            <div>
                              <Label className="text-sm font-medium text-gray-500">Estimated Delivery</Label>
                              <p className="font-medium">{lc.shipment.estimatedDelivery.toLocaleDateString()}</p>
                            </div>
                          )}
                        </div>
                      )}
                      
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setSelectedLC(lc)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                        <Button 
                          size="sm"
                          onClick={() => setSelectedLC(lc)}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          <Navigation className="h-4 w-4 mr-2" />
                          Update Status
                        </Button>
                      </div>
                    </div>
                  ))}
                  
                  {lcs.filter(lc => lc.status.includes('SHIPMENT') && lc.status !== 'SHIPMENT_COMPLETED').length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <Truck className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                      <p>No active shipments</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Completed Shipments Tab */}
          <TabsContent value="completed" className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Completed Shipments</h2>
            
            <Card>
              <CardHeader>
                <CardTitle>Delivered Shipments</CardTitle>
                <CardDescription>Successfully completed shipments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {lcs.filter(lc => lc.status === 'SHIPMENT_COMPLETED').map((lc) => (
                    <div key={lc.id} className="border rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">{lc.reference}</h3>
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                          Completed
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
                          <Label className="text-sm font-medium text-gray-500">Completed Date</Label>
                          <p className="font-medium">
                            {lc.shipment?.completedAt?.toLocaleDateString() || 'N/A'}
                          </p>
                        </div>
                      </div>

                      {lc.shipment?.notes && (
                        <div className="mb-4">
                          <Label className="text-sm font-medium text-gray-500">Delivery Notes</Label>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{lc.shipment.notes}</p>
                        </div>
                      )}
                      
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setSelectedLC(lc)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Download Certificate
                        </Button>
                      </div>
                    </div>
                  ))}
                  
                  {lcs.filter(lc => lc.status === 'SHIPMENT_COMPLETED').length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <CheckCircle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                      <p>No completed shipments yet</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Shipment Status Update Dialog */}
      <Dialog open={!!selectedLC} onOpenChange={() => setSelectedLC(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Update Shipment Status</DialogTitle>
            <DialogDescription>
              Update the shipment status for LC {selectedLC?.reference}
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
                      <Label className="text-sm font-medium text-gray-500">Current Status</Label>
                      <Badge className={getStatusColor(selectedLC.status)}>
                        {getStatusLabel(selectedLC.status)}
                      </Badge>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Route</Label>
                      <p className="font-medium">
                        {selectedLC.formData.portOfLoading} → {selectedLC.formData.portOfDischarge}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Amount</Label>
                      <p className="font-medium">
                        {selectedLC.formData.currency} {selectedLC.formData.lcAmount}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Status Update Form */}
              <Card>
                <CardHeader>
                  <CardTitle>Status Update</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="tracking">Tracking Number (Optional)</Label>
                    <Input
                      id="tracking"
                      placeholder="Enter tracking number..."
                      value={trackingNumber}
                      onChange={(e) => setTrackingNumber(e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="delivery">Estimated Delivery Date (Optional)</Label>
                    <Input
                      id="delivery"
                      type="date"
                      value={estimatedDelivery}
                      onChange={(e) => setEstimatedDelivery(e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="notes">Notes (Optional)</Label>
                    <Textarea
                      id="notes"
                      placeholder="Add any shipment notes..."
                      value={shipmentNotes}
                      onChange={(e) => setShipmentNotes(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Update Status To:</Label>
                    <div className="flex gap-2">
                      {selectedLC.status === 'ONCHAIN' && (
                        <Button
                          onClick={() => handleUpdateShipmentStatus(selectedLC.id, 'INITIATED')}
                          disabled={isUpdating}
                          className="flex-1 bg-green-600 hover:bg-green-700"
                        >
                          {isUpdating ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Updating...
                            </>
                          ) : (
                            <>
                              <Truck className="h-4 w-4 mr-2" />
                              Start Shipment
                            </>
                          )}
                        </Button>
                      )}
                      
                      {selectedLC.status === 'SHIPMENT_INITIATED' && (
                        <Button
                          onClick={() => handleUpdateShipmentStatus(selectedLC.id, 'IN_TRANSIT')}
                          disabled={isUpdating}
                          className="flex-1 bg-blue-600 hover:bg-blue-700"
                        >
                          {isUpdating ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Updating...
                            </>
                          ) : (
                            <>
                              <Ship className="h-4 w-4 mr-2" />
                              Mark In Transit
                            </>
                          )}
                        </Button>
                      )}
                      
                      {selectedLC.status === 'SHIPMENT_IN_TRANSIT' && (
                        <Button
                          onClick={() => handleUpdateShipmentStatus(selectedLC.id, 'COMPLETED')}
                          disabled={isUpdating}
                          className="flex-1 bg-green-600 hover:bg-green-700"
                        >
                          {isUpdating ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Updating...
                            </>
                          ) : (
                            <>
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Mark Delivered
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
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
