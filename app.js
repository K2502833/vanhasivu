// =========================================
// 1. Catalogue Search, Filter & localStorage
// =========================================
const searchInput = document.getElementById("book-search");
const conditionFilter = document.getElementById("condition-filter");
const bookList = document.getElementById("book-list");
const resultsStatus = document.getElementById("results-status");

if (searchInput && conditionFilter && bookList && resultsStatus) {
  const books = Array.from(bookList.querySelectorAll(".book-card"));
  const STORAGE_KEY = "vanhasivu_catalogue_filter";

  function applyCatalogueFilters() {
    const query = searchInput.value.trim().toLowerCase();
    const selectedCondition = conditionFilter.value;
    let visibleCount = 0;

    books.forEach((book) => {
      const text = book.textContent.toLowerCase();
      const condition = book.dataset.condition || "";
      const matchesText = text.includes(query);
      const matchesCondition =
        selectedCondition === "all" || condition === selectedCondition;

      if (matchesText && matchesCondition) {
        book.hidden = false;
        visibleCount += 1;
      } else {
        book.hidden = true;
      }
    });

    resultsStatus.textContent = `Showing ${visibleCount} of ${books.length} books`;

    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ query: searchInput.value, condition: selectedCondition })
      );
    } catch {
      // Ignore storage errors if blocked
    }
  }

  // Restore saved filter on load
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    if (saved) {
      if (typeof saved.query === "string") searchInput.value = saved.query;
      if (typeof saved.condition === "string") conditionFilter.value = saved.condition;
    }
  } catch {
    // Ignore invalid JSON
  }

  searchInput.addEventListener("input", applyCatalogueFilters);
  conditionFilter.addEventListener("change", applyCatalogueFilters);

  const catalogueForm = document.getElementById("catalogue-controls");
  if (catalogueForm) {
    catalogueForm.addEventListener("submit", (event) => {
      event.preventDefault();
      applyCatalogueFilters();
    });
  }

  applyCatalogueFilters();
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

  // Restore saved draft on page load
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
