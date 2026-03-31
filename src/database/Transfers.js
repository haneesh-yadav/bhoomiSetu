export const TRANSFER_STATUS = {
  DRAFT:            "Draft",
  SUBMITTED:        "Submitted",
  BUYER_CONFIRMED:  "Buyer Confirmed",
  REGISTRAR_REVIEW: "Under Review",
  APPROVED:         "Approved",
  REJECTED:         "Rejected",
  COMPLETED:        "Completed",
};


export const MOCK_TRANSFERS = [
  {
    id:           "TXN-2026-001",
    propertyId:   "HR-790-GUR-2026",
    propertyTitle:"Residential Plot — Sushant lok",
    sellerId:     "USR-001",
    sellerName:   "Haneesh Yadav",
    buyerId:      "USR-002",
    buyerName:    "Avishek Nandi",
    buyerAadhaar: "XXXX XXXX 5751",
    registrarId:  "REG-001",
    saleValue:    "₹85,00,000",
    status:       "Completed",
    statusColor:  "#2EC4A0",
    initiatedOn:  "25 March 2026",
    completedOn:  "27 March 2026",
    timeline: [
      { step:"Transfer Initiated",        date:"10 Jan 2024", done:true,  actor:"Haneesh Yadav"             },
      { step:"Buyer Confirmation",        date:"10 Jan 2024", done:true,  actor:"Avishek Nandi"            },
      { step:"Documents Submitted",       date:"10 Jan 2024", done:true,  actor:"Haneesh Yadav"             },
      { step:"Registrar Review",          date:"11 Jan 2024", done:true,  actor:"Registrar Virat" },
      { step:"Approved & Ledger Updated", date:"12 Jan 2024", done:true,  actor:"Registrar Virat" },
    ],
    documents: ["Sale Deed", "Encumbrance Certificate", "Identity Proof (Aadhaar)"],
    notes: "Transfer completed successfully. Ownership updated in blockchain ledger.",
  },
  {
    id:           "TXN-2026-002",
    propertyId:   "HR-0008-REW-2026",
    propertyTitle:"Agricultural Land — Musepur",
    sellerId:     "USR-001",
    sellerName:   "Haneesh Yadav",
    buyerId:      null,
    buyerName:    "Pending",
    buyerAadhaar: null,
    registrarId:  null,
    saleValue:    "₹42,00,000",
    status:       "Draft",
    statusColor:  "#F0A030",
    initiatedOn:  "15 Mar 2024",
    completedOn:  null,
    timeline: [
      { step:"Transfer Initiated",        date:"15 Mar 2024", done:true,  actor:"Haneesh Yadav" },
      { step:"Buyer Confirmation",        date:null,          done:false, actor:null         },
      { step:"Documents Submitted",       date:null,          done:false, actor:null         },
      { step:"Registrar Review",          date:null,          done:false, actor:null         },
      { step:"Approved & Ledger Updated", date:null,          done:false, actor:null         },
    ],
    documents: [],
    notes: "Awaiting buyer confirmation.",
  },
];


export const MOCK_PENDING_APPROVALS = [
  {
    id:            "TXN-2026-003",
    propertyId:    "DL-0003-ROHINI-2026",
    propertyTitle: "Residential House — Delhi",
    type:          "Residential",
    area:          "1,800 sq.ft.",
    district:      "Delhi",
    sellerName:    "Vineet Yadav",
    sellerAadhaar: "XXXX XXXX 1234",
    buyerName:     "Kunal Yadav",
    buyerAadhaar:  "XXXX XXXX 5678",
    saleValue:     "₹55,00,000",
    submittedOn:   "18 Mar 2024",
    documents:     ["Sale Deed", "EC", "Patta"],
    priority:      "Normal",
    status:        "Under Review",
    statusColor:   "#C8F135",
    notes:         "",
    surveyNo:      "9901/B",
  },
  {
    id:            "TXN-2026-004",
    propertyId:    "HR-0004-lyari-2026",
    propertyTitle: "Agricultural Plot — lyari",
    type:          "Agricultural",
    area:          "2.4 Acres",
    district:      "Lyari",
    sellerName:    "Hamza Ali Mazari",
    sellerAadhaar: "XXXX XXXX 9012",
    buyerName:     "Majoor Iqbal",
    buyerAadhaar:  "XXXX XXXX 3456",
    saleValue:     "₹18,00,000",
    submittedOn:   "19 Mar 2026",
    documents:     ["Sale Deed", "Chitta", "Adangal"],
    priority:      "High",
    status:        "Under Review",
    statusColor:   "#F07060",
    notes:         "",
    surveyNo:      "3345/A",
  },
  {
    id:            "TXN-2026-005",
    propertyId:    "DL-0005-IG-2021",
    propertyTitle: "Commercial Complex — India Gate",
    type:          "Commercial",
    area:          "4,200 sq.ft.",
    district:      "Delhi",
    sellerName:    "Narendra Modi",
    sellerAadhaar: "XXXX XXXX 7890",
    buyerName:     "Amit shah",
    buyerAadhaar:  "XXXX XXXX 2345",
    saleValue:     "₹1,20,00,000",
    submittedOn:   "16 Mar 2024",
    documents:     ["Sale Deed", "EC", "NOC", "Company Registration"],
    priority:      "High",
    status:        "Under Review",
    statusColor:   "#F07060",
    notes:         "",
    surveyNo:      "6621/C",
  },
];


