"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Search, 
  Filter, 
  Plus, 
  Download, 
  Upload, 
  Eye, 
  Edit, 
  Trash2,
  Package,
  Truck,
  Calendar,
  DollarSign,
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
  MessageSquare,
  Bell,
  User,
  Wallet,
  BarChart3,
  TrendingUp,
  Activity,
  CreditCard,
  Receipt,
  Send,
  Copy,
  ExternalLink
} from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts"
import LCForm from "./lc-form"

// Types
interface LC {
  id: string
  reference: string
  status: "ai-verified" | "pending-exporter" | "pending-admin" | "on-chain" | "trade-started" | "completed"
  createdOn: string
  exporter: string
  amount: number
  currency: string
  aiScore: number
  description: string
  documents: string[]
}

interface Trade {
  id: string
  lcId: string
  status: "initiated" | "in-transit" | "completed"
  exporter: string
  shipmentProvider: string
  startDate: string
  estimatedDelivery: string
  paymentStatus: "pending" | "partial" | "completed"
  amount: number
  progress: number
}

interface Payment {
  id: string
  tradeId: string
  amount: number
  status: "pending" | "completed"
  dueDate: string
  completedDate?: string
  transactionId?: string
  hash?: string
}

interface Notification {
  id: string
  type: "lc-accepted" | "admin-approved" | "shipment-started" | "payment-completed"
  title: string
  message: string
  timestamp: string
  read: boolean
}

interface Activity {
  id: string
  action: string
  timestamp: string
  user: string
  details: string
  icon: React.ReactNode
}

// Mock Data
const mockLCs: LC[] = [
  {
    id: "LC-2024-001",
    reference: "IMP-2024-001",
    status: "ai-verified",
    createdOn: "2024-02-01",
    exporter: "Shanghai Trading Co.",
    amount: 50000,
    currency: "USD",
    aiScore: 95,
    description: "Electronics import from China",
    documents: ["invoice.pdf", "packing-list.pdf"]
  },
  {
    id: "LC-2024-002",
    reference: "IMP-2024-002",
    status: "pending-exporter",
    createdOn: "2024-02-05",
    exporter: "Hamburg Export GmbH",
    amount: 35000,
    currency: "EUR",
    aiScore: 87,
    description: "Machinery parts from Germany",
    documents: ["proforma-invoice.pdf"]
  },
  {
    id: "LC-2024-003",
    reference: "IMP-2024-003",
    status: "trade-started",
    createdOn: "2024-01-25",
    exporter: "Tokyo Industries Ltd.",
    amount: 28000,
    currency: "USD",
    aiScore: 92,
    description: "Automotive components from Japan",
    documents: ["contract.pdf", "specifications.pdf"]
  }
]

const mockTrades: Trade[] = [
  {
    id: "TR-001",
    lcId: "LC-2024-003",
    status: "in-transit",
    exporter: "Tokyo Industries Ltd.",
    shipmentProvider: "Global Shipping Co.",
    startDate: "2024-01-28",
    estimatedDelivery: "2024-02-15",
    paymentStatus: "partial",
    amount: 28000,
    progress: 65
  },
  {
    id: "TR-002",
    lcId: "LC-2024-001",
    status: "initiated",
    exporter: "Shanghai Trading Co.",
    shipmentProvider: "Pacific Logistics",
    startDate: "2024-02-02",
    estimatedDelivery: "2024-02-25",
    paymentStatus: "pending",
    amount: 50000,
    progress: 15
  }
]

const mockPayments: Payment[] = [
  {
    id: "PAY-001",
    tradeId: "TR-001",
    amount: 14000,
    status: "pending",
    dueDate: "2024-02-10"
  },
  {
    id: "PAY-002",
    tradeId: "TR-002",
    amount: 50000,
    status: "pending",
    dueDate: "2024-02-20"
  }
]

const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "lc-accepted",
    title: "LC Accepted by Exporter",
    message: "Your LC IMP-2024-002 has been accepted by Hamburg Export GmbH",
    timestamp: "2024-02-06 10:30",
    read: false
  },
  {
    id: "2",
    type: "admin-approved",
    title: "LC Admin Approved",
    message: "LC IMP-2024-001 has been approved by admin and is now on-chain",
    timestamp: "2024-02-03 14:15",
    read: true
  }
]

