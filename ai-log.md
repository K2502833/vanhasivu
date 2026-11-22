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
