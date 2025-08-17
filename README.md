<div align="center">
  <img src="public/fast-lc.png" alt="Fast LC Logo" width="200" height="200">
  <h1>🚢 Fast LC - Letter of Credit Management System</h1>
  <p><strong>Complete End-to-End Trade Finance Platform using Avalanche Blockchain</strong></p>
  
  [![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
  [![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)](https://reactjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
  [![Zustand](https://img.shields.io/badge/Zustand-4.4-purple?style=for-the-badge)](https://zustand-demo.pmnd.rs/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.3-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
</div>

---

## 🌟 **Platform Overview**

**Fast LC** is a comprehensive **Letter of Credit Management System** that streamlines the entire trade finance workflow from LC creation to shipment completion. Built with modern web technologies, it provides real-time collaboration across all stakeholders with instant state synchronization.

### ✨ **Key Features**
- 🔄 **Real-Time State Management** - Instant updates across all dashboards
- 👥 **Role-Based Access Control** - Separate interfaces for each stakeholder
- 📄 **Complete LC Lifecycle** - From creation to shipment completion
- 📁 **Document Management** - Upload, categorize, and track trade documents
- 🚀 **Interactive Demo System** - End-to-end workflow demonstration
- 💾 **Session Persistence** - Data maintained across browser sessions

---

## 🏗️ **System Architecture**

### **User Roles & Dashboards**
- **🛒 Importer Dashboard** - Create and manage Letters of Credit
- **📤 Exporter Dashboard** - Submit required trade documents
- **👨‍💼 Admin Dashboard** - Review, approve, and push to blockchain
- **🚚 Shipment Dashboard** - Track logistics and update shipment status

### **Technology Stack**
- **Frontend**: Next.js 14, React 18, TypeScript
- **State Management**: Zustand with localStorage persistence
- **Styling**: Tailwind CSS, shadcn/ui components
- **File Handling**: jsPDF, JSZip, File-Saver
- **Icons**: Lucide React icon library

---

## 🚀 **Quick Start**

### **Prerequisites**
- Node.js 18+ and npm/yarn
- Modern web browser with localStorage support

### **Installation**
```bash
# Clone the repository
git clone <repository-url>
cd fast-lc

# Install dependencies
npm install

# Start development server
npm run dev
```

### **Access the Platform**
- **Main Application**: [http://localhost:3000](http://localhost:3000)
- **Importer Dashboard**: [http://localhost:3000/importer-dashboard](http://localhost:3000/importer-dashboard)
- **Exporter Dashboard**: [http://localhost:3000/exporter-dashboard](http://localhost:3000/exporter-dashboard)
- **Admin Dashboard**: [http://localhost:3000/admin-dashboard](http://localhost:3000/admin-dashboard)
- **Shipment Dashboard**: [http://localhost:3000/shipment-dashboard](http://localhost:3000/shipment-dashboard)

---

## 🔄 **Complete LC Workflow**

### **1. LC Creation (Importer)**
```
📝 Fill LC Form → 📄 Generate PDF Draft → ✅ Status: "CREATED"
```
- Comprehensive LC form with validation
- Automatic PDF generation
- Real-time status updates

### **2. Document Submission (Exporter)**
```
📁 Upload Documents → 🏷️ Categorize Files → 📤 Submit for Review → ✅ Status: "AWAITING_ADMIN_REVIEW"
```
- Drag & drop file upload
- Document type categorization
- File validation and preview

### **3. Admin Review & Approval**
```
👀 Review Documents → ✅ Approve LC → ⛓️ Push to Blockchain → ✅ Status: "ONCHAIN"
```
- Document review interface
- LC approval workflow
- Blockchain integration simulation
- ZIP download of all documents

### **4. Shipment Management**
```
🚚 Initiate Shipment → 📦 Track Progress → 🎯 Complete Delivery → ✅ Status: "SHIPMENT_COMPLETED"
```
- Shipment status updates
- Progress tracking with timestamps
- Real-time notifications

---

## 🎯 **Interactive Demo System**

Experience the complete LC lifecycle with our **Interactive Demo System**:

- **Step-by-Step Flow**: Automated demonstration of all workflow stages
- **Real-Time Progress**: Visual tracking through each step
- **Dashboard Access**: Direct links to all user interfaces
- **State Monitoring**: Live view of application state changes

**Start the Demo**: Navigate to `/demo` and click "Start Demo" to see the complete flow in action!

---

## 🏛️ **State Management Architecture**

### **Centralized Zustand Store**
```typescript
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
}
```

### **Real-Time Synchronization**
- **Single Source of Truth**: All data flows through Zustand store
- **Instant Updates**: Changes reflect immediately across all dashboards
- **Session Persistence**: Data maintained in localStorage
- **No Page Refresh**: Seamless user experience

---

## 📁 **Document Management System**

### **Supported File Types**
- **Documents**: PDF, DOCX, TXT
- **Images**: JPG, JPEG, PNG
- **Size Limits**: Up to 10MB per file

### **Document Categories**
- Commercial Invoice
- Bill of Lading
- Airway Bill
- Insurance Certificate
- Packing List
- Certificate of Origin

### **Features**
- **Drag & Drop Upload**: Modern file handling interface
- **Type Categorization**: Automatic document type assignment
- **ZIP Export**: Bulk download of all documents
- **File Validation**: Size and format checking

---

## 🎨 **User Interface Features**

### **Responsive Design**
- **Dark Mode**: Built-in theme support
- **Accessibility**: WCAG compliant components

### **Interactive Elements**
- **Real-Time Tables**: Live data updates
- **Status Indicators**: Color-coded status badges
- **Progress Tracking**: Visual workflow progression
- **Toast Notifications**: User feedback system

---

## 🔧 **Development & Customization**

### **Project Structure**
```
fast-lc/
├── app/                           # Next.js 14 app router
│   ├── demo/                     # Interactive demo system
│   ├── importer-dashboard/       # Importer interface
│   ├── exporter-dashboard/       # Exporter interface
│   ├── admin-dashboard/          # Admin interface
│   └── shipment-dashboard/       # Shipment interface
├── components/                    # React components
│   ├── ui/                       # Shared UI components
│   ├── importer-dashboard/       # Importer components
│   ├── exporter-dashboard/       # Exporter components
│   ├── admin-dashboard/          # Admin components
│   └── shipment-dashboard/       # Shipment components
├── lib/                          # Utilities and store
│   └── store.ts                  # Zustand store implementation
├── hooks/                        # Custom React hooks
├── types/                        # TypeScript type definitions
└── public/                       # Static assets
```

### **Key Components**
- **LC Form**: Comprehensive Letter of Credit creation
- **Document Upload**: Multi-file upload with categorization
- **Admin Review**: Document review and approval interface
- **Shipment Tracking**: Logistics management and status updates

---

## 🚀 **Getting Started Guide**

### **1. Explore the Demo**
Start with the interactive demo to understand the complete workflow:
```bash
npm run dev
# Navigate to /demo
# Click "Start Demo" to see the full flow
```

### **2. Test Different Roles**
Experience each dashboard from different user perspectives:
- **Importer**: Create new LCs and manage existing ones
- **Exporter**: Upload documents for pending LCs
- **Admin**: Review and approve submitted documents
- **Shipment Provider**: Track and update shipment status

### **3. Understand State Flow**
Watch how data flows in real-time across all dashboards:
- Create an LC as an importer
- Switch to exporter dashboard to see the new LC
- Submit documents and watch admin dashboard update
- Approve LC and see shipment dashboard notification

---

## 🎯 **Use Cases**

### **Trade Finance Companies**
- Streamline LC creation and management
- Track document submission progress
- Monitor approval workflows
- Manage shipment logistics

### **Import/Export Businesses**
- Create and manage LCs efficiently
- Submit required documents
- Track approval status
- Monitor shipment progress

### **Financial Institutions**
- Review and approve LCs
- Manage document verification
- Track blockchain integration
- Monitor compliance

---

## 🛠️ **Technical Implementation**

### **State Management Pattern**
```
Component → useLCStore() → Zustand Store → localStorage → Component Re-render
```

### **Data Flow Architecture**
```
User Action → Store Update → State Change → All Subscribers Update → UI Refresh
```

### **Performance Optimizations**
- **Selective Re-renders**: Components only update when relevant state changes
- **Efficient Updates**: Minimal state mutations
- **Memory Management**: Automatic cleanup of unused state

---

## 🔮 **Future Enhancements**

### **Planned Features**
- **Real Blockchain Integration**: Connect to actual Avalanche Mainnet Network
- **Multi-Currency Support**: Support for different currencies for payments
- **Advanced Analytics**: Business intelligence and reporting
- **API Integration**: Connect with external systems
- **Mobile Application**: Native mobile app development

---

## 🤝 **Contributing**

We welcome contributions! Please see our contributing guidelines:

1. **Fork** the repository
2. **Create** a feature branch
3. **Make** your changes
4. **Test** thoroughly
5. **Submit** a pull request

---

## 📄 **License**

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🙏 **Acknowledgments**

- **Next.js Team** for the amazing framework
- **Zustand** for lightweight state management
- **shadcn/ui** for beautiful components
- **Tailwind CSS** for utility-first styling
- **Lucide** for beautiful icons

---

<div align="center">
  <p><strong>Built with ❤️ from Enlighten</strong></p>
  <p>Experience the future of Letter of Credit management today!</p>
</div>
