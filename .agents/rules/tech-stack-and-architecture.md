---
trigger: always_on
---

# Technology Stack
- Framework: Electron.js with a React.js frontend.
- Language: JavaScript (DO NOT use TypeScript).
- Styling: Tailwind CSS for a clean, dense, data-entry grid layout.
- Database: Use NeDB or a local `.json` file-based NoSQL storage approach. DO NOT use SQL, SQLite, or Python backends. The app must run entirely offline as a standalone executable.

# Functional Requirements
- Silent Printing: Use Electron's `webContents.print({ silent: true })` API. Generate a hidden HTML template formatted like a physical receipt, populate it with React state data, and send it directly to the default printer without triggering a system print dialog.
- State Management: Use React Context or standard local state to handle the real-time mathematical calculations on the main form.
- Database Updating: The bottom ledger table must automatically re-fetch or append the new record the moment a transaction is saved.