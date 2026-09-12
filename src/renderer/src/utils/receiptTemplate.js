import { MANDI_LOGO_BASE64 } from '../assets/mandiLogoBase64.js'

/**
 * Generates an optimized, pure-Urdu self-contained HTML receipt template
 * formatted strictly for 6.8 - 7.0 inch width (fits cleanly on A4 Portrait & thermal paper).
 * Completely removes English text, features top-center shop title & location,
 * top-left date/time/serial, enlarged top-right contacts, client name bar,
 * and automatic Rs. 200 Masjid Fund deduction as requested.
 *
 * @param {object} bill - Bill record containing transaction & calculation fields
 * @returns {string} Fully self-contained HTML document string
 */
export function generateReceiptHtml(bill) {
  const serialNo = bill.serialNo || 1
  const date = bill.date || new Date().toISOString().split('T')[0]
  const time = bill.createdAt
    ? new Date(bill.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  const clientName = bill.clientName && bill.clientName.trim() ? bill.clientName.trim() : 'نقد گاہک'
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

  // Gross Bill calculation
  const grossBillNum =
    bill.grossBill !== undefined
      ? Number(bill.grossBill)
      : Number(bill.totalBill || 0) + (bill.masjidFund !== undefined ? Number(bill.masjidFund) : 200)

  const grossBill = grossBillNum.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })

  // Masjid Fund deduction (-200 Rs)
  const masjidFundNum =
    bill.masjidFund !== undefined
      ? Number(bill.masjidFund)
      : grossBillNum > 0
        ? 200
        : 0

  const masjidFund = masjidFundNum.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  })

  // Net Total Bill
  const totalBillNum =
    bill.totalBill !== undefined
      ? Number(bill.totalBill)
      : Math.max(0, grossBillNum - masjidFundNum)

  const totalBill = totalBillNum.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })

  return `<!DOCTYPE html>
<html lang="ur" dir="rtl">
<head>
  <meta charset="UTF-8">
  <title>بل #${serialNo} - سنہری کمیشن شاپ</title>
  <style>
    @page {
      size: portrait;
      margin: 4mm 0;
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
      font-family: 'Noto Nastaliq Urdu', 'Urdu Typesetting', 'Segoe UI', Tahoma, Arial, sans-serif;
      font-size: 12px;
      line-height: 1.35;
      color: #000;
      background: #fff;
      direction: rtl;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
      page-break-inside: avoid;
      break-inside: avoid;
      page-break-after: avoid;
    }
    .urdu {
      font-family: 'Noto Nastaliq Urdu', 'Urdu Typesetting', Tahoma, sans-serif;
    }
    .mono {
      font-family: 'Segoe UI', Tahoma, monospace;
    }
    .text-center { text-align: center; }
    .text-right { text-align: right; }
    .text-left { text-align: left; }
    .bold { font-weight: bold; }

    /* Outer Voucher Card - 6.8 to 7.0 Inches Wide for clean A4 Portrait positioning */
    .voucher-card {
      width: 6.9in;
      max-width: 6.9in;
      min-width: 6.9in;
      box-sizing: border-box;
      border: 2px solid #000;
      border-radius: 6px;
      padding: 3mm 4mm;
      background: #fff;
      margin: 0 auto;
      page-break-inside: avoid;
      break-inside: avoid;
      page-break-after: avoid;
      direction: rtl;
    }

    /* Header Container: 3 Columns (Right: Contacts, Center: Shop Name, Left: Date/Time) */
    .header-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 2.5mm;
      border-bottom: 2px solid #000;
      gap: 2.5mm;
      direction: rtl;
    }

    /* Top Right: Enlarged Contacts */
    .header-right {
      width: 37%;
      min-width: 37%;
      text-align: right;
      font-size: 11px;
      flex-shrink: 0;
    }
    .contact-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 1.5px 0;
      line-height: 1.25;
      white-space: nowrap;
      flex-wrap: nowrap;
    }
    .contact-row-sadar {
      font-weight: 900;
      background: #f0f4f8;
      padding: 1.5px 4px;
      border-radius: 4px;
      border: 1px solid #777;
      margin-bottom: 2.5px;
      white-space: nowrap;
      flex-wrap: nowrap;
    }
    .contact-name-sadar {
      font-size: 11.5px;
      font-weight: 900;
      color: #000;
      white-space: nowrap;
      flex-shrink: 0;
    }
    .contact-phone-sadar {
      font-size: 11.5px;
      font-weight: 900;
      font-family: 'Segoe UI', Tahoma, monospace;
      direction: ltr;
      unicode-bidi: isolate;
      color: #000;
      white-space: nowrap;
      flex-shrink: 0;
    }
    .contact-name {
      font-size: 11px;
      font-weight: 700;
      color: #111;
      white-space: nowrap;
      flex-shrink: 0;
    }
    .contact-phone {
      font-size: 11px;
      font-weight: 800;
      font-family: 'Segoe UI', Tahoma, monospace;
      direction: ltr;
      unicode-bidi: isolate;
      color: #000;
      white-space: nowrap;
      flex-shrink: 0;
    }

    /* Top Center: Shop Name & Location in prominent Urdu */
    .header-center {
      width: 40%;
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
      width: 40px;
      height: 40px;
      object-fit: contain;
      display: block;
      margin: 0 auto;
    }
    .shop-title-ur {
      font-size: 24px;
      font-weight: 900;
      line-height: 1.6;
      margin-bottom: 0px;
      padding-bottom: 0px;
      color: #000;
      white-space: nowrap;
    }
    .shop-location-ur {
      font-size: 14.5px;
      font-weight: 800;
      color: #000;
      line-height: 1.4;
      margin-top: 1px;
      white-space: nowrap;
    }
    .tagline-ur {
      font-size: 10px;
      font-weight: 700;
      color: #222;
      line-height: 1.35;
      margin-top: 1px;
      white-space: nowrap;
    }

    /* Top Left: Date, Time, Serial Number */
    .header-left {
      width: 23%;
      min-width: 23%;
      text-align: left;
      direction: ltr;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;
      gap: 2px;
      border: 1.5px solid #000;
      border-radius: 4px;
      padding: 1.5mm 2mm;
      background: #fbfbfb;
      flex-shrink: 0;
    }
    .dt-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      font-size: 11px;
      line-height: 1.25;
    }
    .dt-label {
      font-weight: 800;
      font-size: 11.5px;
      color: #111;
      font-family: 'Noto Nastaliq Urdu', Tahoma, sans-serif;
    }
    .dt-val {
      font-family: 'Segoe UI', Tahoma, monospace;
      font-weight: 800;
      font-size: 11.5px;
      color: #000;
    }
    .sno-badge {
      font-size: 13px;
      font-weight: 900;
      font-family: 'Segoe UI', Tahoma, monospace;
      color: #000;
    }

    /* Customer Name Bar: Directly below the header, prominent and clean */
    .client-name-bar {
      display: flex;
      align-items: center;
      background: #f2f2f2;
      border: 1.5px solid #000;
      border-radius: 4px;
      padding: 1.2mm 3mm;
      margin: 2mm 0;
      direction: rtl;
      gap: 6px;
    }
    .client-label {
      font-size: 13px;
      font-weight: 900;
      color: #000;
      flex-shrink: 0;
    }
    .client-name {
      font-size: 17px;
      font-weight: 900;
      color: #000;
      text-decoration: underline;
      text-decoration-thickness: 2px;
      text-underline-offset: 4px;
      letter-spacing: 0.3px;
      flex: 1;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    /* Main Content Grid: Two Columns (Right: Weights, Left: Financials & Masjid Fund) */
    .content-grid {
      display: flex;
      gap: 3mm;
      margin: 1.5mm 0;
      direction: rtl;
    }

    /* Column 1 (Right): Weight Breakdown */
    .weight-column {
      flex: 1.15;
      border: 1.5px solid #000;
      border-radius: 4px;
      padding: 2mm 2.8mm;
      background: #fff;
      direction: rtl;
      text-align: right;
    }
    .section-title {
      font-size: 12px;
      font-weight: 900;
      border-bottom: 1.5px solid #000;
      padding-bottom: 1mm;
      margin-bottom: 1.5mm;
      display: flex;
      justify-content: space-between;
      align-items: center;
      direction: rtl;
    }
    .data-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.5px 0;
      font-size: 12px;
      direction: rtl;
    }
    .data-row-num {
      font-family: 'Segoe UI', Tahoma, monospace;
      font-weight: 700;
      direction: ltr;
      font-size: 12.5px;
    }

    /* Net Weight Box */
    .net-weight-box {
      background: #e8e8e8;
      border: 1.5px solid #000;
      border-radius: 4px;
      padding: 1.8mm 2.5mm;
      margin-top: 2mm;
      direction: rtl;
    }
    .net-weight-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 13.5px;
      font-weight: 900;
      border-bottom: 1px solid #666;
      padding-bottom: 1mm;
      direction: rtl;
    }
    .net-weight-manns {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 13px;
      font-weight: 900;
      margin-top: 1.2mm;
      direction: rtl;
    }
    .mann-display-badge {
      display: inline-flex;
      align-items: center;
      direction: rtl;
      gap: 3px;
      font-size: 13px;
    }
    .num-bold {
      font-family: 'Segoe UI', Tahoma, monospace;
      font-weight: 900;
      font-size: 15px;
      color: #000;
      margin: 0 2px;
    }
    .plus-sep {
      color: #333;
      font-weight: 900;
      margin: 0 2px;
    }
    .net-weight-hint {
      display: flex;
      justify-content: space-between;
      font-size: 10px;
      color: #333;
      margin-top: 1mm;
      direction: rtl;
      font-weight: 700;
    }

    /* Column 2 (Left): Financials & Masjid Fund */
    .finance-column {
      flex: 1.05;
      border: 1.5px solid #000;
      border-radius: 4px;
      padding: 2mm 2.8mm;
      background: #fafafa;
      direction: rtl;
      text-align: right;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    /* Total Bill Box with Masjid Fund itemized */
    .total-bill-box {
      border: 2px solid #000;
      border-radius: 4px;
      padding: 2mm 2.2mm;
      text-align: center;
      background: #fff;
      margin-top: 1.5mm;
      direction: rtl;
    }
    .total-bill-label {
      font-size: 12px;
      font-weight: 900;
      color: #000;
    }
    .total-amount-number {
      font-size: 22px;
      font-weight: 900;
      color: #000;
      font-family: 'Segoe UI', Tahoma, monospace;
      margin: 1mm 0;
      direction: ltr;
      letter-spacing: -0.5px;
    }
    .total-bill-breakdown {
      font-size: 10px;
      color: #222;
      font-family: 'Segoe UI', Tahoma, monospace;
      font-weight: 700;
      direction: ltr;
    }

    /* Signature & Policy Terms */
    .signature-container {
      border-top: 1.5px solid #000;
      padding-top: 2mm;
      margin-top: 2mm;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      direction: rtl;
      gap: 5mm;
    }
    .signature-line-box {
      flex: 1;
      text-align: right;
    }
    .signature-text {
      font-size: 11px;
      font-weight: 800;
      margin-bottom: 4mm;
    }
    .signature-underline {
      border-bottom: 1.5px dashed #444;
      width: 100%;
      height: 1px;
    }
    .footer-stamp {
      min-width: 44%;
      text-align: left;
      direction: rtl;
    }
    .footer-greeting {
      font-size: 13px;
      font-weight: 900;
      color: #000;
      line-height: 1.6;
      text-align: left;
    }
    .footer-shop-name {
      font-size: 9.5px;
      color: #333;
      margin-top: 2px;
      text-align: left;
      font-weight: 700;
    }

    /* Bottom Credit Bar in Urdu */
    .software-credits-bar {
      margin-top: 2.5px;
      padding-top: 1.5px;
      border-top: 1px solid #000;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 9.5px;
      color: #000;
      direction: rtl;
      page-break-inside: avoid;
      break-inside: avoid;
    }
    .credits-phone {
      font-family: 'Segoe UI', Tahoma, monospace;
      font-weight: 900;
      font-size: 10.5px;
      direction: ltr;
      display: inline-block;
    }
  </style>
</head>
<body>
  <div class="voucher-card">
    <!-- Header Details: 3-column distribution -->
    <div class="header-container">
      <!-- Top Right: Contacts with enlarged text -->
      <div class="header-right">
        <div class="contact-row contact-row-sadar">
          <span class="contact-name-sadar">حاجی شبیر حسین (صدر):</span>
          <span class="contact-phone-sadar">0300-9696234</span>
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

      <!-- Top Center: Shop Name & Location -->
      <div class="header-center">
        <div class="kapas-emblem-wrap">
          <img src="${MANDI_LOGO_BASE64}" alt="Logo" class="mandi-voucher-logo" />
        </div>
        <div class="shop-title-ur urdu">سنہری کمیشن شاپ</div>
        <div class="shop-location-ur urdu">غلہ منڈی ملکہ ہانس</div>
        <div class="tagline-ur urdu">ہر قسم کی زرعی اجناس کی خرید و فروخت کا با اعتماد ادارہ</div>
      </div>

      <!-- Top Left: Date, Time & Bill Number -->
      <div class="header-left">
        <div class="dt-row">
          <span class="dt-label">تاریخ:</span>
          <span class="dt-val">${date}</span>
        </div>
        <div class="dt-row">
          <span class="dt-label">وقت:</span>
          <span class="dt-val">${time}</span>
        </div>
        <div class="dt-row">
          <span class="dt-label">بل نمبر:</span>
          <span class="dt-val sno-badge">#${serialNo}</span>
        </div>
      </div>
    </div>

    <!-- Customer Name Row: Prominent Urdu display -->
    <div class="client-name-bar">
      <span class="client-label">نام:</span>
      <span class="client-name">${clientName}</span>
    </div>

    <!-- Main Content Columns (Right: Weights, Left: Financials & Masjid Fund) -->
    <div class="content-grid">
      <!-- Column 1 (Right): Weight Breakdown -->
      <div class="weight-column">
        <div class="section-title">
          <span>وزن کی تفصیل</span>
          <span>(کلوگرام)</span>
        </div>

        <div class="data-row">
          <span>صافی وزن:</span>
          <span class="data-row-num bold">${saafi} کلو</span>
        </div>
        <div class="data-row" style="color: #333;">
          <span>باردانہ کٹوتی:</span>
          <span class="data-row-num">-${bardana} کلو</span>
        </div>
        <div class="data-row" style="color: #333;">
          <span>کنڈہ کٹوتی:</span>
          <span class="data-row-num">-${kanda} کلو</span>
        </div>

        <!-- Net Weight Box -->
        <div class="net-weight-box">
          <div class="net-weight-header">
            <span>خالص وزن:</span>
            <span class="data-row-num bold" style="font-size: 14px;">${netWeight} کلو</span>
          </div>

          <div class="net-weight-manns">
            <span>وزن بحساب من:</span>
            <span class="mann-display-badge">
              <span class="num-bold">${totalManns}</span>
              <span class="bold">من</span>
              <span class="plus-sep">+</span>
              <span class="num-bold">${remainingKgs}</span>
              <span class="bold">کلو</span>
            </span>
          </div>

          <div class="net-weight-hint">
            <span>(1 من = 40.00 کلوگرام)</span>
            <span>صافی - (باردانہ + کنڈہ)</span>
          </div>
        </div>
      </div>

      <!-- Column 2 (Left): Financials & Masjid Fund -->
      <div class="finance-column">
        <div>
          <div class="section-title">
            <span>حساب رقم</span>
            <span>(روپیہ)</span>
          </div>

          <div class="data-row">
            <span>ریٹ فی من:</span>
            <span class="data-row-num bold">روپیہ ${ratePerMann}</span>
          </div>
          <div class="data-row" style="color: #333;">
            <span>ریٹ فی کلو:</span>
            <span class="data-row-num">روپیہ ${ratePerKg}</span>
          </div>
          <div class="data-row" style="margin-top: 1.5px;">
            <span>کل رقم (گروس):</span>
            <span class="data-row-num bold">روپیہ ${grossBill}</span>
          </div>
          <div class="data-row" style="color: #b91c1c; font-weight: 800;">
            <span>مسجد فنڈ کٹوتی:</span>
            <span class="data-row-num bold" style="color: #b91c1c;">-${masjidFund} روپیہ</span>
          </div>
        </div>

        <!-- Highlighted Total Amount Box -->
        <div class="total-bill-box">
          <div class="total-bill-label">صافی رقم (کل بل)</div>
          <div class="total-amount-number">روپیہ ${totalBill}</div>
          <div class="total-bill-breakdown">
            ${totalManns} من + ${remainingKgs} کلو @ روپیہ ${ratePerMann} (-${masjidFund})
          </div>
        </div>
      </div>
    </div>

    <!-- Signature & Payment Terms -->
    <div class="signature-container">
      <div class="signature-line-box">
        <div class="signature-text">دستخط یا قلمی نوٹ:</div>
        <div class="signature-underline"></div>
      </div>
      <div class="footer-stamp">
        <div class="footer-greeting">پیمنٹ کی ادائیگی 3 سے 4 ہفتوں میں کی جاتی ہے۔</div>
        <div class="footer-shop-name">سنہری کمیشن شاپ — غلہ منڈی ملکہ ہانس</div>
      </div>
    </div>

    <!-- Bottom Credit Bar in pure Urdu -->
    <div class="software-credits-bar">
      <div>
        <span>کمپیوٹر سافٹ ویئر: </span>
        <strong style="font-weight: 900;">ایزی سلوشنز</strong>
      </div>
      <div>
        <span>رابطہ برائے سافٹ ویئر: </span>
        <span class="credits-phone">0315-6566533</span>
      </div>
    </div>
  </div>
</body>
</html>`
}
