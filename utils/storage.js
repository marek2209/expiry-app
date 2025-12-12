import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@food_items';

export const saveItems = async (items) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (error) {
    console.error('Error saving items:', error);
  }
};

export const loadItems = async () => {
  try {
    const items = await AsyncStorage.getItem(STORAGE_KEY);
    return items ? JSON.parse(items) : [];
  } catch (error) {
    console.error('Error loading items:', error);
    return [];
  }
};

export const addItem = async (newItem) => {
  try {
    const items = await loadItems();
    const updatedItems = [newItem, ...items];
    await saveItems(updatedItems);
    return updatedItems;
  } catch (error) {
    console.error('Error adding item:', error);
  }
};

export const deleteItem = async (itemId) => {
  try {
    const items = await loadItems();
    const filteredItems = items.filter(item => item.id !== itemId);
    await saveItems(filteredItems);
    return filteredItems;
  } catch (error) {
    console.error('Error deleting item:', error);
  }
};