export function saveToLocal(key, data) {
  try {
    const jsonData = JSON.stringify(data); // تحويل البيانات إلى JSON String
    localStorage.setItem(key, jsonData); // التخزين بالمفتاح
  } catch (error) {
    console.error("Storage Full!");
  }
}

export function getFromLocal(key) {
  const storedData = localStorage.getItem(key);

  // لو مفيش بيانات
  if (!storedData) {
    return null;
  }

  try {
    return JSON.parse(storedData); // تحويل من JSON إلى Object
  } catch (error) {
    console.error("Invalid data for this key.");
    return null;
  }
}
