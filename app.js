const API_BASE = "https://vectorsigma.org" + "/briefer/api/v1";
const CUSTOMER_ID = 10;

// =========================================
// 1. Catalogue API Fetch, Retry, Sort & Paging
// =========================================
const searchInput = document.getElementById("book-search");
const sortSelect = document.getElementById("sort-select");
const catalogueForm = document.getElementById("catalogue-controls");
const bookList = document.getElementById("book-list");
const bookTemplate = document.getElementById("book-template");
const resultsStatus = document.getElementById("results-status");
const emptyState = document.getElementById("empty-state");
const showMoreBtn = document.getElementById("show-more-btn");

if (bookList && bookTemplate && resultsStatus) {
  const STORAGE_KEY = "vanhasivu_catalogue_api_state";
  let conditionWords = {
    "1": "poor",
    "2": "worn",
    "3": "fair",
    "4": "good",
    "5": "as new"
  };
  let nextCursor = null;
  let totalCount = 0;
  let loadedCount = 0;

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async function fetchWithRetry(url, maxRetries = 3) {
    for (let attempt = 1; attempt <= maxRetries; attempt += 1) {
      const res = await fetch(url);

      if (res.status === 429) {
        if (attempt === maxRetries) {
          throw new Error("The catalogue server is very busy right now. Please try again shortly.");
        }
        const retryHeader = Number(res.headers.get("Retry-After"));
        const waitSeconds = Number.isFinite(retryHeader) && retryHeader > 0 ? retryHeader : 3;
        resultsStatus.textContent = `Server is busy — waiting ${waitSeconds} seconds before retrying (attempt ${attempt} of ${maxRetries})…`;
        await sleep(waitSeconds * 1000);
        continue;
      }

      if (!res.ok) {
        throw new Error(`Could not load books (server responded with ${res.status}).`);
      }

      return res.json();
    }
  }

  async function loadConditionWords() {
    try {
      const url = new URL(`${API_BASE}/customer`);
      url.searchParams.set("customer", String(CUSTOMER_ID));
      const customerData = await fetchWithRetry(url.toString(), 2);
      if (customerData && customerData.conditions && typeof customerData.conditions === "object") {
        conditionWords = customerData.conditions;
      }
    } catch {
      // Keep default condition words if customer endpoint fails
    }
  }

  function formatCondition(condValue) {
    if (condValue === null || condValue === undefined || condValue === "") {
      return "Condition not listed";
    }
    const word = conditionWords[String(condValue)];
    return word ? `Condition: ${word}` : `Condition: ${condValue}`;
  }

  function formatPrice(priceValue) {
    if (typeof priceValue === "number" && Number.isFinite(priceValue)) {
      return `${priceValue.toFixed(2)} €`;
    }
    return "Price on request";
  }

  function renderBookCard(book) {
    const fragment = bookTemplate.content.cloneNode(true);
    const titleEl = fragment.querySelector(".book-title");
    const authorEl = fragment.querySelector(".book-author");
    const metaEl = fragment.querySelector(".book-meta");
    const subjectsEl = fragment.querySelector(".book-subjects");

    const titleText = book.title ? String(book.title) : "Untitled book";
    const yearText = book.year ? ` (${book.year})` : "";
    titleEl.textContent = `${titleText}${yearText}`;

    authorEl.textContent = book.author ? `Author: ${book.author}` : "Author: Unknown";
    metaEl.textContent = `${formatCondition(book.condition)} · ${formatPrice(book.price)}`;

    if (Array.isArray(book.subjects) && book.subjects.length > 0) {
      subjectsEl.textContent = `Subjects: ${book.subjects.join(", ")}`;
    } else {
      subjectsEl.textContent = "Subjects: General";
    }

    bookList.appendChild(fragment);
  }

  function saveFilterState() {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          q: searchInput ? searchInput.value : "",
          sort: sortSelect ? sortSelect.value : ""
        })
      );
    } catch {
      // Ignore storage errors
    }
  }

  async function loadBooks({ append = false } = {}) {
    const query = searchInput ? searchInput.value.trim() : "";
    const sort = sortSelect ? sortSelect.value : "";

    bookList.setAttribute("aria-busy", "true");
    if (emptyState) emptyState.hidden = true;
    if (showMoreBtn) showMoreBtn.disabled = true;

    if (!append) {
      bookList.replaceChildren();
      loadedCount = 0;
      nextCursor = null;
      resultsStatus.textContent = "Loading books from catalogue…";
    } else {
      resultsStatus.textContent = "Loading more books…";
    }

    const url = new URL(`${API_BASE}/items`);
    url.searchParams.set("customer", String(CUSTOMER_ID));
    url.searchParams.set("limit", "20");
    if (query) url.searchParams.set("q", query);
    if (sort) url.searchParams.set("sort", sort);
    if (append && nextCursor) url.searchParams.set("cursor", nextCursor);

    try {
      const data = await fetchWithRetry(url.toString());
      const items = Array.isArray(data.items) ? data.items : [];
      totalCount = typeof data.total === "number" ? data.total : loadedCount + items.length;
      nextCursor = data.next || null;

      items.forEach((book) => renderBookCard(book));
      loadedCount += items.length;

      if (loadedCount === 0) {
        resultsStatus.textContent = "Showing 0 of 0 books.";
        if (emptyState) emptyState.hidden = false;
      } else {
        resultsStatus.textContent = `Showing ${loadedCount} of ${totalCount} books`;
      }

      if (showMoreBtn) {
        showMoreBtn.hidden = !nextCursor;
        showMoreBtn.disabled = false;
      }
    } catch (error) {
      resultsStatus.textContent = error.message || "Could not load the book catalogue. Please try again later.";
      if (showMoreBtn) {
        showMoreBtn.hidden = !nextCursor;
        showMoreBtn.disabled = false;
      }
    } finally {
      bookList.setAttribute("aria-busy", "false");
    }
  }

  // Restore saved search/sort from localStorage
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    if (saved) {
      if (searchInput && typeof saved.q === "string") searchInput.value = saved.q;
      if (sortSelect && typeof saved.sort === "string") sortSelect.value = saved.sort;
    }
  } catch {
    // Ignore invalid JSON
  }

  if (catalogueForm) {
    catalogueForm.addEventListener("submit", (event) => {
      event.preventDefault();
      saveFilterState();
      loadBooks({ append: false });
    });
  }

  if (sortSelect) {
    sortSelect.addEventListener("change", () => {
      saveFilterState();
      loadBooks({ append: false });
    });
  }

  if (showMoreBtn) {
    showMoreBtn.addEventListener("click", () => {
      if (nextCursor) {
        loadBooks({ append: true });
      }
    });
  }

  (async function initCatalogue() {
    await loadConditionWords();
    await loadBooks({ append: false });
  })();
}

