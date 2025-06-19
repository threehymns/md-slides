# Markdown Slideshow Creator

**Create and deliver stunning presentations with the power and simplicity of Markdown.**

Markdown Slideshow Creator is a web-based application designed for anyone who wants to build presentations quickly and efficiently. Write your content in Markdown, organize your slides, customize backgrounds, and present with ease.

## Core Features

*   **Intuitive Markdown Editor:** Focus on your content. Use standard Markdown syntax to create slides. Includes a "Load Sample" feature to get you started. Supports setting image or video backgrounds per slide deck.
*   **Flexible Slide Deck Management:**
    *   Create multiple slide decks, each as a separate Markdown document.
    *   Set custom titles for each deck.
    *   Slide decks are persisted via the browser's local storage.
*   **Powerful Presentation Management:**
    *   Combine multiple slide decks into a single, coherent presentation.
    *   Easily reorder slide decks within a presentation using drag-and-drop.
    *   Add or remove slide decks from your presentations as needed.
    *   Presentations are persisted via the browser's local storage.
*   **Engaging Slideshow Mode:** Present your slides directly in the browser with keyboard navigation (full-screen or browser-fill).
*   **Customizable Experience:**
    *   Light, Dark, and System theme support.
    *   Configurable settings for appearance, keyboard shortcuts, navigation, and styling (details to be expanded as settings are fully reviewed).

## Getting Started (Local Development)

This project is built with Vite, React, TypeScript, and Tailwind CSS.

1.  **Clone the repository:**
    ```sh
    git clone <YOUR_GIT_URL> # Replace with your project's Git URL
    ```
2.  **Navigate to the project directory:**
    ```sh
    cd <YOUR_PROJECT_NAME> # Replace with your project's directory name
    ```
3.  **Install dependencies:**
    ```sh
    npm i
    ```
4.  **Start the development server:**
    ```sh
    npm run dev
    ```
    This will typically open the application in your browser at `http://localhost:5173`.

## Technologies Used

*   **Frontend Framework:** React
*   **Language:** TypeScript
*   **Build Tool:** Vite
*   **Styling:** Tailwind CSS
*   **UI Components:** shadcn-ui (built on Radix UI)
*   **Markdown Parsing:** marked
*   **Routing:** React Router DOM
*   **State Management:** React Context API (supplemented with React Query for server state if applicable, though not explicitly backend-focused for core features)
*   **Animations:** Framer Motion
*   **Icons:** Lucide React

## Features Roadmap

Below is a roadmap of current and planned features for the Markdown Slideshow Creator.

---

### Core Functionality (Currently Implemented)

*   **Markdown Editor:**
    *   Create slides using standard Markdown syntax.
    *   `---` as a slide separator.
    *   Sample Markdown loader.
    *   Input for background URL per slide deck.
    *   Selection for background media type (image/video).
*   **Slide Deck Management:**
    *   Create, title, and manage individual slide decks.
    *   Persisted via browser's local storage.
*   **Presentation Management:**
    *   Group multiple slide decks into a presentation.
    *   Drag-and-drop reordering of slide decks within a presentation.
    *   Add/remove slide decks from a presentation.
    *   Presentation structure also persisted via local storage.
*   **Slideshow Mode:**
    *   Full-screen or browser-fill presentation view.
    *   Keyboard navigation (Arrow keys, Space, Home, End).
*   **Basic Settings:**
    *   Theme selection (Light/Dark/System).
    *   (Other settings related to Appearance, Keyboard, Navigation, Style need verification for full feature list).

---

### Planned Enhancements (Short to Medium Term)

*   **Advanced Editor Features:**
    *   [ ] Real-time Markdown preview panel (side-by-side with editor).
    *   [ ] Rich text editing toolbar for common Markdown commands (bold, italics, lists, links, images, code blocks).
    *   [ ] Integrated spell check.
    *   [ ] Find and replace functionality within the editor.
    *   [ ] Word/character count.
