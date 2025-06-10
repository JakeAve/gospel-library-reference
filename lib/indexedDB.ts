import { IS_BROWSER } from "$fresh/runtime.ts";
import type { Reference } from "@jakeave/scripture-ref/types";
import { parseRef } from "@jakeave/scripture-ref/client";

interface OldReference {
  book: Book;
  chapter?: number;
  ranges: VerseRange;
}

const DB_NAME = "saved_references";
const DB_VERSION = 2;

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

    request.onupgradeneeded = async (e: IDBVersionChangeEvent) => {
      if (e.newVersion === 1) {
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
      } else if (e.oldVersion === 1 && e.newVersion === 2) {
        const transaction: IDBTransaction = (e.target as IDBOpenDBRequest)
          .transaction!;
        const store: IDBObjectStore = transaction.objectStore(STORE_NAME);

        const getter = store.openCursor(null, "prev");

        await new Promise((resolve) => {
          getter.onsuccess = (event: Event) => {
            const cursor = (event.target as IDBRequest).result;
            if (cursor) {
              const entry = cursor.value as OldRefWithId;
              const book = entry.book.name;
              const chapter = entry.chapter || "";

              const verses: string[] = [];
              for (const r of entry.ranges) {
                if (Array.isArray(r)) {
                  verses.push(`${r[0]}-${r[1]}`);
                } else {
                  verses.push(r.toString());
                }
              }
              const verseString = verses.join(",");

              const updatedRef = parseRef(`${book} ${chapter}:${verseString}`);
              (updatedRef as RefWithId).id = cursor.key;
              store.put(updatedRef);
              cursor.continue();
            } else {
              resolve(undefined);
            }
          };
        });
      } else if (e.newVersion === 2) {
        const db = request.result;
        const store = db.createObjectStore(STORE_NAME, {
          keyPath: "id",
          autoIncrement: true,
        });

        store.transaction.oncomplete = (_event: Event) => {
          db.transaction(STORE_NAME, "readwrite").objectStore(
            STORE_NAME,
          );
        };
      }
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

interface OldRefWithId extends OldReference {
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

export async function addContent(id: number, content: string): Promise<void> {
  const result = await init();

  if (!result) {
    return;
  }

  const { db } = result;
  const transaction = db.transaction([STORE_NAME], "readwrite");
  const store = transaction.objectStore(STORE_NAME);

  const getRequest = store.get(id);

  return new Promise((resolve, reject) => {
    getRequest.onsuccess = (_event: Event) => {
      const existing = getRequest.result;
      if (!existing) {
        reject(`No object found with id ${id}`);
        return;
      }

      const updatedObj = { ...existing, content };

      const putRequest = store.put(updatedObj);

      putRequest.onsuccess = () => resolve();
      putRequest.onerror = () =>
        reject(`Failed to update object with id ${id}`);
    };

    getRequest.onerror = () =>
      reject(`Failed to retrieve object with id ${id}`);
  });
}
