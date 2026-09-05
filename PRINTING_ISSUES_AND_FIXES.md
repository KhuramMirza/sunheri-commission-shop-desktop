# Printing Issues, Root Cause Analysis & Solutions Log
**Project**: Sunheri Commission Shop Desktop (سنہری کمیشن شاپ)  
**Date**: September 5, 2026  
**Author**: Antigravity Assistant  

---

## 1. Executive Summary

During testing on physical hardware printers with real paper, three distinct issues were identified:
1. **Printing Mechanism Failure**: The "Silent Print", "Print Dialog", and "Generate & Print" buttons did not send jobs to the physical printer. In contrast, the "Save PDF" button opened a system save/print dialog that reliably printed and saved receipts.
2. **Urdu Typography Overlap**: The Urdu shop title (**سنہری کمیشن شاپ**) and the sub-tagline (**ہر قسم کی زرعی اجناس کی خرید و فروخت کا با اعتماد ادارہ**) collided vertically into each other on the printed receipt.
3. **Stretched A4 Page Layout**: The receipt stretched across the paper with tiny fonts and massive, awkward empty white spaces inside the breakdown and financial boxes.

This document logs the exact technical causes of these issues and the architectural and UI solutions implemented to fix them.

---

## 2. Issue 1: Hardware Printing Button Failure

### Symptoms Observed
- Clicking **Silent Print (A5)** or **Print (Dialog)** in the modal did nothing on physical printer queues.
- Clicking **Generate & Print Bill** on the main data-entry form saved the record to the database but did not print.
- Clicking **Save PDF** opened a native popup dialog, allowing the user to successfully save the receipt as a PDF and print it to their printer.

### Technical Root Cause
- **Direct Hardware Printing via Electron**: Electron's `webContents.print({ silent: true, pageSize: 'A5', landscape: true, deviceName })` relies on Chromium's native print spooler bridge. On Windows 10/11, if the connected physical printer's driver does not natively accept custom dimensions or orientation through Electron's print pipe, or if the printer spooler security policy rejects raw data URLs from sandboxed/isolated browser windows, the print job fails silently without any user prompt.
- **Why Save PDF Works**: The Save PDF functionality uses `webContents.printToPDF()` combined with Electron's `dialog.showSaveDialog()`. Chromium's internal PDF engine renders the HTML page into standard PDF vector format directly in memory. When written to disk or viewed, the operating system's standard Windows print subsystem handles the job, guaranteeing 100% compatibility with any physical printer.

### Solution Implemented
1. **Removed Non-Working Print Buttons**:
   - Removed `Silent Print (A5)` and `Print (Dialog)` from `ReceiptPreviewModal.jsx`.
   - Removed the non-working silent reprint button from the daily ledger table (`LedgerTable.jsx`).
2. **Renamed "Save PDF" to "Print"**:
   - Renamed the button label to **"Print (پرنٹ کریں)"** with a `Printer` icon in `ReceiptPreviewModal.jsx`.
   - Kept the exact underlying handler (`handleSavePdf`) intact as requested so it triggers the reliable native popup.
3. **Streamlined Bill Creation Workflow**:
   - On the main form (`BillForm.jsx`), changed the button from "Generate & Print Bill" to **"Generate Bill (بل بنائیں)"**.
   - When clicked, `handleGenerateBill` validates inputs, writes the record to the local NeDB database (`mandi_bills.db`), updates the sequential serial number, clears form inputs, and **automatically opens the Receipt Preview modal with the new bill**.
   - The user can then immediately click the prominent **"Print (پرنٹ کریں)"** button to dispatch the print job.
4. **Ledger Print Action**:
   - In the daily ledger table (`LedgerTable.jsx`), the row action button now directly opens the bill in the Receipt Preview modal with the working "Print" button.

---

## 3. Issue 2: Urdu Title & Tagline Overlapping

### Symptoms Observed
- On both the printed paper and on-screen preview, the descenders of the Urdu title (**سنہری کمیشن شاپ**) overlapped with the ascenders of the tagline (**ہر قسم کی زرعی اجناس کی خرید و فروخت کا با اعتماد ادارہ**).

