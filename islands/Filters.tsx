import {
  Signal,
  useComputed,
  useSignal,
  useSignalEffect,
} from "@preact/signals";
import { addFiltersToUrl } from "../lib/urlUpdater.ts";

type VolumeId = string;

type BooksData = {
  [section: string]: {
    volumeId: VolumeId;
    books: string[];
    name: string;
  };
};

interface Props {
  filtersSignal: Signal<{ volumes: string[]; books: string[] }>;
}

const books: BooksData = {
  "ot": {
    name: "Old Testament",
    volumeId: "ot",
    books: [
      "Genesis",
      "Exodus",
      "Leviticus",
      "Numbers",
      "Deuteronomy",
      "Joshua",
      "Judges",
      "Ruth",
      "1 Samuel",
      "2 Samuel",
      "1 Kings",
      "2 Kings",
      "1 Chronicles",
      "2 Chronicles",
      "Ezra",
      "Nehemiah",
      "Esther",
      "Job",
      "Psalms",
      "Proverbs",
      "Ecclesiastes",
      "Song of Solomon",
      "Isaiah",
      "Jeremiah",
      "Lamentations",
      "Ezekiel",
      "Daniel",
      "Hosea",
      "Joel",
      "Amos",
      "Obadiah",
      "Jonah",
      "Micah",
      "Nahum",
      "Habakkuk",
      "Zephaniah",
      "Haggai",
      "Zechariah",
      "Malachi",
    ],
  },
  "nt": {
    name: "New Testament",
    volumeId: "nt",
    books: [
      "Matthew",
      "Mark",
      "Luke",
      "John",
      "Acts",
      "Romans",
      "1 Corinthians",
      "2 Corinthians",
      "Galatians",
      "Ephesians",
      "Philippians",
      "Colossians",
      "1 Thessalonians",
      "2 Thessalonians",
      "1 Timothy",
      "2 Timothy",
      "Titus",
      "Philemon",
      "Hebrews",
      "James",
      "1 Peter",
      "2 Peter",
      "1 John",
      "2 John",
      "3 John",
      "Jude",
      "Revelation",
    ],
  },
  "bom": {
    name: "Book of Mormon",
    volumeId: "bom",
    books: [
      "1 Nephi",
      "2 Nephi",
      "Jacob",
      "Enos",
      "Jarom",
      "Omni",
      "Words of Mormon",
      "Mosiah",
      "Alma",
      "Helaman",
      "3 Nephi",
      "4 Nephi",
      "Mormon",
      "Ether",
      "Moroni",
    ],
  },
  "dc": {
    name: "Doctrine & Covenants",
    volumeId: "dc",
    books: ["Doctrine and Covenants"],
  },
  "pgp": {
    name: "Pearl of Great Price",
    volumeId: "pgp",
    books: [
      "Moses",
      "Abraham",
      "Joseph Smith—Matthew",
      "Joseph Smith—History",
      "Articles of Faith",
    ],
  },
};

