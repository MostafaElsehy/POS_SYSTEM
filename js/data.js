// Use a single shared lightweight logo for all product thumbnails
export const DEFAULT_IMG = "assets/logo.png";

// 50 initial products (unique ids & barcodes)
export const initialProducts = [
  // ===== Electronics =====
  { id: 101, barcode: "EL-1001", name: "Wireless Mouse", price: 150, stock: 25, image: DEFAULT_IMG, category: "Electronics" },
  { id: 102, barcode: "EL-1002", name: "Gaming Keyboard", price: 320, stock: 15, image: DEFAULT_IMG, category: "Electronics" },
  { id: 103, barcode: "EL-1003", name: "USB-C Hub 4-in-1", price: 280, stock: 18, image: DEFAULT_IMG, category: "Electronics" },
  { id: 104, barcode: "EL-1004", name: "27\" LED Monitor", price: 2200, stock: 8, image: DEFAULT_IMG, category: "Electronics" },
  { id: 105, barcode: "EL-1005", name: "Bluetooth Headset", price: 450, stock: 22, image: DEFAULT_IMG, category: "Electronics" },
  { id: 106, barcode: "EL-1006", name: "External HDD 1TB", price: 950, stock: 12, image: DEFAULT_IMG, category: "Electronics" },
  { id: 107, barcode: "EL-1007", name: "External SSD 512GB", price: 1350, stock: 10, image: DEFAULT_IMG, category: "Electronics" },
  { id: 108, barcode: "EL-1008", name: "Laptop Cooling Pad", price: 180, stock: 30, image: DEFAULT_IMG, category: "Electronics" },
  { id: 109, barcode: "EL-1009", name: "Wireless Speaker", price: 600, stock: 20, image: DEFAULT_IMG, category: "Electronics" },
  { id: 110, barcode: "EL-1010", name: "Webcam Full HD", price: 350, stock: 16, image: DEFAULT_IMG, category: "Electronics" },

  // ===== Accessories =====
  { id: 111, barcode: "AC-2001", name: "USB-A to USB-C Cable", price: 60, stock: 80, image: DEFAULT_IMG, category: "Accessories" },
  { id: 112, barcode: "AC-2002", name: "HDMI Cable 2m", price: 90, stock: 70, image: DEFAULT_IMG, category: "Accessories" },
  { id: 113, barcode: "AC-2003", name: "Phone Charger 20W", price: 180, stock: 60, image: DEFAULT_IMG, category: "Accessories" },
  { id: 114, barcode: "AC-2004", name: "Power Bank 10,000mAh", price: 350, stock: 40, image: DEFAULT_IMG, category: "Accessories" },
  { id: 115, barcode: "AC-2005", name: "Earphones (Wired)", price: 70, stock: 90, image: DEFAULT_IMG, category: "Accessories" },
  { id: 116, barcode: "AC-2006", name: "Laptop Sleeve 15.6\"", price: 210, stock: 25, image: DEFAULT_IMG, category: "Accessories" },
  { id: 117, barcode: "AC-2007", name: "Wireless Presenter", price: 260, stock: 18, image: DEFAULT_IMG, category: "Accessories" },
  { id: 118, barcode: "AC-2008", name: "Mouse Pad Large", price: 80, stock: 75, image: DEFAULT_IMG, category: "Accessories" },
  { id: 119, barcode: "AC-2009", name: "OTG Adapter", price: 45, stock: 90, image: DEFAULT_IMG, category: "Accessories" },
  { id: 120, barcode: "AC-2010", name: "Cable Organizer Set", price: 95, stock: 55, image: DEFAULT_IMG, category: "Accessories" },

  // ===== Networking =====
  { id: 121, barcode: "NW-3001", name: "Wi-Fi Router AC1200", price: 750, stock: 14, image: DEFAULT_IMG, category: "Networking" },
  { id: 122, barcode: "NW-3002", name: "Network Switch 8-Port", price: 520, stock: 12, image: DEFAULT_IMG, category: "Networking" },
  { id: 123, barcode: "NW-3003", name: "Ethernet Cable CAT6 5m", price: 65, stock: 80, image: DEFAULT_IMG, category: "Networking" },
  { id: 124, barcode: "NW-3004", name: "USB Wi-Fi Adapter", price: 190, stock: 25, image: DEFAULT_IMG, category: "Networking" },
  { id: 125, barcode: "NW-3005", name: "Range Extender N300", price: 340, stock: 18, image: DEFAULT_IMG, category: "Networking" },

  // ===== Office Supplies =====
  { id: 126, barcode: "OF-4001", name: "A4 Paper 80gsm (500)", price: 200, stock: 40, image: DEFAULT_IMG, category: "Office Supplies" },
  { id: 127, barcode: "OF-4002", name: "Ballpoint Pen Blue (12)", price: 55, stock: 60, image: DEFAULT_IMG, category: "Office Supplies" },
  { id: 128, barcode: "OF-4003", name: "Stapler Medium", price: 70, stock: 35, image: DEFAULT_IMG, category: "Office Supplies" },
  { id: 129, barcode: "OF-4004", name: "Notepad A5 Lined", price: 45, stock: 50, image: DEFAULT_IMG, category: "Office Supplies" },
  { id: 130, barcode: "OF-4005", name: "Highlighter Set (4)", price: 90, stock: 30, image: DEFAULT_IMG, category: "Office Supplies" },
  { id: 131, barcode: "OF-4006", name: "Desk Organizer", price: 160, stock: 22, image: DEFAULT_IMG, category: "Office Supplies" },
  { id: 132, barcode: "OF-4007", name: "Paper Clips (100)", price: 25, stock: 80, image: DEFAULT_IMG, category: "Office Supplies" },
  { id: 133, barcode: "OF-4008", name: "Whiteboard Markers (4)", price: 75, stock: 28, image: DEFAULT_IMG, category: "Office Supplies" },
  { id: 134, barcode: "OF-4009", name: "Sticky Notes 3x3 (Pack)", price: 55, stock: 45, image: DEFAULT_IMG, category: "Office Supplies" },
  { id: 135, barcode: "OF-4010", name: "Office Scissors", price: 40, stock: 35, image: DEFAULT_IMG, category: "Office Supplies" },

  // ===== Grocery / Snacks =====
  { id: 136, barcode: "GR-5001", name: "Bottled Water 1.5L", price: 10, stock: 120, image: DEFAULT_IMG, category: "Grocery" },
  { id: 137, barcode: "GR-5002", name: "Soft Drink Can 330ml", price: 15, stock: 110, image: DEFAULT_IMG, category: "Grocery" },
  { id: 138, barcode: "GR-5003", name: "Potato Chips 100g", price: 25, stock: 70, image: DEFAULT_IMG, category: "Snacks" },
  { id: 139, barcode: "GR-5004", name: "Chocolate Bar 50g", price: 20, stock: 90, image: DEFAULT_IMG, category: "Snacks" },
  { id: 140, barcode: "GR-5005", name: "Instant Coffee 100g", price: 95, stock: 40, image: DEFAULT_IMG, category: "Grocery" },
  { id: 141, barcode: "GR-5006", name: "Tea Bags (25)", price: 45, stock: 60, image: DEFAULT_IMG, category: "Grocery" },
  { id: 142, barcode: "GR-5007", name: "Sugar 1kg", price: 38, stock: 55, image: DEFAULT_IMG, category: "Grocery" },
  { id: 143, barcode: "GR-5008", name: "Milk 1L", price: 30, stock: 50, image: DEFAULT_IMG, category: "Grocery" },
  { id: 144, barcode: "GR-5009", name: "Biscuits 12pcs", price: 32, stock: 65, image: DEFAULT_IMG, category: "Snacks" },
  { id: 145, barcode: "GR-5010", name: "Chewing Gum Pack", price: 12, stock: 85, image: DEFAULT_IMG, category: "Snacks" },

  // ===== Cleaning / Misc =====
  { id: 146, barcode: "CL-6001", name: "Hand Sanitizer 500ml", price: 65, stock: 40, image: DEFAULT_IMG, category: "Cleaning" },
  { id: 147, barcode: "CL-6002", name: "Liquid Soap 500ml", price: 55, stock: 45, image: DEFAULT_IMG, category: "Cleaning" },
  { id: 148, barcode: "CL-6003", name: "Dishwashing Liquid 750ml", price: 48, stock: 35, image: DEFAULT_IMG, category: "Cleaning" },
  { id: 149, barcode: "CL-6004", name: "Tissue Box 150", price: 28, stock: 70, image: DEFAULT_IMG, category: "Cleaning" },
  { id: 150, barcode: "CL-6005", name: "Trash Bags Roll (30)", price: 40, stock: 50, image: DEFAULT_IMG, category: "Cleaning" },
];