export const MOCK_COMPLETED_APPROVALS = [
  {
    id:            "TXN-2026-001",
    propertyTitle: "Residential Plot — Sushant lok",
    sellerName:    "Haneesh Yadav",
    buyerName:     "Avishek Nandi",
    saleValue:     "₹85,00,000",
    completedOn:   "24 March 2026",
    status:        "Approved",
    statusColor:   "#2EC4A0",
  },
  {
    id:            "TXN-2026-000",
    propertyTitle: "House — Delhi",
    sellerName:    "Uzair Baloch",
    buyerName:     "Rehman Dakait",
    saleValue:     "₹62,00,000",
    completedOn:   "19 March 2026",
    status:        "Approved",
    statusColor:   "#2EC4A0",
  },
];


export const MOCK_REGISTRAR_DISPUTES = [
  {
    id:          "DSP-2026-001",
    propertyId:  "HR-0001-MDU-2026",
    propertyTitle: "Commercial Shop — Madurai Market",
    type:        "Encumbrance Dispute",
    filer:       "Haneesh Yadav",
    description: "Incorrect encumbrance recorded against property. Owner claims no outstanding loans.",
    status:      "Under Investigation",
    statusColor: "#F0A030",
    filedOn:     "02 Sep 2023",
    evidence:    ["Bank Statement", "NOC from Bank"],
    priority:    "Normal",
  },
  {
    id:          "DSP-2026-002",
    propertyId:  "HR-0002-LYARI-2026",
    propertyTitle: "Residential Flat — Lyari",
    type:        "Ownership Dispute",
    filer:       "Jameel",
    description: "Claimant disputes current ownership citing an unregistered sale agreement from 2019.",
    status:      "Pending Review",
    statusColor: "#F07060",
    filedOn:     "19 March 2026",
    evidence:    ["Sale Agreement (2019)", "Court Order Copy"],
    priority:    "High",
  },
];


export const MOCK_MUTATION_REQUESTS = [
  {
    id:           "MUT-2024-001",
    propertyId:   "TN-4521-CHN-2019",
    propertyTitle:"Residential Plot — Anna Nagar",
    type:         "Inheritance",
    filer:        "Priya Mehta",
    reason:       "Transfer to legal heir — owner deceased",
    status:       "Pending Review",
    statusColor:  "#F0A030",
    submittedOn:  "10 Mar 2024",
    documents:    ["Death Certificate", "Legal Heir Certificate"],
  },
];


