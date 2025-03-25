import { IS_BROWSER } from "$fresh/runtime.ts";

const DB_NAME = "saved_references";
const DB_VERSION = 1;

const STORE_NAME = "reference";

function init(): Promise<
  { request: IDBOpenDBRequest; db: IDBDatabase } | null
> {
  if (!IS_BROWSER) return Promise.resolve(null);

  return new Promise((resolve) => {
    const request = globalThis.indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = (e: Event) => {
      console.error("Error in the IndexedDB");
      console.error(e);
    };

    request.onupgradeneeded = (_event: Event) => {
      const db = request.result;
      const store = db.createObjectStore(STORE_NAME, {
        keyPath: "id",
        autoIncrement: true,
      });
      store.createIndex("by_book", ["bookName"], { unique: false });
      store.createIndex("by_book_and_chapter", ["bookName", "chapter"], {
        unique: false,
      });

      store.transaction.oncomplete = (_event: Event) => {
        db.transaction(STORE_NAME, "readwrite").objectStore(
          STORE_NAME,
        );
      };
    };

    request.onsuccess = (_event: Event) => {
      resolve({ request, db: request.result });
    };
  });
}

export async function add(reference: Reference): Promise<void> {
  const result = await init();

  if (!result) {
    return;
  }

  const { db } = result;

  const data = {
    ...reference,
    bookName: reference.book.name,
  };

  const addRequest = db.transaction([STORE_NAME], "readwrite").objectStore(
    STORE_NAME,
  ).add(data);

  addRequest.onsuccess = (_event: Event) => {
  };

  addRequest.onerror = (_event: Event) => {
  };
}

export interface RefWithId extends Reference {
  id: number;
}

export async function getAll(): Promise<RefWithId[]> {
  const result = await init();

  if (!result) {
    return [];
  }

  const { db } = result;

  const objectStore = db.transaction([STORE_NAME], "readonly").objectStore(
    STORE_NAME,
  );
  const request = objectStore.openCursor(null, "prev");

  return new Promise((resolve) => {
    const result: RefWithId[] = [];
    request.onsuccess = (event: Event) => {
      const cursor = (event.target as IDBRequest).result;
      if (cursor) {
        result.push(cursor.value);
        cursor.continue();
      } else {
        resolve(result);
      }
    };
    request.onerror = (error) => {
      console.error(error);
      resolve([]);
    };
  });
}

export async function deleteById(id: number): Promise<void> {
  const result = await init();

  if (!result) {
    return;
  }

  const { db } = result;

  const deleteRequest = db.transaction([STORE_NAME], "readwrite").objectStore(
    STORE_NAME,
  ).delete(id);

  return new Promise((resolve) => {
    deleteRequest.onsuccess = (_event: Event) => {
      resolve();
    };
    deleteRequest.onerror = (_event: Event) => {
      resolve();
    };
  });
}