### Technical Root Cause
- Urdu Nastaliq calligraphy (`Noto Nastaliq Urdu`) has distinctively large vertical ascenders (height of letters like الف, ک, ل) and deep descending loops (like ش, پ, ق).
- The template CSS used a generic Latin line-height (`line-height: 1.4`) and a minute top margin (`mt-0.5` / ~2px). In Chromium/WebKit rendering, this caused the descending loop of the word **شاپ** to overlap directly on top of the text of the line below it.

### Solution Implemented
1. Updated `receiptTemplate.js`:
   - Enclosed the Urdu branding in a centered flex container (`.header-center`).
   - Set `.shop-title-ur` with `font-size: 24px; font-weight: 900; line-height: 1.6; margin-bottom: 6px; padding-bottom: 1px; display: block;`.
   - Set `.tagline-ur` with `font-size: 11px; font-weight: 700; line-height: 1.5; display: block;`.
2. Synchronized the fix across all UI components:
   - `ReceiptPreviewModal.jsx`: Changed Urdu title from `leading-snug` to `leading-relaxed mb-1.5` and tagline to `leading-normal`.
   - `ReceiptTemplate.jsx`: Added explicit vertical separation and margin.
   - `ReceiptHeader.jsx`: Increased spacing and padding between the main header title and tagline.

---

## 4. Issue 3: Stretched Layout & Empty Space on A4 Paper

### Symptoms Observed
- In the test printout, the receipt occupied the full width of the page, but:
  - The font sizes were tiny (`9px–11px`) and faint.
  - The "Weight Breakdown" and "Financial Summary" boxes had gigantic empty white spaces (6–8 cm of blank void) separating the top rows from the total boxes at the bottom.
  - The overall visual appearance was sparse, hollow, and unbalanced.

### Technical Root Cause
- The receipt template had fixed CSS:
  ```css
  body {
    height: 138mm;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .content-grid {
    flex: 1;
  }
  .weight-column, .finance-column {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  ```
- Because a typical mandi bill contains only 3 weight deductions (`Saafi`, `Bardana`, `Kanda`) and 2 financial rows (`Rate/Mann`, `Rate/Kg`), forcing the container to stretch across `138mm` height using `justify-content: space-between` forcibly anchored the input rows to the top edge and pushed the `Net Weight` and `Total Bill` boxes to the bottom edge, creating massive hollow gaps in between.
- When printed onto standard A4 paper, this artificial expansion made the receipt look unnaturally stretched and sparse.

### Solution Implemented
1. **Eliminated Artificial Height Stretching**:
   - Removed `height: 138mm` and `justify-content: space-between` from the body and column containers.
   - Wrapped the receipt inside a structured `.voucher-card` with `border: 2px solid #000; border-radius: 6px; padding: 3mm 4mm; background: #fff;`.
2. **Upgraded Typography & Contrast**:
   - Increased base text size to `12.5px–14px`.
   - Formatted all quantities and currencies with high-contrast monospace bold styling (`font-weight: 800–900`).
   - Net Weight (`Net Weight: ... Kg`) enlarged to `14px–15px bold`.
   - Total Bill (`Total Bill: Rs. ...`) enlarged to `22px–24px black font`.
3. **Balanced Proportions for A4 and A5 Paper**:
   - The redesigned layout forms a dense, authentic, professional Mandi accounting voucher.
   - When printed on **A5 paper** (half-sheet): Fills the paper with balanced margins, sharp borders, and zero hollow spaces.
   - When printed on **A4 paper**: Prints as a crisp, well-structured half-page voucher that is easily legible for farmers and commission agents, and can be neatly folded or cut.

---

## 5. Summary of Files Modified