export const MOCK_AUDIT_LOG = [
  { id:"AUD-001", action:"Transfer Approved",         txnId:"TXN-2024-001", propertyId:"TN-4521-CHN-2019", propertyTitle:"Residential Plot — Anna Nagar",      actor:"Sub-Registrar Krishnan", role:"registrar", timestamp:"12 Jan 2024, 02:45 PM", category:"approval",  notes:"All documents verified. Ownership updated on ledger.", hash:"0x3f9a...c4e5" },
  { id:"AUD-002", action:"Review Started",            txnId:"TXN-2024-004", propertyId:"TN-3345-SLM-2020", propertyTitle:"Agricultural Plot — Salem",           actor:"Sub-Registrar Krishnan", role:"registrar", timestamp:"17 Mar 2024, 10:12 AM", category:"review",    notes:"High priority — started document verification.",       hash:"0xa1b2...ef01" },
  { id:"AUD-003", action:"Clarification Requested",  txnId:"TXN-2024-003", propertyId:"TN-9901-TRY-2022", propertyTitle:"Residential House — Trichy",           actor:"Sub-Registrar Krishnan", role:"registrar", timestamp:"18 Mar 2024, 11:30 AM", category:"clarify",   notes:"Patta document appears outdated. Requested fresh copy.", hash:"0x7f8e...f6e5" },
  { id:"AUD-004", action:"Dispute Investigation",    txnId:"DSP-2024-002", propertyId:"TN-5523-CBE-2020", propertyTitle:"Residential Flat — Coimbatore",        actor:"Sub-Registrar Krishnan", role:"registrar", timestamp:"14 Feb 2024, 03:15 PM", category:"dispute",   notes:"High priority ownership dispute opened for investigation.", hash:"0x9d0c...e1d2" },
  { id:"AUD-005", action:"Mutation Approved",        txnId:"MUT-2023-001", propertyId:"TN-1182-CBE-2018", propertyTitle:"Agricultural Land — Saravanampatti",   actor:"Sub-Registrar Krishnan", role:"registrar", timestamp:"05 Dec 2023, 04:00 PM", category:"mutation",  notes:"Inheritance claim verified. Survey updated.",           hash:"0xc3d4...7a8b" },
  { id:"AUD-006", action:"Transfer Approved",        txnId:"TXN-2024-000", propertyId:"TN-0012-TAM-2020", propertyTitle:"House — Tambaram",                     actor:"Sub-Registrar Krishnan", role:"registrar", timestamp:"08 Jan 2024, 01:20 PM", category:"approval",  notes:"Clean title. Transfer completed without issues.",       hash:"0xd4e5...8b9c" },
  { id:"AUD-007", action:"Review Started",           txnId:"TXN-2024-005", propertyId:"TN-6621-VLR-2021", propertyTitle:"Commercial Complex — Vellore",         actor:"Sub-Registrar Krishnan", role:"registrar", timestamp:"16 Mar 2024, 09:45 AM", category:"review",    notes:"Company registration documents under verification.",    hash:"0xe5f6...9c0d" },
  { id:"AUD-008", action:"Dispute Resolved",         txnId:"DSP-2023-001", propertyId:"TN-7734-MDU-2021", propertyTitle:"Commercial Shop — Madurai Market",     actor:"Sub-Registrar Krishnan", role:"registrar", timestamp:"10 Oct 2023, 02:30 PM", category:"dispute",   notes:"Encumbrance error confirmed and corrected in ledger.",  hash:"0xf6a7...0d1e" },
];


export const MOCK_INCOMING_TRANSFERS = [
  {
    id:            "TXN-2024-006",
    propertyId:    "TN-9901-TRY-2022",
    propertyTitle: "Residential House — Trichy",
    type:          "Residential",
    area:          "1,800 sq.ft.",
    district:      "Tiruchirappalli",
    sellerId:      "USR-003",
    sellerName:    "Narenda Modi",
    sellerAadhaar: "XXXX XXXX 1234",
    buyerId:       "USR-001",
    buyerName:     "Haneesh Yadav",
    saleValue:     "₹55,00,000",
    initiatedOn:   "18 Mar 2024",
    status:        "Awaiting Your Confirmation",
    statusColor:   "#F0A030",
    surveyNo:      "9901/B",
    notes:         "Please review and confirm your intent to purchase this property.",
    ownershipTimeline: [
      { event:"Initial Registration", from:"Govt. Records", to:"Anand Rajan",  date:"10 Jun 2015", hash:"0xb2c3...d4e5", status:"GENESIS"  },
      { event:"Mutation Approved",    from:null,            to:null,           date:"22 Aug 2019", hash:"0xc3d4...e5f6", status:"CONFIRMED" },
      { event:"Transfer Initiated",   from:"Anand Rajan",   to:"Haneesh Yadav",   date:"18 Mar 2024", hash:"0xd4e5...f6a7", status:"PENDING"   },
    ],
  },
];

export const getIncomingTransfers   = (userId) => MOCK_INCOMING_TRANSFERS.filter(t => t.buyerId === userId);


export const getTransfersByUser    = (userId) => MOCK_TRANSFERS.filter(t => t.sellerId===userId || t.buyerId===userId);
export const getTransferById       = (id)     => MOCK_TRANSFERS.find(t => t.id===id) || null;
export const getPendingApprovals   = ()       => MOCK_PENDING_APPROVALS;
export const getCompletedApprovals = ()       => MOCK_COMPLETED_APPROVALS;
export const getRegistrarDisputes  = ()       => MOCK_REGISTRAR_DISPUTES;
export const getMutationRequests   = ()       => MOCK_MUTATION_REQUESTS;
export const getAuditLog           = ()       => MOCK_AUDIT_LOG;
export const getApprovalById       = (id)     => [...MOCK_PENDING_APPROVALS, ...MOCK_COMPLETED_APPROVALS].find(a => a.id===id) || null;