// =========================================
// 2. Book Wish Form Validation & Draft Save
// =========================================
const wishForm = document.getElementById("wish-form");

if (wishForm) {
  wishForm.noValidate = true;
  const DRAFT_KEY = "vanhasivu_wish_draft";
  const formStatus = document.getElementById("form-status");

  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const titleInput = document.getElementById("title");
  const authorInput = document.getElementById("author");

  const fields = [
    {
      input: nameInput,
      errorEl: document.getElementById("name-error"),
      validate: (val) => (val.trim() === "" ? "Please enter your name." : "")
    },
    {
      input: emailInput,
      errorEl: document.getElementById("email-error"),
      validate: (val) => {
        if (val.trim() === "") return "Please enter your email address.";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim())) {
          return "Please enter a valid email address (for example, name@example.fi).";
        }
        return "";
      }
    },
    {
      input: titleInput,
      errorEl: document.getElementById("title-error"),
      validate: (val) =>
        val.trim() === "" ? "Please enter the title of the book you are looking for." : ""
    }
  ];

  function setFieldError(field, message) {
    if (!field.input || !field.errorEl) return;
    field.errorEl.textContent = message;
    if (message) {
      field.input.setAttribute("aria-invalid", "true");
    } else {
      field.input.removeAttribute("aria-invalid");
    }
  }

  function saveDraft() {
    try {
      localStorage.setItem(
        DRAFT_KEY,
        JSON.stringify({
          name: nameInput.value,
          email: emailInput.value,
          title: titleInput.value,
          author: authorInput ? authorInput.value : ""
        })
      );
    } catch {
      // Ignore storage errors
    }
  }

  try {
    const savedDraft = JSON.parse(localStorage.getItem(DRAFT_KEY) || "null");
    if (savedDraft) {
      if (savedDraft.name) nameInput.value = savedDraft.name;
      if (savedDraft.email) emailInput.value = savedDraft.email;
      if (savedDraft.title) titleInput.value = savedDraft.title;
      if (authorInput && savedDraft.author) authorInput.value = savedDraft.author;
    }
  } catch {
    // Ignore invalid JSON
  }

  fields.forEach((field) => {
    field.input.addEventListener("input", () => {
      const msg = field.validate(field.input.value);
      setFieldError(field, msg);
      saveDraft();
    });
  });

  if (authorInput) {
    authorInput.addEventListener("input", saveDraft);
  }

  wishForm.addEventListener("submit", (event) => {
    event.preventDefault();
    let firstInvalid = null;

       fields.forEach((field) => {
      const msg = field.validate(field.input.value);
      setFieldError(field, msg);
      if (msg && !firstInvalid) {
        firstInvalid = field.input;
      }
    });

    if (firstInvalid) {
      formStatus.textContent = "Please fix the highlighted fields above.";
      firstInvalid.focus();
      return;
    }

    const cleanName = nameInput.value.trim();
    const cleanTitle = titleInput.value.trim();
    formStatus.textContent = `Your book wish for "${cleanTitle}" is ready for ${cleanName}. (Demo only — not sent to a server.)`;

    try {
      localStorage.removeItem(DRAFT_KEY);
    } catch {
      // Ignore storage errors
    }
  });
}
