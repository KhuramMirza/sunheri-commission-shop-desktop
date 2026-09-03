/**
 * Generates an optimized, self-contained HTML receipt template
 * specifically formatted for A5 Landscape (Half of standard A4, horizontal: 210mm x 148.5mm).
 * @param {object} bill - Bill record containing all transaction & calculated fields
 * @returns {string} Fully self-contained HTML document string
 */
export function generateReceiptHtml(bill) {
  const serialNo = bill.serialNo || 1
  const date = bill.date || new Date().toISOString().split('T')[0]
  const time = bill.createdAt
    ? new Date(bill.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  const clientName = bill.clientName || 'Cash Client (نقد گاہک)'
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
      margin: 5mm 8mm;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      width: 194mm;
      max-width: 194mm;
      height: 138mm;
      max-height: 138mm;
      margin: 0 auto;
      padding: 3mm 2mm;
      font-family: 'Segoe UI', Tahoma, -apple-system, BlinkMacSystemFont, 'Noto Nastaliq Urdu', 'Noto Sans Arabic', sans-serif;
      font-size: 11.5px;
      line-height: 1.3;
      color: #000;
      background: #fff;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .urdu { font-family: 'Noto Nastaliq Urdu', 'Noto Sans Arabic', 'Urdu Typesetting', Tahoma, sans-serif; }
    .text-center { text-align: center; }
    .text-right { text-align: right; }
    .text-left { text-align: left; }
    .bold { font-weight: bold; }
    
    /* Header Styles */
    .header-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 3mm;
      border-bottom: 2px solid #000;
    }
    .header-left {
      width: 32%;
      text-align: left;
    }
    .shop-title-en {
      font-size: 14px;
      font-weight: 900;
      letter-spacing: 0.5px;
      text-transform: uppercase;
    }
    .location-text {
      font-size: 10px;
      font-weight: 600;
      color: #222;
      margin-top: 1px;
    }
    .header-center {
      width: 36%;
      text-align: center;
    }
    .shop-title-ur {
      font-size: 20px;
      font-weight: bold;
      line-height: 1.4;
    }
    .tagline-ur {
      font-size: 9.5px;
      font-weight: 600;
      color: #333;
    }
    .header-right {
      width: 30%;
      font-size: 9px;
      text-align: right;
    }
    .contact-row {
      display: flex;
      justify-content: space-between;
      margin: 1px 0;
    }
    
    /* Meta Row */
    .meta-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #f4f4f4;
      border: 1.5px solid #000;
      border-radius: 4px;
      padding: 2mm 3.5mm;
      margin: 2mm 0;
      font-size: 12px;
    }
    .meta-item {
      display: flex;
      gap: 4px;
    }
    
    /* Main Two-Column Content Grid */
    .content-grid {
      display: flex;
      gap: 5mm;
      margin: 1.5mm 0;
      flex: 1;
    }
    .weight-column {
      flex: 1.2;
      border: 1.5px solid #000;
      border-radius: 4px;
      padding: 2.5mm 3.5mm;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .finance-column {
      flex: 1;
      border: 1.5px solid #000;
      border-radius: 4px;
      padding: 2.5mm 3.5mm;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      background: #fafafa;
    }
    .table-title {
      font-size: 11px;
      font-weight: bold;
      text-transform: uppercase;
      border-bottom: 1px solid #000;
      padding-bottom: 1mm;
      margin-bottom: 1.5mm;
      display: flex;
      justify-content: space-between;
    }
    .data-row {
      display: flex;
      justify-content: space-between;
      padding: 1px 0;
    }
    .net-weight-box {
      background: #eaeaea;
      border: 1px solid #000;
      border-radius: 3px;
      padding: 2mm;
      margin-top: 1.5mm;
    }
    .total-bill-box {
      border: 2px solid #000;
      border-radius: 4px;
      padding: 2.5mm;
      text-align: center;
      background: #fff;
      margin-top: 2mm;
    }
    .total-amount-number {
      font-size: 18px;
      font-weight: 900;
      color: #000;
      margin-top: 1px;
    }

    /* Signature & Manual Notes Section */
    .signature-container {
      border-top: 1.5px solid #000;
      padding-top: 2mm;
      margin-top: 1.5mm;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
    }
    .signature-line-box {
      width: 65%;
    }
    .signature-text {
      font-size: 10px;
      font-weight: bold;
      margin-bottom: 5mm; /* Generous vertical writing space for pencil */
    }
    .signature-underline {
      border-bottom: 1.5px dashed #444;
      width: 100%;
      height: 1px;
    }
    .footer-stamp {
      width: 32%;
      text-align: right;
      font-size: 9.5px;
    }
  </style>
</head>
<body>
  <!-- Header Details -->
  <div class="header-container">
    <!-- Left: English Title & Location -->
    <div class="header-left">
      <div class="shop-title-en">Sunheri Commission Shop</div>
      <div class="location-text">Ghalla Mandi, Malka Hans</div>
      <div style="font-size: 9px; color: #444; margin-top: 1px;">غلہ منڈی ملکہ ہانس</div>
    </div>

    <!-- Center: Urdu Title & Tagline -->
    <div class="header-center">
      <div class="shop-title-ur urdu">سنہری کمیشن شاپ</div>
      <div class="tagline-ur urdu">ہر قسم کی زرعی اجناس کی خرید و فروخت کا با اعتماد ادارہ</div>
    </div>

    <!-- Right: Contacts -->
    <div class="header-right">
      <div class="contact-row">
        <span>حاجی شبیر حسین (صدر):</span>
        <span class="bold">0300-9696234</span>
      </div>
      <div class="contact-row">
        <span>حاجی فقیر حسین:</span>
        <span class="bold">0302-6535403</span>
      </div>
      <div class="contact-row">
        <span>چوہدری سمیع:</span>
        <span class="bold">0303-4884306</span>
      </div>
      <div class="contact-row">
        <span>چوہدری بلال:</span>
        <span class="bold">0309-9692044</span>
      </div>
    </div>
  </div>

  <!-- Meta Information Bar -->
  <div class="meta-bar">
    <div class="meta-item">
      <span class="bold">بل نمبر (Bill S.No):</span>
      <span class="bold">#${serialNo}</span>
    </div>
    <div class="meta-item">
      <span class="bold">تاریخ و وقت (Date & Time):</span>
      <span>${date} ${time}</span>
    </div>
    <div class="meta-item">
      <span class="bold">گاہک / زمیندار (Client):</span>
      <span class="bold" style="font-size: 13px;">${clientName}</span>
    </div>
  </div>

  <!-- Main Horizontal Content Columns -->
  <div class="content-grid">
    <!-- Column 1: Weight Deductions & Net Weight -->
    <div class="weight-column">
      <div>
        <div class="table-title">
          <span>وزن کی تفصیل (Weight Breakdown)</span>
          <span class="urdu">کلوگرام</span>
        </div>
        <div class="data-row">
          <span>صافی وزن (Gross Weight):</span>
          <span class="bold">${saafi} Kg</span>
        </div>
        <div class="data-row" style="color: #444;">
          <span>باردانہ کٹوتی (Bardana Deduction):</span>
          <span>-${bardana} Kg</span>
        </div>
        <div class="data-row" style="color: #444;">
          <span>کنڈہ کٹوتی (Kanda Machine Deduction):</span>
          <span>-${kanda} Kg</span>
        </div>
      </div>

      <!-- Net Weight and Manns Conversion Box -->
      <div class="net-weight-box">
        <div class="data-row bold" style="font-size: 13px;">
          <span>خالص وزن (Net Weight):</span>
          <span>${netWeight} Kg</span>
        </div>
        <div class="data-row bold" style="font-size: 12px; margin-top: 2px;">
          <span class="urdu">وزن بحساب من:</span>
          <span>${totalManns} من  ${remainingKgs} کلو</span>
        </div>
        <div class="data-row" style="font-size: 9.5px; color: #555; margin-top: 1px;">
          <span>(1 Mann = 40.00 Kgs)</span>
          <span>${totalManns} Manns + ${remainingKgs} Kgs</span>
        </div>
      </div>
    </div>

    <!-- Column 2: Financial Calculation & Total Amount -->
    <div class="finance-column">
      <div>
        <div class="table-title">
          <span>حساب رقم (Financial Summary)</span>
          <span class="urdu">روپیہ</span>
        </div>
        <div class="data-row">
          <span>ریٹ فی من (Rate / Mann):</span>
          <span class="bold">Rs. ${ratePerMann}</span>
        </div>
        <div class="data-row" style="color: #444;">
          <span>ریٹ فی کلو (Rate / 1 Kg):</span>
          <span>Rs. ${ratePerKg}</span>
        </div>
      </div>

      <!-- Highlighted Total Bill Box -->
      <div class="total-bill-box">
        <div class="bold" style="font-size: 11px;">کل رقم (TOTAL BILL AMOUNT)</div>
        <div class="total-amount-number">Rs. ${totalBill}</div>
        <div style="font-size: 9.5px; color: #444; margin-top: 1px;">
          ${totalManns}M ${remainingKgs}Kg @ Rs.${ratePerMann}/Mann
        </div>
      </div>
    </div>
  </div>

  <!-- Signature & Manual Notes Area with Generous Pencil Writing Space -->
  <div class="signature-container">
    <div class="signature-line-box">
      <div class="signature-text">
        <span>دستخط یا قلمی نوٹ (Signature / Notes):</span>
      </div>
      <div class="signature-underline"></div>
    </div>
    <div class="footer-stamp">
      <div class="urdu bold" style="font-size: 11px;">شکریہ! دوبارہ تشریف لائیں۔</div>
      <div style="font-size: 8.5px; color: #555; margin-top: 1px;">Sunheri Commission Shop • Ghalla Mandi, Malka Hans</div>
    </div>
  </div>
</body>
</html>`
}
