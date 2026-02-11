// الصورة الافتراضية للمنتجات
const DEFAULT_IMG = "assets/images/default-product.png";


// المنتجات الابتدائية
const initialProducts = [
  {
    id: 1,
    barcode: "EL-1001",
    name: "Wireless Mouse",
    price: 250,
    stock: 20,
    image: DEFAULT_IMG,
    category: "Electronics",
  },
  {
    id: 2,
    barcode: "EL-1002",
    name: "Keyboard",
    price: 400,
    stock: 15,
    image: DEFAULT_IMG,
    category: "Electronics",
  },
  {
    id: 3,
    barcode: "AC-2001",
    name: "USB Cable",
    price: 50,
    stock: 50,
    image: DEFAULT_IMG,
    category: "Accessories",
  },
  {
    id: 4,
    barcode: "AC-2002",
    name: "Phone Charger",
    price: 120,
    stock: 30,
    image: DEFAULT_IMG,
    category: "Accessories",
  }
];