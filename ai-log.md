# AI Exercise Log – E1

**Project:** Antikvariaatti Vanha Sivu  
**Student:** Puja Manandhar  
**Assignment:** E1 – Four-page website

## Exercise 1 – Understanding the Client Brief

**Tool used:** ChatGPT

**Purpose:** To understand the client's requirements and plan the website structure.

**How AI helped:** ChatGPT helped identify the main requirements, including a searchable book catalogue, book information, gradual loading of books and a customer wish form.

**My work:** I reviewed the client brief and decided on the four website pages: Home, About, Catalogue and Contact.

## Exercise 2 – Website Proposal

**Tool used:** ChatGPT

**Purpose:** To prepare the client proposal in plan.md.

**How AI helped:** ChatGPT helped organise the proposal into goals, visitors, page content, website inspiration, tone, client requirements and next steps.

**My work:** I reviewed the proposal and used the client's requirements to prepare the website plan.

## Further Exercises

Additional AI exercises and assistance will be recorded here as the E1 project progresses.

## E3 – JavaScript Interactivity, Forms, Storage, and Popover

* **Tools used:** Google Gemini, ChatGPT, and GitHub Copilot
* **How I used AI for assistance:**
  * Checked my ideas for structuring `app.js` with `defer` so my book search and condition filter update a `role="status"` counter cleanly.
  * Asked for examples and debugging tips on custom form validation (`form.noValidate = true`), linking error messages with `aria-describedby`, setting `aria-invalid="true"`, and moving focus to the first invalid field.
  * Reviewed best practices for saving and restoring catalogue filter choices and form drafts with `localStorage`, as well as using the native HTML `popover` attribute.
  * Used Copilot suggestions for small syntax completions while writing and adjusting the code to fit my existing HTML and CSS.
* **What I implemented and verified myself:**
  * Integrated the markup, styles, and JavaScript across `index.html`, `about.html`, `listing.html`, `contact.html`, `style.css`, and `app.js`.
  * Tested every interaction using keyboard only (`Tab`, `Enter`, `Space`, and `Esc` to close the popover).
  * Verified `localStorage` persistence after page reload, validation focus handling, `320 px` responsive layout without horizontal scrolling, and `4.5 : 1` contrast in both light and dark modes.

## E4 – Course API Integration, Pagination, Sorting, and Error Handling

* **Tools used:** Google Gemini, ChatGPT, and GitHub Copilot
* **How I used AI for assistance:**
  * Checked the structure of `fetch()` with `async`/`await`, `URL`, and `searchParams` to load book data for customer `10` (`Antikvariaatti Vanha Sivu`) and map numeric condition codes (`1`–`5`) to words from `/customer`.
  * Reviewed patterns for handling `429 Too Many Requests` with `Retry-After` backoff, `500` server errors (`res.ok`), empty search states, and missing/`null` book fields safely via `<template>` and `textContent`.
  * Verified how to implement cursor-based pagination (`next` / `&cursor=`) and server-side price sorting (`&sort=price`) requested in the client change request.
  * Used Copilot for small syntax completions while integrating the API code into my existing `app.js` and `style.css`.
* **What I implemented and verified myself:**
  * Updated `listing.html` with `<template>`, search and price-sort controls, an empty-state wish link, and a "Show more books" button, while keeping `<header>`, `<nav>`, and `<footer>` identical across all four HTML pages.
  * Tested the live catalogue against simulated API states (`slow`, `empty`, `429`, and `500`) in browser DevTools and confirmed no `mode` or `simulate` parameters remain in the final code.
  * Verified keyboard navigation, `aria-busy` / `role="status"` announcements, `320 px` responsive layout, and `4.5 : 1` colour contrast in both light and dark modes.