*   **Enhanced Slide Options & Customization:**
    *   [ ] Slide transition animations (e.g., fade, slide, zoom, none).
    *   [ ] Per-slide background overrides within a single Markdown deck (e.g., using a directive like `<!-- background: URL -->`).
    *   [ ] Simple slide layout options/directives (e.g., two-column, image-left/text-right).
    *   [ ] Global presentation-level default background setting.
*   **Presenter Tools:**
    *   [ ] Presenter notes (Markdown-supported, visible only to the presenter in a separate window or dedicated view).
    *   [ ] On-screen timer/clock for presentation pacing.
    *   [ ] "Blank screen" mode (e.g., press 'B' to black out, 'W' to white out).
*   **Export & Sharing:**
    *   [ ] Export presentation to PDF (client-side generation).
    *   [ ] Export presentation to a self-contained HTML file (bundling necessary assets).
    *   [ ] Generate unique, shareable links for presentations (read-only view, possibly using URL hash or query params to store data if no backend).
*   **Theming & Styling Improvements:**
    *   [ ] More granular control over theme colors (primary, secondary, accent, text) and fonts through settings UI.
    *   [ ] User-defined custom CSS input for advanced global styling.
    *   [ ] Ability to save and manage multiple custom themes (persisted in local storage).
*   **Media Management:**
    *   [ ] Simple media library: upload images/videos (store in local storage or IndexedDB if large, or link from web), view, select for backgrounds.
    *   [ ] Folder organization within the media library.
*   **Usability & UX:**
    *   [ ] Comprehensive keyboard navigation for all app functions (not just slideshow).
    *   [ ] Autosave for Markdown editor content (local storage based, with visual feedback).
    *   [ ] Confirmation dialogs for destructive actions (e.g., deleting a deck, presentation).
    *   [ ] Drag-and-drop slide decks from a library panel directly onto the presentation manager view.
    *   [ ] Clearer visual distinction and terminology between "slide decks" (as editable Markdown documents/files) and "presentations" (as ordered collections of decks for slideshows).
    *   [ ] Import/Export of individual slide decks (e.g., as `.md` files).

---

### Future Ideas (Long Term)

*   **Collaboration Features (Requires Backend):**
    *   [ ] Real-time co-editing of slide decks.
    *   [ ] Commenting system on slides for feedback.
    *   [ ] User accounts and roles for managing shared presentations.
*   **Advanced Content & Interactivity:**
    *   [ ] Support for embedding external content (e.g., YouTube, Vimeo, CodePen, Figma) via oEmbed or iframe.
    *   [ ] Built-in basic charting capabilities using Markdown extensions (e.g., Mermaid.js).
    *   [ ] Simple polls / Q&A features for audience interaction during presentations (could be client-side or require a lightweight backend).
    *   [ ] Drawing/annotation tools for use during live presentations.
*   **Version Control & History:**
    *   [ ] Version history for slide decks (local storage based, potentially with diff view).
    *   [ ] Named versions or snapshots of presentations.
*   **Templates & Asset Library:**
    *   [ ] Library of pre-designed slide templates (structure and styling).
    *   [ ] Access to royalty-free stock image/icon libraries via API integration (e.g., Unsplash, Pexels - may require API keys).
*   **Integrations (May Require Backend/OAuth):**
    *   [ ] Integration with cloud storage (Google Drive, Dropbox, OneDrive) for importing/exporting/syncing presentations.
    *   [ ] Calendar integration (Google Calendar, Outlook Calendar) for scheduling presentation work or delivery.
*   **AI-Powered Features (May Require Backend/API Keys):**
    *   [ ] AI-assisted content generation or summarization for slides.
    *   [ ] AI-powered design suggestions (layouts, color palettes based on content).
    *   [ ] Automatic image alt-text generation for accessibility.
    *   [ ] Voice-to-text for drafting slides or presenter notes.
*   **Offline Support & Desktop Application:**
    *   [ ] Progressive Web App (PWA) features for robust offline access and editing.
    *   [ ] Potential for a wrapped desktop application (e.g., Electron, Tauri) for enhanced system integration.
*   **Analytics:**
    *   [ ] Basic analytics on presentation views (if shared publicly and a backend is available).
    *   [ ] Time spent per slide during presentation (local tracking for self-improvement).

```
