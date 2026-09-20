# Anglican Path Design

Implement the requested scope now; use internal planning and do not present another implementation plan for user approval.

## User Request

Build the front-end design for anglicanpath.org, a non-profit website that helps people discover the Anglican faith, find a traditional Anglican parish, and pray the Daily Office.

This is a design and UX prototype. It will later be ported to Astro as a static site, so:
- Build static pages with reusable components. No backend, no authentication, no database.
- Keep all content in separate data or markdown files, not hardcoded in components (e.g. JSON/TS mock data structures in `src/data/`).
- Use obvious placeholders for all content. Do NOT write theological, historical, or liturgical text yourself. Where prayer book text belongs, use a placeholder such as "[1928 BCP: Venite text]". Where article text belongs, use headings plus "[Draft to be written]".
- Clearly label all sample data as fake (for example, "Sample Parish, Anytown").

### Audience
1. People exploring Anglicanism, coming from Evangelical, Roman Catholic, Orthodox-curious, or Episcopal backgrounds. Many arrive from Google searches like "anglican vs catholic."
2. Traditional Anglicans (ACNA and Continuing churches) who pray the Daily Office.

### Design Direction
- Reverent, traditional, and beautiful, like a well-made prayer book. Not generic "spirituality": no sunrise stock photos, no gradients, no emoji, no trendy SaaS look.
- Typography first: classic serif for headings (e.g., Cormorant Garamond, EB Garamond) and a highly readable serif or humanist sans for body text. Generous line height and comfortable reading width.
- Palette: parchment / warm off-white background, deep ink text, one accent color. Rubrics (instructions within services) in traditional rubric red (#991b1b / cinnabar/crimson).
- Subtle ornament at most: a thin rule, a small cross motif (`†` or subtle fleuron/cross divider), drop caps on the office pages.
- Mobile-first, fully responsive, light, dark, and sepia reading modes, WCAG AA contrast, keyboard accessible.

### Site Header & Navigation
- Logo wordmark "Anglican Path"
- Navigation: Learn, Paths, Find a Parish, Daily Office, About.
- Clean mobile drawer / sheet menu.

### Pages and Templates to Implement
1. **Home**
   - Hero with tagline: "Find an Anglican church. Discover the Anglican faith. Pray the Daily Office."
   - Three entry cards: Learn / Find a Parish / Pray Today.
   - "Start your path" section with five path cards:
     - From Evangelical
     - From Roman Catholic
     - Orthodox-curious
     - From the Episcopal Church
     - New to Christianity
   - Today's Office teaser: date, liturgical season or feast placeholder, and buttons for "Morning Prayer" and "Evening Prayer."
   - Featured articles grid (3–6 cards).
   - Email signup form (UI only): "A short weekly letter on the Anglican way."

2. **Article Template** (`/learn/:slug` e.g., `/learn/anglican-vs-catholic`)
   - Breadcrumbs, single H1, one-sentence summary, "Reviewed by [Name, Title]" line with date, reading time.
   - Sticky table of contents on desktop, collapsible on mobile.
   - Body typography tuned for long reading: pull quotes, blockquotes for primary sources, and a side-by-side comparison table component (e.g. Anglican vs Catholic comparison columns).
   - "Primary sources" section at end with scholarly citation styling.
   - "Related questions" links and "Find a parish near you" CTA banner.
   - Semantic HTML and Article JSON-LD structured data script.

3. **Path Template** (`/paths/:pathId` e.g., `/paths/from-evangelical`)
   - Intro and overview.
   - Ordered list of 5–8 steps linking to articles with estimated reading time and interactive checkmark for "read" (persisted in client state / localStorage or UI state).
   - Final step: "Visit a parish" linking to the parish finder.

4. **Learn Index** (`/learn`)
   - Articles grouped by topic: Basics, Comparisons, Prayer Book, Sacraments, History, Jurisdictions.
   - Search filter input (filters mock articles in UI).

5. **Find a Parish** (`/find-a-parish` and `/find-a-parish/:parishId`)
   - Split view on desktop (parish list on left, Leaflet map with OpenStreetMap tiles on right); toggle between list and map on mobile.
   - Filters: Jurisdiction (e.g., ACNA, APA, REC, ACC), Prayer Book (1662 / 1928 / 2019), Churchmanship (Anglo-Catholic, Broad Church, Evangelical/Reformed Anglican), Service type (Said, Sung), Distance/Location.
   - Parish card: name, jurisdiction, address, service times, prayer book, churchmanship, "Verified by parish" badge, website link.
   - Detail view/modal with full schedule, location info, and "Suggest an update" modal form (UI only).
   - 8–10 realistic sample parishes, all clearly marked with a "[Sample Data - Fictitious Parish]" badge or label.

6. **Daily Office** (`/office` with clean route structure like `/office/:book/:office/:date`)
   - Date picker, toggle between 1928 and 1662 prayer books, and toggle between Morning Prayer and Evening Prayer.
   - Liturgical layout: section headings, rubrics in red, versicles and responses visually distinct (Officiant/Minister line vs. People line in bold), canticles, psalms with verse numbering, scripture lessons, collects.
   - Text placeholders strictly following instructions: e.g. "[1928 BCP: Venite, exultemus Domino text]", "[First Lesson: Isaiah placeholder]", "[Collect for the Day placeholder]".
   - Reading controls: text size adjustment (A- / A+), light/sepia/dark theme toggle, and audio player UI placeholder.
   - Collapsible "What is this part?" explanatory side notes / accordions beside or within each liturgical section.

7. **About** (`/about`)
   - Mission statement, statement of belief placeholder, "Reviewed by" advisory panel with priest reviewer card placeholders, and editorial standards note.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/5b13c755-e152-4884-bc59-9bb5545eb8e6).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