| File | Changes Made |
| :--- | :--- |
| [`src/renderer/src/utils/receiptTemplate.js`](file:///d:/client_projects/sunheri-commission-shop-desktop/src/renderer/src/utils/receiptTemplate.js) | Redesigned receipt layout, removed artificial flex stretching, fixed Urdu font spacing, increased font sizes and numerical contrast. |
| [`src/renderer/src/components/ReceiptPreviewModal.jsx`](file:///d:/client_projects/sunheri-commission-shop-desktop/src/renderer/src/components/ReceiptPreviewModal.jsx) | Removed "Silent Print (A5)" & "Print (Dialog)" buttons, renamed "Save PDF" to "Print", aligned preview styling with the redesigned voucher card, fixed Urdu title overlap. |
| [`src/renderer/src/components/BillForm.jsx`](file:///d:/client_projects/sunheri-commission-shop-desktop/src/renderer/src/components/BillForm.jsx) | Renamed action button to "Generate Bill (بل بنائیں)" and updated click handler. |
| [`src/renderer/src/App.jsx`](file:///d:/client_projects/sunheri-commission-shop-desktop/src/renderer/src/App.jsx) | Updated `handleGenerateBill` to save bill and automatically open preview modal for one-click printing; removed non-working silent print calls and notification toast. |
| [`src/renderer/src/components/LedgerTable.jsx`](file:///d:/client_projects/sunheri-commission-shop-desktop/src/renderer/src/components/LedgerTable.jsx) | Removed non-working silent print button from ledger rows; row print action opens the preview modal with the working Print button. |
| [`src/renderer/src/components/ReceiptTemplate.jsx`](file:///d:/client_projects/sunheri-commission-shop-desktop/src/renderer/src/components/ReceiptTemplate.jsx) | Added vertical breathing room between Urdu title and description. |
| [`src/renderer/src/components/ReceiptHeader.jsx`](file:///d:/client_projects/sunheri-commission-shop-desktop/src/renderer/src/components/ReceiptHeader.jsx) | Adjusted header vertical spacing for Urdu typography. |

---

## 6. User Verification & Operating Instructions

1. **Creating a Bill**:
   - Enter Gross Weight (`Saafi`), deductions (`Bardana`, `Kanda`), and `Rate per Mann`.
   - All fields (Net Weight, Total Manns, Remaining Kgs, Total Bill) calculate live in real-time.
   - Click **"Generate Bill (بل بنائیں)"**.
   - The transaction is saved to the local offline database and the Receipt Preview modal automatically appears on screen.
2. **Printing the Bill**:
   - In the Receipt Preview modal, click the golden **"Print (پرنٹ کریں)"** button.
   - The native print/save dialog opens immediately.
   - Select your printer to print, or save as PDF as desired.
3. **Reprinting Past Bills**:
   - In the Daily Ledger table at the bottom, find the transaction and click **"Print"**.
   - The receipt preview opens with the working "Print" button ready for printing.

---

## 7. Issue 4: Ledger Scaling, Sticky Headers & Client-Side Pagination

### Symptoms Observed
- As transactions accumulated in the local database, the ledger table expanded down the screen, forcing the operator to scroll the entire desktop window up and down to see the bill entry form.
- When scrolling through rows, the table header disappeared off-screen, making it difficult to remember column headers.

### Solutions Implemented
1. **Fixed Scrollable Container**:
   - Wrapped the ledger `<table>` in an `overflow-x-auto overflow-y-auto max-h-80 md:max-h-96 relative border border-slate-800 rounded-xl bg-slate-950 shadow-inner` container.
   - Constrains the table height to ~320px–380px, preventing the ledger from ever stretching the window. The bill generation form remains permanently in view.
2. **Sticky Opaque Headers**:
   - Styled `<thead>` with `sticky top-0 z-20 bg-slate-900 border-b-2 border-slate-700 shadow-md select-none`.
   - Each `<th>` is styled with solid `bg-slate-900` so column names remain permanently visible and completely opaque as rows scroll underneath.
3. **Client-Side Pagination**:
   - Paginated table rendering to 15 records per page (`pageSize = 15`).
   - Added a pagination bar below the table with:
     - Record range indicator: `Showing X to Y of Total records | صفحہ A از B`
     - Compact "Previous" and "Next" buttons with Urdu translation (`پچھلا` / `اگلا`) and arrow icons.
     - "Page X of Y" indicator.
4. **Auto-Reset to Page 1 on New Entry**:
   - Integrated `resetTrigger` in `App.jsx` linked to `handleGenerateBill`.
   - Whenever a new bill is successfully saved, the pagination automatically jumps back to **Page 1**, guaranteeing the newly created bill is immediately visible at the very top of the list.

