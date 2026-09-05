import { KAPAS_LOGO_SVG } from './kapasLogoSvg.js'

/**
 * Generates an optimized, self-contained HTML receipt template
 * specifically formatted for A5 Landscape (Half of standard A4, horizontal: 210mm x 148.5mm).
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
  <title>Receipt #${serialNo} - Sunheri Commission Shop</title>
  <style>
    @page {
      size: A5 landscape;
      margin: 6mm 8mm;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      width: 100%;
      max-width: 194mm;
      margin: 0 auto;
      padding: 0;
      font-family: 'Segoe UI', Tahoma, -apple-system, BlinkMacSystemFont, 'Noto Nastaliq Urdu', 'Noto Sans Arabic', sans-serif;
      font-size: 12.5px;
      line-height: 1.35;
      color: #000;
      background: #fff;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .urdu {
      font-family: 'Noto Nastaliq Urdu', 'Noto Sans Arabic', 'Urdu Typesetting', Tahoma, sans-serif;
    }
    .text-center { text-align: center; }
    .text-right { text-align: right; }
    .text-left { text-align: left; }
    .bold { font-weight: bold; }

    /* Outer Voucher Card */
    .voucher-card {
      border: 2px solid #000;
      border-radius: 6px;
      padding: 3mm 4mm;
      background: #fff;
    }

    /* Header Styles */
    .header-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 2.5mm;
      border-bottom: 2px solid #000;
      gap: 3mm;
    }
    .header-left {
      width: 32%;
      text-align: left;
    }
    .shop-title-en {
      font-size: 15px;
      font-weight: 900;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      line-height: 1.2;
    }
    .location-text {
      font-size: 11px;
      font-weight: 700;
      color: #222;
      margin-top: 2px;
    }
    .location-text-ur {
      font-size: 11px;
      color: #333;
      margin-top: 1px;
    }
    .header-center {
      width: 38%;
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
      margin-bottom: 2px;
    }
    .shop-title-ur {
      font-size: 22px;
      font-weight: 900;
      line-height: 1.9;
      margin-bottom: 4px;
      padding-bottom: 1px;
      display: block;
      color: #000;
    }
    .tagline-ur {
      font-size: 11px;
      font-weight: 700;
      color: #111;
      line-height: 1.6;
      display: block;
    }
    .header-right {
      width: 30%;
      font-size: 10px;
      text-align: right;
    }
    .contact-row {
      display: flex;
      justify-content: space-between;
      margin: 1.5px 0;
      line-height: 1.2;
    }
    .contact-name {
      font-size: 9.5px;
      color: #333;
    }
    .contact-phone {
      font-weight: 800;
      font-family: 'Segoe UI', Tahoma, monospace;
      color: #000;
    }

    /* Meta Row */
    .meta-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #f0f0f0;
      border: 1.5px solid #000;
      border-radius: 4px;
      padding: 1.8mm 3mm;
      margin: 2mm 0;
      font-size: 12.5px;
    }
    .meta-item {
      display: flex;
      gap: 5px;
      align-items: baseline;
    }
    .meta-sno {
      font-size: 14px;
      font-weight: 900;
      font-family: monospace;
      color: #000;
    }
    .meta-client {
      font-size: 13.5px;
      font-weight: 800;
      color: #000;
    }

    /* Main Two-Column Content Grid */
    .content-grid {
      display: flex;
      gap: 3mm;
      margin: 1.5mm 0;
    }
    .weight-column {
      flex: 1.15;
      border: 1.5px solid #000;
      border-radius: 4px;
      padding: 2.5mm 3mm;
      background: #fff;
    }
    .finance-column {
      flex: 1;
      border: 1.5px solid #000;
      border-radius: 4px;
      padding: 2.5mm 3mm;
      background: #fafafa;
    }
    .section-title {
      font-size: 11.5px;
      font-weight: 800;
      text-transform: uppercase;
      border-bottom: 1.5px solid #000;
      padding-bottom: 1mm;
      margin-bottom: 1.5mm;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .data-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.5px 0;
      font-size: 12.5px;
    }
    .data-row-num {
      font-family: 'Segoe UI', Tahoma, monospace;
      font-weight: 600;
    }
    .net-weight-box {
      background: #e8e8e8;
      border: 1.5px solid #000;
      border-radius: 4px;
      padding: 2mm 2.5mm;
      margin-top: 2.5mm;
    }
    .net-weight-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 14px;
      font-weight: 900;
      border-bottom: 1px solid #777;
      padding-bottom: 1mm;
    }
    .net-weight-manns {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 13.5px;
      font-weight: 800;
      margin-top: 1.5mm;
    }
    .net-weight-hint {
      display: flex;
      justify-content: space-between;
      font-size: 10px;
      color: #444;
      margin-top: 1mm;
    }

    /* Financial Column */
    .total-bill-box {
      border: 2px solid #000;
      border-radius: 5px;
      padding: 2.5mm 2mm;
      text-align: center;
      background: #fff;
      margin-top: 2.5mm;
    }
    .total-bill-label {
      font-size: 11px;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .total-amount-number {
      font-size: 22px;
      font-weight: 900;
      color: #000;
      font-family: 'Segoe UI', Tahoma, monospace;
      margin: 1mm 0;
      letter-spacing: -0.5px;
    }
    .total-bill-breakdown {
      font-size: 10px;
      color: #333;
      font-family: monospace;
      font-weight: 600;
    }

    /* Signature & Manual Notes Section */
    .signature-container {
      border-top: 1.5px solid #000;
      padding-top: 2mm;
      margin-top: 2mm;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
    }
    .signature-line-box {
      width: 62%;
    }
    .signature-text {
      font-size: 11px;
      font-weight: 700;
      margin-bottom: 6mm; /* Generous vertical writing space for pencil/pen */
    }
    .signature-underline {
      border-bottom: 1.5px dashed #444;
      width: 100%;
      height: 1px;
    }
    .footer-stamp {
      width: 35%;
      text-align: right;
    }
    .footer-greeting {
      font-size: 12px;
      font-weight: 800;
    }
    .footer-shop-name {
      font-size: 9px;
      color: #444;
      margin-top: 1px;
    }
  </style>
</head>
<body>
  <div class="voucher-card">
    <!-- Header Details -->
    <div class="header-container">
      <!-- Left: English Title & Location -->
      <div class="header-left">
        <div class="shop-title-en">Sunheri Commission Shop</div>
        <div class="location-text">Ghalla Mandi, Malka Hans</div>
        <div class="location-text-ur urdu">غلہ منڈی ملکہ ہانس</div>
      </div>

      <!-- Center: Kapas Logo Emblem + Urdu Title & Tagline -->
      <div class="header-center">
        <div class="kapas-emblem-wrap">
          ${KAPAS_LOGO_SVG}
        </div>
        <span class="shop-title-ur urdu">سنہری کمیشن شاپ</span>
        <span class="tagline-ur urdu">ہر قسم کی زرعی اجناس کی خرید و فروخت کا با اعتماد ادارہ</span>
      </div>

      <!-- Right: Contacts -->
      <div class="header-right">
        <div class="contact-row">
          <span class="contact-name">حاجی شبیر حسین (صدر):</span>
          <span class="contact-phone">0300-9696234</span>
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

    <!-- Meta Information Bar -->
    <div class="meta-bar">
      <div class="meta-item">
        <span class="bold">بل نمبر (S.No):</span>
        <span class="meta-sno">#${serialNo}</span>
      </div>
      <div class="meta-item">
        <span class="bold">تاریخ و وقت (Date & Time):</span>
        <span>${date} ${time}</span>
      </div>
      <div class="meta-item">
        <span class="bold">گاہک / زمیندار (Client):</span>
        <span class="meta-client">${clientName}</span>
      </div>
    </div>

    <!-- Main Content Columns -->
    <div class="content-grid">
      <!-- Column 1: Weight Deductions & Net Weight -->
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
            <span>${totalManns} من  ${remainingKgs} کلو</span>
          </div>
          <div class="net-weight-hint">
            <span>(1 Mann = 40.00 Kgs)</span>
            <span style="font-family: monospace;">${totalManns} Manns + ${remainingKgs} Kgs</span>
          </div>
        </div>
      </div>

      <!-- Column 2: Financial Calculation & Total Amount -->
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

    <!-- Signature & Manual Notes Area -->
    <div class="signature-container">
      <div class="signature-line-box">
        <div class="signature-text">
          <span>دستخط یا قلمی نوٹ (Signature / Notes):</span>
        </div>
        <div class="signature-underline"></div>
      </div>
      <div class="footer-stamp">
        <div class="urdu footer-greeting">شکریہ! دوبارہ تشریف لائیں۔</div>
        <div class="footer-shop-name">Sunheri Commission Shop • Ghalla Mandi, Malka Hans</div>
      </div>
    </div>
  </div>
</body>
</html>`
}

