export type TLocalStorageDB = {
    idMeal: string;
}

export class LocalStorageDB {

    constructor(
        public dbName: string
    ) { }

    getItems(): TLocalStorageDB[] {
        if (!localStorage.getItem(this.dbName)) {
            return [];
        }
        const items = JSON.parse(localStorage.getItem(this.dbName) ?? "");
        return items;
    }

    addItem(item: object) {
        const items = this.getItems();
        items.push(<TLocalStorageDB>item);
        localStorage.setItem(this.dbName, JSON.stringify(items));
    }

    itemExist(id: string): number {
        let itemIndex = -1;
        const items = this.getItems();
        items.some((item, index) => {
            if (item.idMeal === id) {
                itemIndex = index;
                return true;
            }
        });
        return itemIndex;

    }

    removeItemById(id: string) {
        const itemIndex = this.itemExist(id);
        if (itemIndex !== -1) {
            const items = this.getItems();
            items.splice(itemIndex, 1);
            localStorage.setItem(this.dbName, JSON.stringify(items));
        }
    }

}