export default function Filters(props: Props) {
  const { filtersSignal } = props;

  const initialFilters = filtersSignal.value;

  const isOpen = useSignal<boolean>(false);
  const searchQuery = useSignal<string>("");

  const selectedVolumes = useSignal<Set<VolumeId>>(
    new Set(initialFilters.volumes),
  );
  const selectedBooks = useSignal<Set<string>>(new Set(initialFilters.books));

  const expandedSections = useSignal<Set<string>>(new Set());

  useSignalEffect(() => {
    filtersSignal.value.books = Array.from(selectedBooks.value);
    filtersSignal.value.volumes = Array.from(selectedVolumes.value);
  });

  const toggleSection = (section: string): void => {
    const newExpanded = new Set(expandedSections.value);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    expandedSections.value = newExpanded;
  };

  const toggleBook = (bookName: string, section: string): void => {
    const volumeId = books[section].volumeId;

    // If volume is selected, don't allow individual book selection
    if (selectedVolumes.value.has(volumeId)) {
      return;
    }

    const newSelectedBooks = new Set(selectedBooks.value);

    if (newSelectedBooks.has(bookName)) {
      newSelectedBooks.delete(bookName);
    } else {
      newSelectedBooks.add(bookName);
    }

    selectedBooks.value = newSelectedBooks;
  };

  const toggleSection_All = (section: string): void => {
    const newSelectedBooks = new Set(selectedBooks.value);
    const newSelectedVolumes = new Set(selectedVolumes.value);
    const volumeId = books[section].volumeId;
    const sectionBookNames = books[section].books;

    const volumeSelected = newSelectedVolumes.has(volumeId);

    const allIndividualBooksSelected = sectionBookNames.every((name) =>
      newSelectedBooks.has(name)
    );

    if (volumeSelected || allIndividualBooksSelected) {
      newSelectedVolumes.delete(volumeId);
      sectionBookNames.forEach((name) => newSelectedBooks.delete(name));
    } else {
      newSelectedVolumes.add(volumeId);
      sectionBookNames.forEach((name) => newSelectedBooks.delete(name));
    }

    selectedBooks.value = newSelectedBooks;
    selectedVolumes.value = newSelectedVolumes;
  };

  const filteredBooks = useComputed<BooksData>(() => {
    const query = searchQuery.value.toLowerCase();
    if (!query) return books;

    const filtered: BooksData = {};
    Object.entries(books).forEach(([section, sectionData]) => {
      const matchingBooks = sectionData.books.filter(
        (name) =>
          name.toLowerCase().includes(query) ||
          section.toLowerCase().includes(query),
      );
      if (matchingBooks.length > 0) {
        filtered[section] = {
          name: sectionData.name,
          volumeId: sectionData.volumeId,
          books: matchingBooks,
        };
      }
    });
    return filtered;
  });

  const clearAll = (): void => {
    selectedBooks.value = new Set();
    selectedVolumes.value = new Set();
  };

  const totalSelectionCount = useComputed(() => {
    let count = selectedBooks.value.size;

    for (const vol of selectedVolumes.value) {
      count += books[vol].books.length;
    }

    return count;
  });

  const isSectionSelected = (section: string): boolean => {
    const volumeId = books[section].volumeId;
    const sectionBookNames = books[section].books;

    return (
      selectedVolumes.value.has(volumeId) ||
      sectionBookNames.every((name) => selectedBooks.value.has(name))
    );
  };

  const getSectionSelectedCount = (section: string): number => {
    const volumeId = books[section].volumeId;
    const sectionBookNames = books[section].books;

    if (selectedVolumes.value.has(volumeId)) {
      return sectionBookNames.length;
    }

    return sectionBookNames.filter((name) => selectedBooks.value.has(name))
      .length;
  };

  // Get the API payload
  const getApiPayload = (): { volumes: VolumeId[]; books: string[] } => {
    return {
      volumes: Array.from(selectedVolumes.value),
      books: Array.from(selectedBooks.value),
    };
  };

  useSignalEffect(() => {
    const payload = getApiPayload();
    addFiltersToUrl(payload.volumes, payload.books);
  });

  return (
    <>
      {/* Filter Button */}
      <button
        aria-label="filter books"
        type="button"
        onClick={() => (isOpen.value = true)}
        class={`flex items-center justify-center p-2 border-2 rounded-full ease-out duration-300 h-9 ${
          totalSelectionCount.value ? "" : "w-9"
        } active:scale-90 relative ${
          totalSelectionCount.value > 0
            ? "bg-blue-500 dark:bg-blue-400 border-blue-500 dark:border-blue-400 text-white hover:bg-blue-700 hover:border-blue-700 dark:hover:bg-blue-200 dark:hover:border-blue-200"
            : "text-blue-500 border-blue-500 disabled:text-neutral-300 disabled:border-neutral-300 dark:disabled:text-neutral-700 dark:disabled:border-neutral-700 hover:text-blue-700 focus:text-blue-700 dark:text-blue-400 dark:hover:text-blue-200 dark:focus:text-blue-200 hover:border-blue-700 focus:border-blue-700 dark:border-blue-400 dark:hover:border-blue-200 dark:focus:border-blue-200"
        }`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24px"
          viewBox="0 -960 960 960"
          width="24px"
          fill="currentColor"
        >
          <path d="M440-160q-17 0-28.5-11.5T400-200v-240L168-736q-15-20-4.5-42t36.5-22h560q26 0 36.5 22t-4.5 42L560-440v240q0 17-11.5 28.5T520-160h-80Zm40-308 198-252H282l198 252Zm0 0Z" />
        </svg>
        {totalSelectionCount.value > 0 && (
          <span class="px-1.5 py-0.5 bg-white text-blue-500 dark:text-blue-400 text-xs rounded-full min-w-[1.25rem] text-center font-bold border-2 border-blue-500 dark:border-blue-400">
            {totalSelectionCount.value}
          </span>
        )}
      </button>

      {/* Modal */}
      {isOpen.value && (
        <div class="fixed inset-0 bg-black/30 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div class="bg-white dark:bg-neutral-900 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col border-2 border-neutral-200 dark:border-neutral-700">
            {/* Header */}
            <div class="px-6 py-4 border-b-2 border-neutral-200 dark:border-neutral-700">
              <div class="flex items-center justify-between mb-4">
                <h2 class="text-2xl font-light text-neutral-900 dark:text-neutral-100">
                  Filter books
                </h2>
                <button
                  type="button"
                  onClick={() => (isOpen.value = false)}
                  class="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
                  aria-label="Close"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Search Bar */}
              <div class="relative">
                <input
                  type="text"
                  placeholder="Search books..."
                  value={searchQuery.value}
                  onInput={(
                    e: Event,
                  ) => (searchQuery.value =
                    (e.target as HTMLInputElement).value)}
                  class="w-full py-2 text-lg font-light bg-transparent border-b-2 rounded-none outline-none ps-10 pe-1 border-neutral-400 dark:border-neutral-600 dark:focus:border-neutral-200 focus:border-black dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-500"
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5 absolute left-2 top-2.5 text-neutral-400 dark:text-neutral-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>

            {/* Content */}
            <div class="flex-1 overflow-y-auto px-6 py-4 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-neutral-200 dark:[&::-webkit-scrollbar-track]:bg-neutral-900 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:bg-neutral-400 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-600 [&::-webkit-scrollbar-thumb]:rounded-full">
              {Object.entries(filteredBooks.value).map(
                ([section, sectionData]) => {
                  const sectionBookNames = sectionData.books;
                  const selectedCount = getSectionSelectedCount(section);
                  const isExpanded = expandedSections.value.has(section);
                  const isChecked = isSectionSelected(section);
                  const isIndeterminate = selectedCount > 0 &&
                    selectedCount < sectionBookNames.length;

                  return (
                    <div key={section} class="mb-4">
                      {/* Section Header */}
                      <div class="flex items-center justify-between bg-neutral-50 dark:bg-neutral-800 rounded-lg p-3 mb-2 border border-neutral-200 dark:border-neutral-700">
                        <div class="flex items-center gap-3 flex-1 min-w-0">
                          <input
                            type="checkbox"
                            id={`section-${section}`}
                            checked={isChecked}
                            indeterminate={isIndeterminate}
                            onChange={() => toggleSection_All(section)}
                            class="w-4 h-4 text-blue-600 dark:text-blue-400 bg-white dark:bg-neutral-700 rounded border-neutral-300 dark:border-neutral-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 flex-shrink-0"
                          />
                          <label
                            for={`section-${section}`}
                            class="text-sm font-light text-neutral-900 dark:text-neutral-100 cursor-pointer truncate"
                          >
                            {sectionData.name}
                            {selectedCount > 0 && (
                              <span class="ml-2 text-xs text-blue-600 dark:text-blue-400 font-normal">
                                ({selectedCount}/{sectionBookNames.length})
                              </span>
                            )}
                          </label>
                        </div>
                        <button
                          type="button"
                          onClick={() => toggleSection(section)}
                          class="text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-transform flex-shrink-0 ml-2 p-1"
                          aria-label={isExpanded ? "Collapse" : "Expand"}
                          style={{
                            transform: isExpanded
                              ? "rotate(180deg)"
                              : "rotate(0deg)",
                          }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fill-rule="evenodd"
                              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                              clip-rule="evenodd"
                            />
                          </svg>
                        </button>
                      </div>

                      {/* Books List */}
                      {isExpanded && (
                        <div class="pl-4 space-y-1">
                          {sectionData.books.map((name, index) => {
                            const volumeId = sectionData.volumeId;
                            const isVolumeSelected = selectedVolumes.value.has(
                              volumeId,
                            );
                            const isBookChecked =
                              selectedBooks.value.has(name) || isVolumeSelected;
                            const isDisabled = isVolumeSelected;

                            return (
                              <div
                                key={`${section}-${index}`}
                                class={`flex items-center gap-3 p-2 rounded-md transition-colors ${
                                  isDisabled
                                    ? "opacity-40 cursor-not-allowed"
                                    : "hover:bg-neutral-100 dark:hover:bg-neutral-800"
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  id={`${section}-${index}`}
                                  checked={isBookChecked}
                                  disabled={isDisabled}
                                  onChange={() => toggleBook(name, section)}
                                  class="w-4 h-4 text-blue-600 dark:text-blue-400 bg-white dark:bg-neutral-700 rounded border-neutral-300 dark:border-neutral-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 disabled:cursor-not-allowed"
                                />
                                <label
                                  for={`${section}-${index}`}
                                  class={`text-neutral-700 dark:text-neutral-300 font-light flex-1 ${
                                    isDisabled
                                      ? "cursor-not-allowed"
                                      : "cursor-pointer"
                                  }`}
                                >
                                  {name}
                                </label>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                },
              )}
            </div>

            {/* Footer */}
            <div class="px-6 py-4 border-t-2 border-neutral-200 dark:border-neutral-700 flex items-center justify-between">
              <button
                type="button"
                onClick={clearAll}
                class="px-4 py-2 text-xs font-light text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
              >
                Clear All
              </button>
              <div class="flex gap-3">
                <button
                  type="button"
                  onClick={() => (isOpen.value = false)}
                  class="px-6 py-2 text-xs font-light text-neutral-700 dark:text-neutral-300 border-2 border-neutral-300 dark:border-neutral-600 rounded-lg hover:border-neutral-400 dark:hover:border-neutral-500 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const payload = getApiPayload();
                    console.log("API Payload:", payload);

                    isOpen.value = false;
                  }}
                  class="px-6 py-2 text-xs font-light text-white bg-blue-500 dark:bg-blue-400 border-2 border-blue-500 dark:border-blue-400 rounded-lg hover:bg-blue-700 hover:border-blue-700 dark:hover:bg-blue-200 dark:hover:border-blue-200 transition-colors"
                >
                  Apply ({totalSelectionCount.value})
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
