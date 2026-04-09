import Dexie, { type EntityTable } from 'dexie';
import { type data } from '../Pages/List/List';

interface ItemList {
    id?: number,
    title: string,
    list: [data?],
    creatingDate: string,
    lastEditedDate: string,
}

const db = new Dexie('MyDatabase') as Dexie & {
    itemList: EntityTable<ItemList, 'id'>;
};

db.version(1).stores({
    itemList: '++id, title, list', // '++id' = auto-increment primary key
});

export type { ItemList };
export { db };