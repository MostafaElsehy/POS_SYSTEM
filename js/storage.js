export function saveToLocal(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.log("Storage Full! Image too large.");
  }
}

export function getFromLocal(key) {
  const data = localStorage.getItem(key);
  if (!data) return null;
  try {
    return JSON.parse(data);
  } catch (e) {
    console.error(`Failed to parse data for key "${key}" from localStorage`, e);
    return null;
  }
}
