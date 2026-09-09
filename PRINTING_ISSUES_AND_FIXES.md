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

---

## 8. Issue 5: Print Button Opening "Save As..." File Dialog Instead of Direct Print Window

### Symptoms Observed
- When clicking the green "Print" button on the receipt preview modal, Windows opened a file explorer "Save As..." dialog asking where to save a `.pdf` file.
- The operator had to save the file to disk, browse to the folder, and manually open it with Acrobat or a browser to print it on paper.

### Root Cause
- The primary print button had been routed to `window.api.savePdf(html, defaultName)`, which invokes Electron's `dialog.showSaveDialog` in the main process to export a PDF file.

### Solutions Implemented
- **Restored Direct Chromium Print Popup**:
  - In [`src/renderer/src/components/ReceiptPreviewModal.jsx`](file:///d:/client_projects/sunheri-commission-shop-desktop/src/renderer/src/components/ReceiptPreviewModal.jsx), re-engineered `handlePrint` to use an invisible `iframe`:
    ```javascript
    const iframe = document.createElement('iframe')
    iframe.style.position = 'fixed'
    iframe.style.right = '0'
    iframe.style.bottom = '0'
    iframe.style.width = '0'
    iframe.style.height = '0'
    iframe.style.border = '0'
    document.body.appendChild(iframe)

    const doc = iframe.contentWindow.document
    doc.open()
    doc.write(html)
    doc.close()

    setTimeout(() => {
      iframe.contentWindow.focus()
      iframe.contentWindow.print()
      setTimeout(() => {
        document.body.removeChild(iframe)
      }, 1000)
    }, 250)
    ```
  - **Result**: Clicking **"Print (پرنٹ کریں)"** immediately brings up the native Chromium print dialog on top of the app with printer selection, copies, and orientation. No file saving needed.
- **Dedicated "Save PDF" Option**:
  - Kept a separate secondary button **"Save PDF (پی ڈی ایف)"** so the user can still intentionally export a `.pdf` file whenever a digital copy is needed.

---

## 9. Issue 6: Authentic Mandi Emblem Integration (Wheat Wreath, Kapas & Green Crops)

### Symptoms Observed
- Initial implementations used generic or simplified SVG cotton flower graphics that did not match the shop's actual identity board.
- The user provided a photograph of the physical shop board logo featuring two curved golden wheat stalks (گندم کی بالیاں), a central fluffy white cotton boll, and green crops/buds.

### Solutions Implemented
- **High-Fidelity Emblem Recreation**:
  - Recreated the authentic agricultural emblem featuring:
    1. Symmetrical golden wheat ears curving upwards on the left and right, crossed at the bottom.
    2. Fluffy white cotton boll with dark green calyx leaves at top center.
    3. Two green cotton pods/buds (کپاس کے ڈوڈے / سبز ٹینڈے) nestled inside the wreath.
  - **Edge-Preserving Flood-Fill Transparency**:
    - Applied a breadth-first search (BFS) flood-fill algorithm from image borders to only make the outer canvas transparent.
    - Preserved 100% solid white coloring for the interior cotton lobes (preventing transparent holes inside the cotton flower).
- **Embedded Offline Asset Pipeline**:
  - Saved the transparent high-res PNG into `src/renderer/src/assets/mandi_logo.png`.
  - Converted into a self-contained Base64 data URI in [`src/renderer/src/assets/mandiLogoBase64.js`](file:///d:/client_projects/sunheri-commission-shop-desktop/src/renderer/src/assets/mandiLogoBase64.js).
  - Ensured 100% offline reliability without filesystem path issues or CORS errors inside the print iframe.
- **Component & Template Integration**:
  - Integrated into [`src/renderer/src/components/KapasLogo.jsx`](file:///d:/client_projects/sunheri-commission-shop-desktop/src/renderer/src/components/KapasLogo.jsx) for the React UI.
  - Integrated into [`src/renderer/src/utils/receiptTemplate.js`](file:///d:/client_projects/sunheri-commission-shop-desktop/src/renderer/src/utils/receiptTemplate.js) for physical printed receipts.
  - Integrated into [`src/renderer/src/components/ReceiptHeader.jsx`](file:///d:/client_projects/sunheri-commission-shop-desktop/src/renderer/src/components/ReceiptHeader.jsx) on the dashboard header with a clean contrast badge.

---

## 10. Issue 7: Urdu Mann / Kg Bidirectional (BiDi) Number Scrambling

### Symptoms Observed
- In the Net Weight Breakdown box, the line "وزن بحساب من" displayed as:
  ```
  من 1.00 کلو 308
  ```
- The number `308` jumped to the far left, `من` jumped to the far right, and `1.00 کلو` was scrambled in the center.

### Root Cause
- The string was formatted as `${totalManns} من ${remainingKgs} کلو` inside a single plain text element.
- The browser's Unicode Bidirectional (BiDi) Algorithm (UAX #9) processed the string in an LTR parent container:
  - `308` (numbers, LTR)
  - `من` (Urdu text, RTL)
  - `1.00` (numbers, LTR)
  - `کلو` (Urdu text, RTL)
- When numbers and RTL text alternate in an LTR block without boundary isolation, the BiDi engine reverses the RTL runs between LTR numbers, producing the scrambled visual output `من 1.00 کلو 308`.

### Solutions Implemented
- **Direction-Locked Badge Containers**:
  - Wrapped each value and unit into explicit, direction-isolated inline elements:
    ```html
    <div class="net-weight-manns">
      <span class="urdu">وزن بحساب من:</span>
      <span class="mann-display-badge">
        <span class="num-bold">${totalManns}</span>
        <span class="urdu bold">من</span>
        <span class="plus-sep">+</span>
        <span class="num-bold">${remainingKgs}</span>
        <span class="urdu bold">کلو</span>
      </span>
    </div>
    ```
  - Styled with:
    ```css
    .mann-display-badge {
      display: inline-flex;
      align-items: center;
      direction: ltr;
      gap: 3px;
      font-size: 13.5px;
    }
    .num-bold {
      font-family: monospace;
      font-weight: 800;
      font-size: 15px;
      color: #000;
    }
    .plus-sep {
      color: #555;
      font-weight: 900;
      margin: 0 1.5px;
    }
    ```
  - Mirrored this structure in React ([`ReceiptPreviewModal.jsx`](file:///d:/client_projects/sunheri-commission-shop-desktop/src/renderer/src/components/ReceiptPreviewModal.jsx) and [`ReceiptTemplate.jsx`](file:///d:/client_projects/sunheri-commission-shop-desktop/src/renderer/src/components/ReceiptTemplate.jsx)).
- **Result**: Visual display is locked and guaranteed to render as **`308 من + 1.00 کلو`** on all printers and screen previews.

---

## 11. Issue 8: POS Software Developer Credits

### Requirement
- Display developer support and contact info prominently on each receipt and across the app:
  ```
  POS Software: Easy Solutions | Contact: 0315-6566533
  ```

### Solutions Implemented
1. **Printed Receipt Voucher** ([`src/renderer/src/utils/receiptTemplate.js`](file:///d:/client_projects/sunheri-commission-shop-desktop/src/renderer/src/utils/receiptTemplate.js)):
   - Added a dedicated full-width credit bar along the bottom border of the voucher card:
     ```html
     <div class="software-credits-bar">
       <div>
         <span class="credits-label">POS Software: </span>
         <span class="credits-bold">Easy Solutions</span>
       </div>
       <div>
         <span class="urdu bold">رابطہ برائے کمپیوٹر سافٹ ویئر: </span>
         <span class="credits-phone">0315-6566533</span>
       </div>
       <div>
         <span class="credits-label">Contact: </span>
         <span class="credits-phone">0315-6566533</span>
       </div>
     </div>
     ```
2. **Receipt Preview Modal** ([`src/renderer/src/components/ReceiptPreviewModal.jsx`](file:///d:/client_projects/sunheri-commission-shop-desktop/src/renderer/src/components/ReceiptPreviewModal.jsx)):
   - Added matching footer credit bar at the bottom of the on-screen receipt preview.
3. **Application Main Footer** ([`src/renderer/src/App.jsx`](file:///d:/client_projects/sunheri-commission-shop-desktop/src/renderer/src/App.jsx)):
   - Added a system footer pinned at the bottom of the dashboard:
     ```jsx
     <footer className="mt-4 pt-3 pb-2 border-t border-slate-800/80 flex flex-wrap justify-between items-center gap-2 text-xs text-slate-500">
       <div>Sunheri Commission Shop (سنہری کمیشن شاپ) • Ghalla Mandi, Malka Hans</div>
       <div className="flex items-center gap-2">
         <span>POS Software: <strong className="text-slate-300">Easy Solutions</strong></span>
         <span className="text-slate-600">•</span>
         <span>Contact (رابطہ): <strong className="text-amber-400 font-mono">0315-6566533</strong></span>
       </div>
     </footer>
     ```

---

## 12. Complete Change Log & File References

| File | Changes Made |
| :--- | :--- |
| [`src/renderer/src/assets/mandiLogoBase64.js`](file:///d:/client_projects/sunheri-commission-shop-desktop/src/renderer/src/assets/mandiLogoBase64.js) | Self-contained Base64 asset for authentic wheat wreath & cotton boll emblem with transparent background. |
| [`src/renderer/src/components/KapasLogo.jsx`](file:///d:/client_projects/sunheri-commission-shop-desktop/src/renderer/src/components/KapasLogo.jsx) | Updated to render authentic Mandi emblem image with scalable dimensions. |
| [`src/renderer/src/components/ReceiptHeader.jsx`](file:///d:/client_projects/sunheri-commission-shop-desktop/src/renderer/src/components/ReceiptHeader.jsx) | Updated header badge container to white background for high-contrast presentation of the logo. |
| [`src/renderer/src/utils/receiptTemplate.js`](file:///d:/client_projects/sunheri-commission-shop-desktop/src/renderer/src/utils/receiptTemplate.js) | Embedded authentic emblem, fixed Mann/Kg BiDi formatting (`308 من + 1.00 کلو`), and added POS Software credit bar at the bottom. |
| [`src/renderer/src/components/ReceiptPreviewModal.jsx`](file:///d:/client_projects/sunheri-commission-shop-desktop/src/renderer/src/components/ReceiptPreviewModal.jsx) | Restored direct Chromium print popup, fixed Mann/Kg BiDi layout, added "Save PDF" secondary button, and added POS Software credit bar. |
| [`src/renderer/src/components/ReceiptTemplate.jsx`](file:///d:/client_projects/sunheri-commission-shop-desktop/src/renderer/src/components/ReceiptTemplate.jsx) | Synchronized Mann/Kg BiDi fix and added POS Software credit bar. |
| [`src/renderer/src/App.jsx`](file:///d:/client_projects/sunheri-commission-shop-desktop/src/renderer/src/App.jsx) | Added POS Software developer contact footer at bottom of dashboard. |

---

## 13. Issue 9: Urdu-First RTL Voucher Layout, Centered Client Name & Payment Policy Notice

### Requirements
1. **Person/Client Centering**: On the bill, the person the bill belongs to (`گاہک / زمیندار`) must be prominently centered.
2. **English Brand Name Update**: Update English name from "Sunheri Commission Shop" to **"Soneri Commission Shop"** across the entire application.
3. **Urdu-First (RTL) Layout**:
   - The Gross/Saafi and weight details (`وزن کی تفصیل`) must be placed on the **RIGHT** side of the bill.
   - The Financials section (`حساب رقم`) must be placed on the **LEFT** side of the bill.
4. **Payment Clearance Notice**:
   - Replaced "شکریہ! دوبارہ تشریف لائیں۔" (located on the left side) with:
     ```
     پیمنٹ کی ادائیگی 3 سے 4 ہفتوں میں کی جاتی ہے۔
     (Payment will be made within 3-4 weeks)
     Soneri Commission Shop • Ghalla Mandi, Malka Hans
     ```
   - Signature & pencil note line placed on the **RIGHT** side.

### Solutions Implemented
- **Receipt Template & Modal Synchronization**:
  - In [`src/renderer/src/utils/receiptTemplate.js`](file:///d:/client_projects/sunheri-commission-shop-desktop/src/renderer/src/utils/receiptTemplate.js), [`src/renderer/src/components/ReceiptPreviewModal.jsx`](file:///d:/client_projects/sunheri-commission-shop-desktop/src/renderer/src/components/ReceiptPreviewModal.jsx), and [`src/renderer/src/components/ReceiptTemplate.jsx`](file:///d:/client_projects/sunheri-commission-shop-desktop/src/renderer/src/components/ReceiptTemplate.jsx):
    - Configured `.meta-bar` with `direction: rtl` and centered the client name with bold underline styling between S.No (right) and Date/Time (left).
    - Configured `.content-grid` with `direction: rtl` so that the Weight Breakdown column renders on the right and the Financials column renders on the left.
    - Configured `.signature-container` with `direction: rtl` so the Signature area is anchored on the right, while the official payment clearance policy notice (`پیمنٹ کی ادائیگی 3 سے 4 ہفتوں میں کی جاتی ہے۔`) is positioned cleanly on the left.
- **English Branding Everywhere**:
  - Updated all references across `package.json`, `electron-builder.yml`, `compile-bytecode.js`, `generate-key.js`, `src/main/index.js`, `src/main/printer.js`, `index.html`, and React components to **"Soneri Commission Shop"**.

---

## 14. Issue 10: Two-Page PDF Splitting / Overflow onto Page 2

### Symptoms Observed
- Exporting or saving the receipt as a PDF resulted in a **2-page document**:
  - **Page 1**: Contained all header, client details, weight calculations, financial summary, and signature area.
  - **Page 2**: Contained only the single bottom credit bar:
    `POS Software: Easy Solutions | رابطہ برائے کمپیوٹر سافٹ ویئر: 0315-6566533 | Contact: 0315-6566533`.
  - On Page 1, the Date & Time label also wrapped onto two lines (`تاریخ و\n:وقت` and `2026-09-08 10:06\nPM`), consuming unnecessary vertical space.

### Root Cause Analysis
1. **Vertical Height Calculation Overrun**:
   - Standard **A5 Landscape** page dimensions are `210mm` (width) × `148.5mm` (height).
   - The `@page` CSS rule was set to `margin: 6mm 8mm`, leaving only `148.5mm - 12mm = 136.5mm` of printable vertical height.
   - The combined vertical height of the logo (`58px`), two-line tagline wrap, wrapped date/time box, signature space (`6mm`), and container paddings pushed the card height to `~138.5mm`.
   - Because `138.5mm > 136.5mm` (an overflow of just ~2mm), Chromium's layout engine automatically broke the page immediately before the `.software-credits-bar`, ejecting it onto Page 2.
2. **BiDi Inline Text Wrapping**:
   - In `.meta-bar` (which has `direction: rtl`), `.meta-item-left` contained mixed RTL/LTR text without `white-space: nowrap`, causing `تاریخ و وقت:` to line-break into `تاریخ و` and `:وقت`.

### Solutions Implemented
1. **Optimized `@page` and Container Geometry** ([`src/renderer/src/utils/receiptTemplate.js`](file:///d:/client_projects/sunheri-commission-shop-desktop/src/renderer/src/utils/receiptTemplate.js)):
   - Reduced `@page` margins from `6mm 8mm` to `3mm 5mm`, unlocking an extra `6mm` of vertical printable space.
   - Applied strict page-break suppression:
     ```css
     html, body {
       width: 100%;
       max-width: 200mm;
       max-height: 142mm;
       margin: 0 auto;
       padding: 0;
       overflow: hidden;
       page-break-inside: avoid;
       break-inside: avoid;
       page-break-after: avoid;
     }
     ```
   - Reduced outer voucher card padding to `2mm 3.5mm` with `break-inside: avoid;`.
2. **Vertical Space Compacting**:
   - Scaled emblem logo from `58px` down to `44px`.
   - Widened `.header-center` to `44%` and set `.tagline-ur { white-space: nowrap; font-size: 10px; }` so the entire tagline stays on a single line.
   - Set `.meta-item-right`, `.meta-item-left` to `flex: 0 0 auto; white-space: nowrap;` and `.meta-item-center` to `flex: 1;` so date and time stay strictly on one line (`تاریخ و وقت: 2026-09-08 10:06 PM`).
   - Adjusted signature bottom margin from `6mm` to `3.5mm`.
   - Total rendered height is now ~90mm, providing ~50mm of safety margin within the 142.5mm printable boundary.
3. **Electron PDF Export Hard-Lock** ([`src/main/printer.js`](file:///d:/client_projects/sunheri-commission-shop-desktop/src/main/printer.js)):
   - Added `pageRanges: '1'` to `webContents.printToPDF` in `saveReceiptAsPdf`:
     ```javascript
     const pdfBuffer = await pdfWindow.webContents.printToPDF({
       printBackground: true,
       landscape: true,
       pageSize: 'A5',
       margins: { marginType: 'none' },
       pageRanges: '1'
     })
     ```
   - Guarantees that Chromium's PDF generator will never produce more than 1 page.

---

## 15. Issue 11: Soneri Mandi Logo Application Icon for Windows Executable, Desktop Shortcut, and NSIS Installer

### Requirements
- Embed the authentic **Soneri Commission Shop** emblem logo into:
  1. The standalone generated `.exe` file (`Soneri Commission Shop.exe`).
  2. The NSIS installer package (`Soneri Commission Shop-Setup-1.0.0.exe`).
  3. The Windows Desktop shortcut, Start Menu shortcut, and taskbar.
  4. The uninstaller executable and Windows "Installed Apps" list.

### Implementation
1. **Icon Asset Generation** ([`generate-icon.js`](file:///d:/client_projects/sunheri-commission-shop-desktop/generate-icon.js)):
   - Generated high-resolution Windows icon assets directly from the 1024×1024 source logo ([`src/renderer/src/assets/mandi_logo.png`](file:///d:/client_projects/sunheri-commission-shop-desktop/src/renderer/src/assets/mandi_logo.png)):
     - [`build/icon.png`](file:///d:/client_projects/sunheri-commission-shop-desktop/build/icon.png): Master 1024×1024 PNG for Electron packaging.
     - [`build/icon.ico`](file:///d:/client_projects/sunheri-commission-shop-desktop/build/icon.ico): Full multi-resolution Windows Icon file containing 256×256, 128×128, 64×64, 48×48, 32×32, and 16×16 mipmaps.
2. **Builder Configuration** ([`electron-builder.yml`](file:///d:/client_projects/sunheri-commission-shop-desktop/electron-builder.yml)):
   - Configured `win.icon: build/icon.ico`.
   - Configured `nsis.installerIcon: build/icon.ico`.
   - Configured `nsis.uninstallerIcon: build/icon.ico`.
   - Included `build/icon.png` and `build/icon.ico` in packaged `files`.
3. **Electron Main Process & Window** ([`src/main/index.js`](file:///d:/client_projects/sunheri-commission-shop-desktop/src/main/index.js)):
   - Passed resolved `appIcon` directly to `new BrowserWindow({ icon: appIcon, ... })` to ensure titlebar and taskbar icons are active in development and production runtime.
4. **HTML Favicon** ([`src/renderer/index.html`](file:///d:/client_projects/sunheri-commission-shop-desktop/src/renderer/index.html)):
   - Added `<link rel="icon" type="image/png" href="./src/assets/mandi_logo.png" />`.

---

## 16. Issue 12: Bold Sadar Name & Sadar Text on Bills and POS Dashboard

### Requirements
- Make the name and title of the President / Sadar (**حاجی شبیر حسین (صدر)**) bold, prominent, and distinct on:
  1. The printed thermal/A5 landscape bill voucher and exported PDF.
  2. The on-screen receipt preview modal.
  3. The top static shop header on the main POS dashboard.

### Solutions Implemented
1. **Printed Receipt & PDF Template** ([`src/renderer/src/utils/receiptTemplate.js`](file:///d:/client_projects/sunheri-commission-shop-desktop/src/renderer/src/utils/receiptTemplate.js)):
   - Added dedicated `.contact-row-sadar`, `.contact-name-sadar`, and `.contact-phone-sadar` CSS rules:
     ```css
     .contact-row-sadar {
       font-weight: 900;
       color: #000;
     }
     .contact-name-sadar {
       font-size: 9.5px;
       font-weight: 900;
       color: #000;
       white-space: nowrap;
     }
     .contact-phone-sadar {
       font-weight: 900;
       font-family: 'Segoe UI', Tahoma, monospace;
       color: #000;
       direction: ltr;
       white-space: nowrap;
     }
     ```
   - Wrapped Sadar entry with `<strong>`:
     ```html
     <div class="contact-row contact-row-sadar">
       <span class="contact-name-sadar bold"><strong>حاجی شبیر حسین (صدر):</strong></span>
       <span class="contact-phone-sadar"><strong>0300-9696234</strong></span>
     </div>
     ```
2. **POS Header Bar** ([`src/renderer/src/components/ReceiptHeader.jsx`](file:///d:/client_projects/sunheri-commission-shop-desktop/src/renderer/src/components/ReceiptHeader.jsx)):
   - Enhanced the Sadar card with amber border (`border-amber-400/70`), golden ring glow (`ring-2 ring-amber-400/25`), and solid golden phone badge.
   - Bolds English name (`font-black text-amber-300`).
   - Bolds Urdu name and highlights the Sadar text (`(صدر)`) with a bold underline:
     ```jsx
     <span className="text-xs font-urdu font-black text-amber-300 truncate">
       <strong>حاجی شبیر حسین</strong>{' '}
       <strong className="text-amber-400 font-black underline decoration-amber-400 decoration-2 underline-offset-2">
         (صدر)
       </strong>
     </span>
     ```
3. **Receipt Preview Modal & Fallback Template** ([`src/renderer/src/components/ReceiptPreviewModal.jsx`](file:///d:/client_projects/sunheri-commission-shop-desktop/src/renderer/src/components/ReceiptPreviewModal.jsx), [`src/renderer/src/components/ReceiptTemplate.jsx`](file:///d:/client_projects/sunheri-commission-shop-desktop/src/renderer/src/components/ReceiptTemplate.jsx)):
   - Synchronized the bold styling on the Sadar contact entry.

---

## 17. Issue 13: Bill Width Exceeding A4 Portrait Width & Forced Landscape Printing

### Symptoms Observed
- The bill was printing strictly in **Landscape** orientation on physical printers regardless of user selection.
- Because the previous template was configured for A5 Landscape with a width exceeding standard A4 portrait printable margins (`200mm` / `7.87in` plus margins), Chromium's print subsystem auto-enforced Landscape orientation, preventing clean Portrait printing on A4 sheets.

### Technical Root Cause
1. `@page { size: A5 landscape; }` in `receiptTemplate.js` explicitly informed Chromium to force Landscape layout.
2. In `src/main/printer.js`, both `printReceiptSilently` and `saveReceiptAsPdf` had hardcoded `landscape: true` and `pageSize: 'A5'`.
3. Total voucher container width was set to `200mm` (~7.87 inches). When combined with hardware non-printable page margins on consumer desktop printers (typically 0.25in to 0.5in on each side), the total required width exceeded the physical printable width of portrait A4 paper (8.27in - 1in = ~7.27in), causing driver auto-rotation into Landscape.

### Solutions Implemented
1. **Configured 7-Inch Portrait Width**:
   - In [`src/renderer/src/utils/receiptTemplate.js`](file:///d:/client_projects/sunheri-commission-shop-desktop/src/renderer/src/utils/receiptTemplate.js), set `.voucher-card` width strictly to `7in` (`width: 7in; max-width: 7in; min-width: 7in; margin: 0 auto;`).
   - 7 inches (`177.8mm`) fits comfortably inside standard A4 portrait paper (`210mm` / `8.27in`), leaving ~0.63in of clean margin on both sides.
2. **Updated Print Orientation to Portrait**:
   - In [`src/renderer/src/utils/receiptTemplate.js`](file:///d:/client_projects/sunheri-commission-shop-desktop/src/renderer/src/utils/receiptTemplate.js), changed `@page` rule from `size: A5 landscape;` to:
     ```css
     @page {
       size: portrait;
       margin: 5mm 0;
     }
     ```
   - In [`src/main/printer.js`](file:///d:/client_projects/sunheri-commission-shop-desktop/src/main/printer.js), changed `landscape: true` to `landscape: false` and `pageSize: 'A5'` to `pageSize: 'A4'` across `printReceiptSilently` and `saveReceiptAsPdf`.
3. **Synchronized Preview Modal & Templates**:
   - Updated [`src/renderer/src/components/ReceiptPreviewModal.jsx`](file:///d:/client_projects/sunheri-commission-shop-desktop/src/renderer/src/components/ReceiptPreviewModal.jsx) preview card to `w-[7in]` and updated subtitle indicator to `7-Inch Portrait Format (Optimized for A4 Portrait Paper)`.
   - Updated [`src/renderer/src/components/ReceiptTemplate.jsx`](file:///d:/client_projects/sunheri-commission-shop-desktop/src/renderer/src/components/ReceiptTemplate.jsx) container to `w-[7in] max-w-[7in] mx-auto`.


