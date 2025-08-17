import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Types for the complete LC flow
export interface LCFormData {
  // Applicant (Importer) Details
  applicantName: string
  applicantAddress: string
  contactPerson: string
  contactEmail: string
  contactPhone: string

  // Beneficiary (Exporter) Details
  beneficiaryName: string
  beneficiaryAddress: string
  beneficiaryCountry: string

  // LC Details
  lcType: string
  lcAmount: string
  currency: string
  expiryDate: Date | undefined
  placeOfExpiry: string

  // Banking Details
  applicantBankName: string
  beneficiaryBankName: string
  swiftCode: string

  // Trade Details
  descriptionOfGoods: string
  quantity: string
  unit: string
  incoterms: string
  portOfLoading: string
  portOfDischarge: string
  latestShipmentDate: Date | undefined
}

export interface LC {
  id: string
  reference: string
  formData: LCFormData
  status: 'CREATED' | 'AWAITING_EXPORTER_DOCS' | 'AWAITING_ADMIN_REVIEW' | 'ONCHAIN' | 'SHIPMENT_INITIATED' | 'SHIPMENT_IN_TRANSIT' | 'SHIPMENT_COMPLETED'
  createdAt: Date
  updatedAt: Date
  createdBy: string
  exporterDocs?: ExporterDocuments
  adminReview?: AdminReview
  shipment?: ShipmentStatus
  onchain?: OnchainData
}

export interface ExporterDocuments {
  id: string
  lcId: string
  status: 'PENDING' | 'SUBMITTED' | 'REJECTED'
  documents: Document[]
  submittedAt?: Date
  submittedBy: string
}

export interface Document {
  id: string
  type: 'INVOICE' | 'BILL_OF_LADING' | 'AIRWAY_BILL' | 'INSURANCE' | 'PACKING_LIST' | 'CERTIFICATE_OF_ORIGIN' | 'OTHER'
  name: string
  file: File
  uploadedAt: Date
  uploadedBy: string
  fileSize: number
  mimeType: string
}

export interface AdminReview {
  id: string
  lcId: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  reviewedAt?: Date
  reviewedBy: string
  comments?: string
  onchainTxHash?: string
  onchainBlockNumber?: string
  onchainTimestamp?: Date
}

export interface OnchainData {
  txHash: string
  blockNumber: string
  timestamp: Date
  network: string
  gasUsed: string
  gasPrice: string
}

export interface ShipmentStatus {
  id: string
  lcId: string
  status: 'INITIATED' | 'IN_TRANSIT' | 'COMPLETED'
  provider: string
  trackingNumber?: string
  initiatedAt?: Date
  inTransitAt?: Date
  completedAt?: Date
  estimatedDelivery?: Date
  actualDelivery?: Date
  notes?: string
}

export interface Notification {
  id: string
  type: 'LC_CREATED' | 'EXPORTER_DOCS_SUBMITTED' | 'ADMIN_APPROVED' | 'SHIPMENT_STARTED' | 'SHIPMENT_COMPLETED'
  title: string
  message: string
  timestamp: Date
  read: boolean
  lcId: string
}

// Store interface
interface LCStore {
  // State
  lcs: LC[]
  notifications: Notification[]
  currentUser: string
  userRole: 'IMPORTER' | 'EXPORTER' | 'ADMIN' | 'SHIPMENT_PROVIDER'

  // Actions
  createLC: (formData: LCFormData, userId: string) => LC
  submitExporterDocs: (lcId: string, documents: Document[], userId: string) => void
  approveLC: (lcId: string, adminId: string, onchainData: OnchainData) => void
  updateShipmentStatus: (lcId: string, status: ShipmentStatus['status'], provider: string, notes?: string) => void
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void
  markNotificationAsRead: (notificationId: string) => void
  setUserRole: (role: LCStore['userRole']) => void
  setCurrentUser: (user: string) => void
  
  // Computed
  getLCById: (id: string) => LC | undefined
  getLCsByStatus: (status: LC['status']) => LC[]
  getLCsByUser: (userId: string) => LC[]
  getPendingNotifications: () => Notification[]
}