const mockActivities: Activity[] = [
  {
    id: "1",
    action: "LC Submitted",
    timestamp: "2024-02-01 09:00",
    user: "You",
    details: "Created LC IMP-2024-001 for $50,000",
    icon: <FileText className="h-4 w-4 text-blue-500" />
  },
  {
    id: "2",
    action: "AI Verification Complete",
    timestamp: "2024-02-01 09:05",
    user: "AI System",
    details: "LC verified with 95% confidence score",
    icon: <CheckCircle className="h-4 w-4 text-green-500" />
  },
  {
    id: "3",
    action: "Trade Started",
    timestamp: "2024-01-28 11:30",
    user: "System",
    details: "Trade TR-001 initiated for LC-2024-003",
    icon: <Truck className="h-4 w-4 text-orange-500" />
  }
]

const chartData = [
  { month: "Jan", lcs: 3, trades: 2, payments: 1 },
  { month: "Feb", lcs: 5, trades: 3, payments: 2 },
  { month: "Mar", lcs: 4, trades: 4, payments: 3 },
  { month: "Apr", lcs: 6, trades: 5, payments: 4 }
]

export default function ImporterDashboard() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [activeTab, setActiveTab] = useState("overview")
  const [showLCForm, setShowLCForm] = useState(false)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ai-verified": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "pending-exporter": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "pending-admin": return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
      case "on-chain": return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
      case "trade-started": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "completed": return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const getTradeStatusColor = (status: string) => {
    switch (status) {
      case "initiated": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "in-transit": return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
      case "completed": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      case "partial": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "completed": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  // Calculate stats
  const totalLCs = mockLCs.length
  const pendingApprovals = mockLCs.filter(lc => lc.status === "pending-exporter" || lc.status === "pending-admin").length
  const ongoingTrades = mockTrades.filter(trade => trade.status !== "completed").length
  const completedTrades = mockTrades.filter(trade => trade.status === "completed").length
  const paymentsPending = mockPayments.filter(payment => payment.status === "pending").length
  const totalValue = mockLCs.reduce((sum, lc) => sum + lc.amount, 0)

  // If LC form is shown, render it instead of dashboard
  if (showLCForm) {
    return <LCForm />
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Importer Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage your Letters of Credit, trades, and payments</p>
          </div>
          <div className="flex gap-2">
            <Button 
              className="flex items-center gap-2"
              onClick={() => setShowLCForm(true)}
            >
              <Plus className="h-4 w-4" />
              New LC
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Import
            </Button>
          </div>
        </div>

        {/* Main Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="lc-management">LC Management</TabsTrigger>
            <TabsTrigger value="trades">Trade Management</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Quick Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
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
                  <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{pendingApprovals}</div>
                  <p className="text-xs text-muted-foreground">Awaiting approval</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Ongoing Trades</CardTitle>
                  <Truck className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{ongoingTrades}</div>
                  <p className="text-xs text-muted-foreground">Active</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Completed Trades</CardTitle>
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{completedTrades}</div>
                  <p className="text-xs text-muted-foreground">Finished</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Payments Pending</CardTitle>
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{paymentsPending}</div>
                  <p className="text-xs text-muted-foreground">Due</p>
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

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>LC & Trade Trends</CardTitle>
                  <CardDescription>Monthly activity overview</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="lcs" stroke="#3b82f6" strokeWidth={2} />
                      <Line type="monotone" dataKey="trades" stroke="#10b981" strokeWidth={2} />
                      <Line type="monotone" dataKey="payments" stroke="#f59e0b" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>LC Status Distribution</CardTitle>
                  <CardDescription>Current LC status breakdown</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={[
                          { name: "AI Verified", value: mockLCs.filter(lc => lc.status === "ai-verified").length, color: "#3b82f6" },
                          { name: "Pending", value: mockLCs.filter(lc => lc.status === "pending-exporter" || lc.status === "pending-admin").length, color: "#f59e0b" },
                          { name: "On-chain", value: mockLCs.filter(lc => lc.status === "on-chain").length, color: "#8b5cf6" },
                          { name: "Trade Started", value: mockLCs.filter(lc => lc.status === "trade-started").length, color: "#10b981" },
                          { name: "Completed", value: mockLCs.filter(lc => lc.status === "completed").length, color: "#6b7280" }
                        ]}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}`}
                      >
                        {[
                          { name: "AI Verified", value: mockLCs.filter(lc => lc.status === "ai-verified").length, color: "#3b82f6" },
                          { name: "Pending", value: mockLCs.filter(lc => lc.status === "pending-exporter" || lc.status === "pending-admin").length, color: "#f59e0b" },
                          { name: "On-chain", value: mockLCs.filter(lc => lc.status === "on-chain").length, color: "#8b5cf6" },
                          { name: "Trade Started", value: mockLCs.filter(lc => lc.status === "trade-started").length, color: "#10b981" },
                          { name: "Completed", value: mockLCs.filter(lc => lc.status === "completed").length, color: "#6b7280" }
                        ].map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activities Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activities</CardTitle>
                <CardDescription>Latest actions and updates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockActivities.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-4 p-4 border rounded-lg">
                      <div className="mt-1">{activity.icon}</div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-gray-900 dark:text-white">{activity.action}</h4>
                          <span className="text-sm text-gray-500">{activity.timestamp}</span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{activity.details}</p>
                        <p className="text-xs text-gray-500 mt-1">By: {activity.user}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* LC Management Tab */}
          <TabsContent value="lc-management" className="space-y-6">
            {/* Create New LC Button */}
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Letter of Credit Management</h2>
              <Button 
                className="flex items-center gap-2"
                onClick={() => setShowLCForm(true)}
              >
                <Plus className="h-4 w-4" />
                Create New LC
              </Button>
            </div>

            {/* LC Documents Table */}
            <Card>
              <CardHeader>
                <CardTitle>My LC Documents</CardTitle>
                <CardDescription>Manage and track your letters of credit</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 mb-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search LCs..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="ai-verified">AI Verified</SelectItem>
                      <SelectItem value="pending-exporter">Pending Exporter</SelectItem>
                      <SelectItem value="pending-admin">Pending Admin</SelectItem>
                      <SelectItem value="on-chain">On-chain</SelectItem>
                      <SelectItem value="trade-started">Trade Started</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>LC ID</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Exporter</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>AI Score</TableHead>
                      <TableHead>Created On</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockLCs
                      .filter(lc => {
                        const matchesSearch = lc.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                             lc.exporter.toLowerCase().includes(searchTerm.toLowerCase())
                        const matchesStatus = filterStatus === "all" || lc.status === filterStatus
                        return matchesSearch && matchesStatus
                      })
                      .map((lc) => (
                        <TableRow key={lc.id}>
                          <TableCell className="font-medium">{lc.reference}</TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(lc.status)}>
                              {lc.status.replace("-", " ")}
                            </Badge>
                          </TableCell>
                          <TableCell>{lc.exporter}</TableCell>
                          <TableCell>${lc.amount.toLocaleString()}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="w-16 bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-green-600 h-2 rounded-full" 
                                  style={{ width: `${lc.aiScore}%` }}
                                ></div>
                              </div>
                              <span className="text-sm">{lc.aiScore}%</span>
                            </div>
                          </TableCell>
                          <TableCell>{lc.createdOn}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button variant="outline" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" size="sm">
                                <Download className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" size="sm">
                                <Edit className="h-4 w-4" />
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

          {/* Trade Management Tab */}
          <TabsContent value="trades" className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Trade Management</h2>
            
            {/* Ongoing Trades */}
            <Card>
              <CardHeader>
                <CardTitle>Ongoing Trades</CardTitle>
                <CardDescription>Track your active trade shipments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {mockTrades.map((trade) => (
                    <div key={trade.id} className="border rounded-lg p-6">
                      <div className="flex flex-col lg:flex-row justify-between gap-4">
                        <div className="flex-1 space-y-4">
                          <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold">Trade {trade.id}</h3>
                            <Badge className={getTradeStatusColor(trade.status)}>
                              {trade.status.replace("-", " ")}
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                            <div>
                              <span className="text-gray-500">LC ID:</span>
                              <p className="font-medium">{trade.lcId}</p>
                            </div>
                            <div>
                              <span className="text-gray-500">Exporter:</span>
                              <p className="font-medium">{trade.exporter}</p>
                            </div>
                            <div>
                              <span className="text-gray-500">Shipment Provider:</span>
                              <p className="font-medium">{trade.shipmentProvider}</p>
                            </div>
                            <div>
                              <span className="text-gray-500">Amount:</span>
                              <p className="font-medium">${trade.amount.toLocaleString()}</p>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Progress</span>
                              <span>{trade.progress}%</span>
                            </div>
                            <Progress value={trade.progress} className="h-2" />
                          </div>

                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-gray-500">Start Date:</span>
                              <p className="font-medium">{trade.startDate}</p>
                            </div>
                            <div>
                              <span className="text-gray-500">Estimated Delivery:</span>
                              <p className="font-medium">{trade.estimatedDelivery}</p>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col gap-2">
                          <Button variant="outline" className="flex items-center gap-2">
                            <Eye className="h-4 w-4" />
                            View Details
                          </Button>
                          <Button variant="outline" className="flex items-center gap-2">
                            <MessageSquare className="h-4 w-4" />
                            Contact
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payments Tab */}
          <TabsContent value="payments" className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Payment Management</h2>
            
            {/* Pending Payments */}
            <Card>
              <CardHeader>
                <CardTitle>Pending Payments</CardTitle>
                <CardDescription>Payments due for your trades</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Payment ID</TableHead>
                      <TableHead>Trade ID</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockPayments
                      .filter(payment => payment.status === "pending")
                      .map((payment) => (
                        <TableRow key={payment.id}>
                          <TableCell className="font-medium">{payment.id}</TableCell>
                          <TableCell>{payment.tradeId}</TableCell>
                          <TableCell>${payment.amount.toLocaleString()}</TableCell>
                          <TableCell>{payment.dueDate}</TableCell>
                          <TableCell>
                            <Badge className={getPaymentStatusColor(payment.status)}>
                              {payment.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button className="flex items-center gap-2">
                              <CreditCard className="h-4 w-4" />
                              Pay Now
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Completed Payments */}
            <Card>
              <CardHeader>
                <CardTitle>Completed Payments</CardTitle>
                <CardDescription>Payment history and transaction records</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  <Receipt className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p>No completed payments yet</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Notifications & Messages</h2>
            
            {/* Notifications Panel */}
            <Card>
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>Stay updated with your LC and trade activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockNotifications.map((notification) => (
                    <div 
                      key={notification.id} 
                      className={`flex items-start gap-4 p-4 border rounded-lg ${
                        !notification.read ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                      }`}
                    >
                      <div className="mt-1">
                        <Bell className={`h-5 w-5 ${!notification.read ? 'text-blue-500' : 'text-gray-400'}`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-gray-900 dark:text-white">{notification.title}</h4>
                          <span className="text-sm text-gray-500">{notification.timestamp}</span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{notification.message}</p>
                        {!notification.read && (
                          <Badge variant="secondary" className="mt-2">New</Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Chat/Message Tab */}
            <Card>
              <CardHeader>
                <CardTitle>Messages</CardTitle>
                <CardDescription>Communicate with exporters and shipment providers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p>No messages yet</p>
                  <Button className="mt-4" variant="outline">
                    <Send className="h-4 w-4 mr-2" />
                    Start Conversation
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Profile & Settings</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Importer Profile */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Importer Profile
                  </CardTitle>
                  <CardDescription>Your company and contact information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="company">Company Name</Label>
                    <Input id="company" defaultValue="Global Import Solutions Ltd." />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" defaultValue="contact@globalimport.com" />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" defaultValue="+1 (555) 123-4567" />
                  </div>
                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Textarea id="address" defaultValue="123 Business Ave, Suite 100, New York, NY 10001" />
                  </div>
                  <Button>Update Profile</Button>
                </CardContent>
              </Card>

              {/* Wallet Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Wallet className="h-5 w-5" />
                    Wallet Information
                  </CardTitle>
                  <CardDescription>Your connected wallet and blockchain details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="wallet">Wallet Address</Label>
                    <div className="flex gap-2">
                      <Input id="wallet" defaultValue="0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6" readOnly />
                      <Button variant="outline" size="sm">
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="network">Network</Label>
                    <Input id="network" defaultValue="Ethereum Mainnet" readOnly />
                  </div>
                  <div>
                    <Label htmlFor="balance">Balance</Label>
                    <Input id="balance" defaultValue="0.0 ETH" readOnly />
                  </div>
                  <Button variant="outline" className="w-full">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View on Explorer
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Analytics & Reports */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Analytics & Reports
                </CardTitle>
                <CardDescription>Download reports and view analytics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button variant="outline" className="flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    Export LC Report
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    Export Trade Report
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    Export Payment Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
