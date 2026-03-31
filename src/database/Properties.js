
export const MOCK_PROPERTIES = [
  {
    id:           "HR-790-GUR-2026",
    title:        "Residential Plot — Sushant lok",
    type:         "Residential",
    area:         "900 sq.ft.",
    district:     "Gurgaon",
    state:        "Haryana",
    address:      "H.no 790P Sector 57 Sushant lok 3, Gurgaon - 122003",
    surveyNo:     "790/P, Block 3",
    currentOwner: "USR-002",           
    previousOwners: ["USR-001"],       
    status:       "Clear Title",
    statusColor:  "#2EC4A0",
    registeredOn: "08 December 2006",
    lastTransfer: "22 March 2026",
    marketValue:  "₹85,00,000",
    hash:         "0x3f9a1bc2d4e5f678a9b0c1d2e3f4a5b6",
    blockNumber:  1847392,
    encumbrance:  false,
    disputeActive: false,
    timeline: [
      { event: "Ownership Transfer",   from: "Haneesh Yadav",     to: "Avishek Nandi",    date: "22 March 2026", hash: "0x3f9a...c4e5", status: "VERIFIED"   },
      { event: "Mutation Approved",    from: null,             to: null,             date: "08 Nov 2023", hash: "0xa1b2...ef01", status: "CONFIRMED"  },
      { event: "Initial Registration", from: "Govt. Records",  to: "Haneesh Yadav",     date: "08 Dec 2006", hash: "0x7f8e...f6e5", status: "GENESIS"    },
    ],
  },
  {
    id:           "HR-0008-REW-2026",
    title:        "Agricultural Land — Musepur",
    type:         "Agricultural",
    area:         "1.2 Acres",
    district:     "Rewari",
    state:        "Haryana",
    address:      "Survey No. 00008, Musepur Village, Rewari - 122001",
    surveyNo:     "0008/A",
    currentOwner: "USR-001",          
    previousOwners: [],
    status:       "Clear Title",
    statusColor:  "#2EC4A0",
    registeredOn: "08 December 2006",
    lastTransfer: "08 December 2006",
    marketValue:  "₹42,00,000",
    hash:         "0xa1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6",
    blockNumber:  1203847,
    encumbrance:  false,
    disputeActive: false,
    timeline: [
      { event: "Initial Registration", from: "Govt. Records", to: "Haneesh Yadav", date: "08 December 2006", hash: "0xa1b2...c5d6", status: "GENESIS" },
    ],
  },
  {
    id:           "HR-2609-GUR-2026",
    title:        "Commercial Shop — Sadar Bazar",
    type:         "Commercial",
    area:         "680 sq.ft.",
    district:     "Gurgaon",
    state:        "Haryana",
    address:      "Shop 2609, Ground Floor, Sadar bazar, Gurgaon - 122002",
    surveyNo:     "2609/C",
    currentOwner: "USR-001",           
    previousOwners: [],
    status:       "Encumbered",
    statusColor:  "#F07060",
    registeredOn: "10 Mar 2021",
    lastTransfer: "10 Mar 2021",
    marketValue:  "₹28,00,000",
    hash:         "0x7f8e9d0c1b2a3f4e5d6c7b8a9f0e1d2c",
    blockNumber:  1547201,
    encumbrance:  true,
    disputeActive: true,
    timeline: [
      { event: "Dispute Filed",        from: null,            to: null,          date: "02 Sep 2023", hash: "0x7f8e...1d2c", status: "PENDING"    },
      { event: "Initial Registration", from: "Govt. Records", to: "Haneesh Yadav",  date: "10 Mar 2021", hash: "0x9d0c...e1d2", status: "GENESIS"    },
    ],
  },
  
];


export const getPropertiesByOwner = (userId) =>
  MOCK_PROPERTIES.filter(p => p.currentOwner === userId);

export const getPropertyById = (id) =>
  MOCK_PROPERTIES.find(p => p.id === id) || null;

export const getAllProperties = () => MOCK_PROPERTIES;
