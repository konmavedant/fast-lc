"use client"

import { useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { 
  Upload, 
  FileText, 
  X, 
  CheckCircle, 
  AlertCircle, 
  Download,
  Eye,
  Trash2,
  Send,
  ArrowLeft
} from "lucide-react"
import { useLCStore, Document, LC } from "@/lib/store"
import { useToast } from "@/hooks/use-toast"

interface DocumentUploadProps {
  lc: LC
  onBack: () => void
}

const documentTypes = [
  { value: 'INVOICE', label: 'Commercial Invoice' },
  { value: 'BILL_OF_LADING', label: 'Bill of Lading' },
  { value: 'AIRWAY_BILL', label: 'Airway Bill' },
  { value: 'INSURANCE', label: 'Insurance Certificate' },
  { value: 'PACKING_LIST', label: 'Packing List' },
  { value: 'CERTIFICATE_OF_ORIGIN', label: 'Certificate of Origin' },
  { value: 'OTHER', label: 'Other Document' }
]

export default function DocumentUpload({ lc, onBack }: DocumentUploadProps) {
  const [documents, setDocuments] = useState<Document[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const { submitExporterDocs, setCurrentUser } = useLCStore()
  const { toast } = useToast()

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    Array.from(files).forEach(file => {
      const document: Document = {
        id: `doc-${Date.now()}-${Math.random()}`,
        type: 'OTHER',
        name: file.name,
        file,
        uploadedAt: new Date(),
        uploadedBy: 'exporter-user-001',
        fileSize: file.size,
        mimeType: file.type
      }
      
      setDocuments(prev => [...prev, document])
    })

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const removeDocument = (docId: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== docId))
  }

  const updateDocumentType = (docId: string, type: Document['type']) => {
    setDocuments(prev => prev.map(doc => 
      doc.id === docId ? { ...doc, type } : doc
    ))
  }

  const handleSubmit = async () => {
    if (documents.length === 0) {
      toast({
        title: "No Documents",
        description: "Please upload at least one document before submitting.",
        variant: "destructive"
      })
      return
    }

    setIsSubmitting(true)
    
    try {
      // Set current user
      setCurrentUser("exporter-user-001")
      
      // Submit documents
      submitExporterDocs(lc.id, documents, "exporter-user-001")
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      setIsSubmitting(false)
      setIsSuccess(true)
      
      toast({
        title: "Documents Submitted Successfully!",
        description: `Documents for LC ${lc.reference} have been submitted and are awaiting admin review.`,
      })
      
      // Reset after 3 seconds
      setTimeout(() => {
        setIsSuccess(false)
        onBack()
      }, 3000)
      
    } catch (error) {
      setIsSubmitting(false)
      toast({
        title: "Error Submitting Documents",
        description: "There was an error submitting the documents. Please try again.",
        variant: "destructive"
      })
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Documents Submitted!</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Your documents have been submitted successfully and are now awaiting admin review.
            </p>
            <Button onClick={onBack} className="w-full">
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button 
            variant="outline" 
            onClick={onBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
          <div className="text-right">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Submit Documents</h1>
            <p className="text-gray-600 dark:text-gray-400">
              LC {lc.reference} - {lc.formData.beneficiaryName}
            </p>
          </div>
        </div>

        {/* LC Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              LC Summary
            </CardTitle>
            <CardDescription>Letter of Credit details for document submission</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <Label className="text-sm font-medium text-gray-500">LC Reference</Label>
                <p className="text-lg font-semibold">{lc.reference}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">Amount</Label>
                <p className="text-lg font-semibold">
                  {lc.formData.currency} {lc.formData.lcAmount}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">Status</Label>
                <Badge variant="secondary">{lc.status.replace('_', ' ')}</Badge>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">Importer</Label>
                <p className="font-medium">{lc.formData.applicantName}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">Goods Description</Label>
                <p className="font-medium">{lc.formData.descriptionOfGoods}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">Created</Label>
                <p className="font-medium">{lc.createdAt.toLocaleDateString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Document Upload */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Upload Required Documents
            </CardTitle>
            <CardDescription>
              Upload all required documents for this Letter of Credit. Make sure documents are clear and legible.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* File Upload Area */}
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Drop files here or click to upload
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                Supported formats: PDF, JPG, PNG, DOC, DOCX (Max 10MB per file)
              </p>
              <Button 
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2"
              >
                <Upload className="h-4 w-4" />
                Choose Files
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>

            {/* Uploaded Documents Table */}
            {documents.length > 0 && (
              <div>
                <h4 className="text-lg font-medium mb-4">Uploaded Documents</h4>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Document Type</TableHead>
                      <TableHead>File Name</TableHead>
                      <TableHead>Size</TableHead>
                      <TableHead>Uploaded</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {documents.map((doc) => (
                      <TableRow key={doc.id}>
                        <TableCell>
                          <Select 
                            value={doc.type} 
                            onValueChange={(value: Document['type']) => updateDocumentType(doc.id, value)}
                          >
                            <SelectTrigger className="w-48">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {documentTypes.map((type) => (
                                <SelectItem key={type.value} value={type.value}>
                                  {type.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell className="font-medium">{doc.name}</TableCell>
                        <TableCell>{formatFileSize(doc.fileSize)}</TableCell>
                        <TableCell>{doc.uploadedAt.toLocaleString()}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => removeDocument(doc.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}

            {/* Submit Button */}
            {documents.length > 0 && (
              <div className="flex justify-end">
                <Button 
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-8 py-3"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5" />
                      Submit Documents
                    </>
                  )}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Required Documents Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Required Documents
            </CardTitle>
            <CardDescription>Documents typically required for Letter of Credit processing</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900 dark:text-white">Essential Documents</h4>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Commercial Invoice
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Bill of Lading or Airway Bill
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Insurance Certificate
                  </li>
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900 dark:text-white">Additional Documents</h4>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Packing List
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Certificate of Origin
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Quality Certificates
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