// Create the store
export const useLCStore = create<LCStore>()(
  persist(
    (set, get) => ({
      // Initial state
      lcs: [],
      notifications: [],
      currentUser: '',
      userRole: 'IMPORTER',

      // Actions
      createLC: (formData: LCFormData, userId: string) => {
        const newLC: LC = {
          id: `LC-${Date.now()}`,
          reference: `IMP-${Date.now()}`,
          formData,
          status: 'CREATED',
          createdAt: new Date(),
          updatedAt: new Date(),
          createdBy: userId
        }

        set((state) => ({
          lcs: [...state.lcs, newLC],
          notifications: [
            ...state.notifications,
            {
              id: `notif-${Date.now()}`,
              type: 'LC_CREATED',
              title: 'New LC Created',
              message: `Letter of Credit ${newLC.reference} has been created successfully.`,
              timestamp: new Date(),
              read: false,
              lcId: newLC.id
            }
          ]
        }))

        return newLC
      },

      submitExporterDocs: (lcId: string, documents: Document[], userId: string) => {
        const exporterDocs: ExporterDocuments = {
          id: `docs-${Date.now()}`,
          lcId,
          status: 'SUBMITTED',
          documents,
          submittedAt: new Date(),
          submittedBy: userId
        }

        set((state) => ({
          lcs: state.lcs.map(lc => 
            lc.id === lcId 
              ? { 
                  ...lc, 
                  status: 'AWAITING_ADMIN_REVIEW',
                  exporterDocs,
                  updatedAt: new Date()
                }
              : lc
          ),
          notifications: [
            ...state.notifications,
            {
              id: `notif-${Date.now()}`,
              type: 'EXPORTER_DOCS_SUBMITTED',
              title: 'Exporter Documents Submitted',
              message: `Documents for LC ${lcId} have been submitted and are awaiting admin review.`,
              timestamp: new Date(),
              read: false,
              lcId
            }
          ]
        }))
      },

      approveLC: (lcId: string, adminId: string, onchainData: OnchainData) => {
        const adminReview: AdminReview = {
          id: `review-${Date.now()}`,
          lcId,
          status: 'APPROVED',
          reviewedAt: new Date(),
          reviewedBy: adminId,
          onchainTxHash: onchainData.txHash,
          onchainBlockNumber: onchainData.blockNumber,
          onchainTimestamp: onchainData.timestamp
        }

        set((state) => ({
          lcs: state.lcs.map(lc => 
            lc.id === lcId 
              ? { 
                  ...lc, 
                  status: 'ONCHAIN',
                  adminReview,
                  onchain: onchainData,
                  updatedAt: new Date()
                }
              : lc
          ),
          notifications: [
            ...state.notifications,
            {
              id: `notif-${Date.now()}`,
              type: 'ADMIN_APPROVED',
              title: 'LC Approved and On-chain',
              message: `LC ${lcId} has been approved and is now on the blockchain.`,
              timestamp: new Date(),
              read: false,
              lcId
            }
          ]
        }))
      },

      updateShipmentStatus: (lcId: string, status: ShipmentStatus['status'], provider: string, notes?: string) => {
        const now = new Date()
        let shipment: ShipmentStatus

        set((state) => {
          const existingLC = state.lcs.find(lc => lc.id === lcId)
          if (!existingLC) return state

          if (existingLC.shipment) {
            // Update existing shipment
            shipment = {
              ...existingLC.shipment,
              status,
              updatedAt: now
            }

            // Update timestamps based on status
            if (status === 'INITIATED' && !existingLC.shipment.initiatedAt) {
              shipment.initiatedAt = now
            } else if (status === 'IN_TRANSIT' && !existingLC.shipment.inTransitAt) {
              shipment.inTransitAt = now
            } else if (status === 'COMPLETED' && !existingLC.shipment.completedAt) {
              shipment.completedAt = now
              shipment.actualDelivery = now
            }
          } else {
            // Create new shipment
            shipment = {
              id: `shipment-${Date.now()}`,
              lcId,
              status,
              provider,
              initiatedAt: status === 'INITIATED' ? now : undefined,
              inTransitAt: status === 'IN_TRANSIT' ? now : undefined,
              completedAt: status === 'COMPLETED' ? now : undefined,
              notes
            }
          }

          // Update LC status based on shipment status
          let newLCStatus: LC['status'] = existingLC.status
          if (status === 'INITIATED') newLCStatus = 'SHIPMENT_INITIATED'
          else if (status === 'IN_TRANSIT') newLCStatus = 'SHIPMENT_IN_TRANSIT'
          else if (status === 'COMPLETED') newLCStatus = 'SHIPMENT_COMPLETED'

          return {
            lcs: state.lcs.map(lc => 
              lc.id === lcId 
                ? { 
                    ...lc, 
                    status: newLCStatus,
                    shipment,
                    updatedAt: now
                  }
                : lc
            ),
            notifications: [
              ...state.notifications,
              {
                id: `notif-${Date.now()}`,
                type: status === 'INITIATED' ? 'SHIPMENT_STARTED' : 
                       status === 'COMPLETED' ? 'SHIPMENT_COMPLETED' : 'SHIPMENT_STARTED',
                title: `Shipment ${status.replace('_', ' ').toLowerCase()}`,
                message: `Shipment for LC ${lcId} has been ${status.toLowerCase().replace('_', ' ')}.`,
                timestamp: now,
                read: false,
                lcId
              }
            ]
          }
        })
      },

      addNotification: (notification) => {
        set((state) => ({
          notifications: [
            ...state.notifications,
            {
              ...notification,
              id: `notif-${Date.now()}`,
              timestamp: new Date()
            }
          ]
        }))
      },

      markNotificationAsRead: (notificationId: string) => {
        set((state) => ({
          notifications: state.notifications.map(notif =>
            notif.id === notificationId ? { ...notif, read: true } : notif
          )
        }))
      },

      setUserRole: (role) => {
        set({ userRole: role })
      },

      setCurrentUser: (user) => {
        set({ currentUser: user })
      },

      // Computed getters
      getLCById: (id: string) => {
        return get().lcs.find(lc => lc.id === id)
      },

      getLCsByStatus: (status: LC['status']) => {
        return get().lcs.filter(lc => lc.status === status)
      },

      getLCsByUser: (userId: string) => {
        return get().lcs.filter(lc => lc.createdBy === userId)
      },

      getPendingNotifications: () => {
        return get().notifications.filter(notif => !notif.read)
      }
    }),
    {
      name: 'lc-store',
      partialize: (state) => ({
        lcs: state.lcs,
        notifications: state.notifications,
        currentUser: state.currentUser,
        userRole: state.userRole
      })
    }
  )
)
