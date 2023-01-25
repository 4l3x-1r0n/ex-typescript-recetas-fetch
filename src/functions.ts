import { LocalStorageDB } from "./class/LocalStorageDB/LocalStorage.js";
import { UI } from "./class/UI/UI.js";

const localDb = new LocalStorageDB("recipes");

export function saveToLocalStorage(item: object) {
    localDb.addItem(item);
}

export function removeFromLocalStorage(id: string) {
    localDb.removeItemById(id);
}

export function itemExistInLocalStorage(id: string): number {
    return localDb.itemExist(id);
}

export function showToast(msg: string) {
    UI.showToast(msg);
}
