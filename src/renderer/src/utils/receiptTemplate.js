import { MANDI_LOGO_BASE64 } from '../assets/mandiLogoBase64.js'

/**
 * Generates an optimized, self-contained HTML receipt template
 * specifically formatted for 7-inch width in Portrait orientation (fitted for standard A4 Portrait paper).
 * Engineered for high-contrast legibility, no hollow vertical gaps, and proper Urdu typography.
 * @param {object} bill - Bill record containing all transaction & calculated fields
 * @returns {string} Fully self-contained HTML document string
 */
export function generateReceiptHtml(bill) {
  const serialNo = bill.serialNo || 1
  const date = bill.date || new Date().toISOString().split('T')[0]
  const time = bill.createdAt
    ? new Date(bill.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  const clientName = bill.clientName ? bill.clientName.trim() : 'Cash Client (نقد گاہک)'
  const saafi = Number(bill.saafiWeight || 0).toFixed(2)
  const bardana = Number(bill.bardanaWeight || 0).toFixed(2)
  const kanda = Number(bill.kandaWeight || 0).toFixed(2)
  const netWeight = Number(bill.netWeight || 0).toFixed(2)
  const totalManns = bill.totalManns || 0
  const remainingKgs = Number(bill.remainingKgs || 0).toFixed(2)
  const ratePerMann = Number(bill.ratePerMann || 0).toFixed(2)
  const ratePerKg = Number(
    bill.ratePerKg || (bill.ratePerMann ? bill.ratePerMann / 40 : 0)
  ).toFixed(2)
  const totalBill = Number(bill.totalBill || 0).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })

  return `<!DOCTYPE html>
<html lang="ur" dir="ltr">
<head>
  <meta charset="UTF-8">
  <title>Receipt #${serialNo} - Soneri Commission Shop</title>
  <style>
    @page {
      size: portrait;
      margin: 5mm 0;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    html, body {
      width: 100%;
      margin: 0 auto;
      padding: 0;
      display: flex;
      justify-content: center;
      align-items: flex-start;
      overflow: hidden;
      font-family: 'Segoe UI', Tahoma, -apple-system, BlinkMacSystemFont, 'Noto Nastaliq Urdu', 'Noto Sans Arabic', sans-serif;
      font-size: 11.5px;
      line-height: 1.25;
      color: #000;
      background: #fff;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
      page-break-inside: avoid;
      break-inside: avoid;
      page-break-after: avoid;
    }
    .urdu {
      font-family: 'Noto Nastaliq Urdu', 'Noto Sans Arabic', 'Urdu Typesetting', Tahoma, sans-serif;
    }
    .text-center { text-align: center; }
    .text-right { text-align: right; }
    .text-left { text-align: left; }
    .bold { font-weight: bold; }

    /* Outer Voucher Card - Strictly 7 Inches Wide for Portrait on A4 Paper */
    .voucher-card {
      width: 7in;
      max-width: 7in;
      min-width: 7in;
      box-sizing: border-box;
      border: 2px solid #000;
      border-radius: 5px;
      padding: 2.5mm 3.5mm;
      background: #fff;
      margin: 0 auto;
      page-break-inside: avoid;
      break-inside: avoid;
      page-break-after: avoid;
    }

    /* Header Styles */
    .header-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 1.8mm;
      border-bottom: 2px solid #000;
      gap: 2.5mm;
    }
    .header-left {
      width: 28%;
      text-align: left;
    }
    .shop-title-en {
      font-size: 14px;
      font-weight: 900;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      line-height: 1.15;
    }
    .location-text {
      font-size: 10.5px;
      font-weight: 700;
      color: #222;
      margin-top: 1px;
    }
    .location-text-ur {
      font-size: 10.5px;
      color: #333;
      margin-top: 0.5px;
    }
    .header-center {
      width: 44%;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
    .kapas-emblem-wrap {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-bottom: 1px;
    }
    .mandi-voucher-logo {
      width: 44px;
      height: 44px;
      object-fit: contain;
      display: block;
      margin: 0 auto;
    }
    .shop-title-ur {
      font-size: 20px;
      font-weight: 900;
      line-height: 1.5;
      margin-bottom: 1px;
      padding-bottom: 1px;
      display: block;
      color: #000;
    }
    .tagline-ur {
      font-size: 10px;
      font-weight: 700;
      color: #111;
      line-height: 1.35;
      display: block;
      white-space: nowrap;
    }
    .header-right {
      width: 28%;
      font-size: 9.5px;
      text-align: right;
      direction: rtl;
    }
    .contact-row {
      display: flex;
      justify-content: space-between;
      margin: 1px 0;
      line-height: 1.2;
    }
    .contact-row-sadar {
      font-weight: 900;
      color: #000;
    }
    .contact-name {
      font-size: 9px;
      color: #333;
      white-space: nowrap;
    }
    .contact-name-sadar {
      font-size: 9.5px;
      font-weight: 900;
      color: #000;
      white-space: nowrap;
    }
    .contact-phone {
      font-weight: 800;
      font-family: 'Segoe UI', Tahoma, monospace;
      color: #000;
      direction: ltr;
      white-space: nowrap;
    }
    .contact-phone-sadar {
      font-weight: 900;
      font-family: 'Segoe UI', Tahoma, monospace;
      color: #000;
      direction: ltr;
      white-space: nowrap;
    }

    /* Meta Row: Urdu First (Right: S.No, Center: Client Name, Left: Date & Time) */
    .meta-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #f0f0f0;
      border: 1.5px solid #000;
      border-radius: 4px;
      padding: 1.2mm 2.5mm;
      margin: 1.5mm 0;
      font-size: 11.5px;
      direction: rtl;
      box-sizing: border-box;
      overflow: hidden;
    }
    .meta-item-right {
      display: flex;
      gap: 4px;
      align-items: center;
      flex-shrink: 0;
      text-align: right;
      white-space: nowrap;
    }
    .meta-item-center {
      display: flex;
      align-items: center;
      justify-content: center;
      flex: 1 1 auto;
      min-width: 0;
      padding: 0 4px;
      text-align: center;
    }
    .meta-client-box {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      background: #fff;
      border: 1.5px solid #000;
      border-radius: 4px;
      padding: 0.6mm 3mm;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.06);
      max-width: 100%;
      box-sizing: border-box;
    }
    .meta-client-label {
      font-size: 11px;
      font-weight: 800;
      color: #222;
      white-space: nowrap;
      flex-shrink: 0;
    }
    .meta-client {
      font-size: 15.5px;
      font-weight: 900;
      color: #000;
      text-decoration: underline;
      text-decoration-thickness: 2px;
      text-underline-offset: 3px;
      letter-spacing: 0.3px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .meta-item-left {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;
      flex-shrink: 0;
      direction: ltr;
      text-align: left;
      font-size: 10px;
      line-height: 1.25;
      white-space: nowrap;
    }
    .meta-dt-row {
      display: flex;
      align-items: center;
      gap: 3px;
    }
    .meta-dt-label {
      font-weight: 800;
      color: #111;
      font-size: 10px;
    }
    .meta-dt-val {
      font-family: 'Segoe UI', Tahoma, monospace;
      font-weight: 700;
      font-size: 10.5px;
      color: #000;
      direction: ltr;
    }
    .meta-sno {
      font-size: 13px;
      font-weight: 900;
      font-family: monospace;
      color: #000;
    }

    /* Main Two-Column Content Grid: Urdu First (RTL: Weight Breakdown on Right, Finance on Left) */
    .content-grid {
      display: flex;
      gap: 2.5mm;
      margin: 1.2mm 0;
      direction: rtl;
    }
    .weight-column {
      flex: 1.15;
      border: 1.5px solid #000;
      border-radius: 4px;
      padding: 1.8mm 2.5mm;
      background: #fff;
      direction: rtl;
      text-align: right;
    }
    .finance-column {
      flex: 1;
      border: 1.5px solid #000;
      border-radius: 4px;
      padding: 1.8mm 2.5mm;
      background: #fafafa;
      direction: rtl;
      text-align: right;
    }
    .section-title {
      font-size: 11px;
      font-weight: 800;
      text-transform: uppercase;
      border-bottom: 1.5px solid #000;
      padding-bottom: 0.8mm;
      margin-bottom: 1mm;
      display: flex;
      justify-content: space-between;
      align-items: center;
      direction: rtl;
    }
    .data-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1px 0;
      font-size: 11.5px;
      direction: rtl;
    }
    .data-row-num {
      font-family: 'Segoe UI', Tahoma, monospace;
      font-weight: 600;
      direction: ltr;
    }
    .net-weight-box {
      background: #e8e8e8;
      border: 1.5px solid #000;
      border-radius: 4px;
      padding: 1.5mm 2.2mm;
      margin-top: 1.5mm;
      direction: rtl;
    }
    .net-weight-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 13px;
      font-weight: 900;
      border-bottom: 1px solid #777;
      padding-bottom: 0.8mm;
      direction: rtl;
    }
    .net-weight-manns {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 12.5px;
      font-weight: 800;
      margin-top: 1mm;
      direction: rtl;
    }
    .net-weight-hint {
      display: flex;
      justify-content: space-between;
      font-size: 9.5px;
      color: #444;
      margin-top: 0.8mm;
      direction: rtl;
    }

    /* Financial Column */
    .total-bill-box {
      border: 2px solid #000;
      border-radius: 4px;
      padding: 1.8mm 2mm;
      text-align: center;
      background: #fff;
      margin-top: 1.5mm;
      direction: ltr;
    }
    .total-bill-label {
      font-size: 10.5px;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .total-amount-number {
      font-size: 21px;
      font-weight: 900;
      color: #000;
      font-family: 'Segoe UI', Tahoma, monospace;
      margin: 0.8mm 0;
      letter-spacing: -0.5px;
    }
    .total-bill-breakdown {
      font-size: 9.5px;
      color: #333;
      font-family: monospace;
      font-weight: 600;
    }

    /* Signature & Manual Notes Section: Urdu First (RTL: Signature on Right, Payment Notice on Left) */
    .signature-container {
      border-top: 1.5px solid #000;
      padding-top: 1.5mm;
      margin-top: 1.5mm;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      direction: rtl;
      gap: 4mm;
    }
    .signature-line-box {
      flex: 1;
      text-align: right;
    }
    .signature-text {
      font-size: 10.5px;
      font-weight: 700;
      margin-bottom: 3.5mm; /* Generous yet compact vertical writing space */
    }
    .signature-underline {
      border-bottom: 1.5px dashed #444;
      width: 100%;
      height: 1px;
    }
    .footer-stamp {
      min-width: 44%;
      text-align: left;
      direction: ltr;
    }
    .footer-greeting {
      font-size: 12.5px;
      font-weight: 800;
      color: #000;
      line-height: 1.5;
      direction: rtl;
      text-align: left;
    }
    .footer-subtext {
      font-size: 9.5px;
      color: #444;
      font-weight: 600;
      margin-top: 1px;
      text-align: left;
    }
    .footer-shop-name {
      font-size: 8.5px;
      color: #444;
      margin-top: 1.5px;
      text-align: left;
    }
    .mann-display-badge {
      display: inline-flex;
      align-items: center;
      direction: ltr;
      gap: 3px;
      font-size: 13px;
    }
    .num-bold {
      font-family: monospace;
      font-weight: 800;
      font-size: 14.5px;
      color: #000;
    }
    .plus-sep {
      color: #555;
      font-weight: 900;
      margin: 0 1.5px;
    }
    .software-credits-bar {
      margin-top: 2.5px;
      padding-top: 1.5px;
      border-top: 1px solid #000;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 8.5px;
      color: #000;
      font-family: 'Segoe UI', Tahoma, sans-serif;
      page-break-inside: avoid;
      break-inside: avoid;
    }
    .credits-bold {
      font-weight: 900;
      color: #000;
    }
    .credits-phone {
      font-family: monospace;
      font-weight: 900;
      font-size: 10px;
      color: #000;
    }
  </style>
</head>
<body>
  <div class="voucher-card">
    <!-- Header Details -->
    <div class="header-container">
      <!-- Left: English Title & Location -->
      <div class="header-left">
        <div class="shop-title-en">Soneri Commission Shop</div>
        <div class="location-text">Ghalla Mandi, Malka Hans</div>
        <div class="location-text-ur urdu">غلہ منڈی ملکہ ہانس</div>
      </div>

      <!-- Center: Mandi Emblem Logo + Urdu Title & Tagline -->
      <div class="header-center">
        <div class="kapas-emblem-wrap">
          <img src="${MANDI_LOGO_BASE64}" alt="Logo" class="mandi-voucher-logo" />
        </div>
        <span class="shop-title-ur urdu">سنہری کمیشن شاپ</span>
        <span class="tagline-ur urdu">ہر قسم کی زرعی اجناس کی خرید و فروخت کا با اعتماد ادارہ</span>
      </div>

      <!-- Right: Contacts -->
      <div class="header-right">
        <div class="contact-row contact-row-sadar">
          <span class="contact-name-sadar bold"><strong>حاجی شبیر حسین (صدر):</strong></span>
          <span class="contact-phone-sadar"><strong>0300-9696234</strong></span>
        </div>
        <div class="contact-row">
          <span class="contact-name">حاجی فقیر حسین:</span>
          <span class="contact-phone">0302-6535403</span>
        </div>
        <div class="contact-row">
          <span class="contact-name">چوہدری سمیع:</span>
          <span class="contact-phone">0303-4884306</span>
        </div>
        <div class="contact-row">
          <span class="contact-name">چوہدری بلال:</span>
          <span class="contact-phone">0309-9692044</span>
        </div>
      </div>
    </div>

    <!-- Meta Information Bar: Person the bill belongs to in the CENTER -->
    <div class="meta-bar">
      <div class="meta-item-right">
        <span class="bold">بل نمبر (S.No):</span>
        <span class="meta-sno">#${serialNo}</span>
      </div>
      <div class="meta-item-center">
        <div class="meta-client-box">
          <span class="meta-client-label">گاہک / زمیندار (Client):</span>
          <span class="meta-client">${clientName}</span>
        </div>
      </div>
      <div class="meta-item-left">
        <div class="meta-dt-row">
          <span class="meta-dt-label bold">تاریخ:</span>
          <span class="meta-dt-val">${date}</span>
        </div>
        <div class="meta-dt-row">
          <span class="meta-dt-label bold">وقت:</span>
          <span class="meta-dt-val">${time}</span>
        </div>
      </div>
    </div>

    <!-- Main Content Columns: Urdu First (Right: Wazn/Saafi Details, Left: Financials) -->
    <div class="content-grid">
      <!-- Column 1: Weight Deductions & Net Weight (On the RIGHT) -->
      <div class="weight-column">
        <div class="section-title">
          <span>وزن کی تفصیل (Weight Breakdown)</span>
          <span class="urdu bold">کلوگرام</span>
        </div>
        <div class="data-row">
          <span>صافی وزن (Gross Weight):</span>
          <span class="bold data-row-num">${saafi} Kg</span>
        </div>
        <div class="data-row" style="color: #444;">
          <span>باردانہ کٹوتی (Bardana Deduction):</span>
          <span class="data-row-num">-${bardana} Kg</span>
        </div>
        <div class="data-row" style="color: #444;">
          <span>کنڈہ کٹوتی (Kanda Deduction):</span>
          <span class="data-row-num">-${kanda} Kg</span>
        </div>

        <!-- Net Weight Box -->
        <div class="net-weight-box">
          <div class="net-weight-header">
            <span>خالص وزن (Net Weight):</span>
            <span class="data-row-num">${netWeight} Kg</span>
          </div>
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
          <div class="net-weight-hint">
            <span>(1 Mann = 40.00 Kgs)</span>
            <span style="font-family: monospace; direction: ltr;">${totalManns} Manns + ${remainingKgs} Kgs</span>
          </div>
        </div>
      </div>

      <!-- Column 2: Financial Calculation & Total Amount (On the LEFT) -->
      <div class="finance-column">
        <div class="section-title">
          <span>حساب رقم (Financial Summary)</span>
          <span class="urdu bold">روپیہ</span>
        </div>
        <div class="data-row">
          <span>ریٹ فی من (Rate / Mann):</span>
          <span class="bold data-row-num">Rs. ${ratePerMann}</span>
        </div>
        <div class="data-row" style="color: #444;">
          <span>ریٹ فی کلو (Rate / 1 Kg):</span>
          <span class="data-row-num">Rs. ${ratePerKg}</span>
        </div>

        <!-- Total Bill Box -->
        <div class="total-bill-box">
          <div class="total-bill-label">کل رقم (TOTAL BILL AMOUNT)</div>
          <div class="total-amount-number">Rs. ${totalBill}</div>
          <div class="total-bill-breakdown">
            ${totalManns}M ${remainingKgs}Kg @ Rs.${ratePerMann}/Mann
          </div>
        </div>
      </div>
    </div>

    <!-- Signature & Manual Notes Area: Urdu First (Right: Signature, Left: Payment Notice) -->
    <div class="signature-container">
      <div class="signature-line-box">
        <div class="signature-text">
          <span>دستخط یا قلمی نوٹ (Signature / Notes):</span>
        </div>
        <div class="signature-underline"></div>
      </div>
      <div class="footer-stamp">
        <div class="urdu footer-greeting">پیمنٹ کی ادائیگی 3 سے 4 ہفتوں میں کی جاتی ہے۔</div>
        <div class="footer-subtext">(Payment will be made within 3-4 weeks)</div>
        <div class="footer-shop-name">Soneri Commission Shop • Ghalla Mandi, Malka Hans</div>
      </div>
    </div>

    <!-- POS Software Credit Bar -->
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
  </div>
</body>
</html>`
}

