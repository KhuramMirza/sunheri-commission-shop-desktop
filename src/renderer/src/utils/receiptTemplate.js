/**
 * Generates an optimized, self-contained HTML thermal receipt string
 * formatted specifically for 58mm / 80mm ESC/POS thermal printers.
 * @param {object} bill - Bill record containing all transaction & calculated fields
 * @returns {string} Fully self-contained HTML document string
 */
export function generateReceiptHtml(bill) {
  const serialNo = bill.serialNo || 1
  const date = bill.date || new Date().toISOString().split('T')[0]
  const time = bill.createdAt ? new Date(bill.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  const clientName = bill.clientName || 'Cash Client (نقد گاہک)'
  const saafi = Number(bill.saafiWeight || 0).toFixed(2)
  const bardana = Number(bill.bardanaWeight || 0).toFixed(2)
  const kanda = Number(bill.kandaWeight || 0).toFixed(2)
  const netWeight = Number(bill.netWeight || 0).toFixed(2)
  const totalManns = bill.totalManns || 0
  const remainingKgs = Number(bill.remainingKgs || 0).toFixed(2)
  const ratePerMann = Number(bill.ratePerMann || 0).toFixed(2)
  const ratePerKg = Number(bill.ratePerKg || (bill.ratePerMann ? bill.ratePerMann / 40 : 0)).toFixed(2)
  const totalBill = Number(bill.totalBill || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

  return `<!DOCTYPE html>
<html lang="ur" dir="ltr">
<head>
  <meta charset="UTF-8">
  <title>Receipt #${serialNo}</title>
  <style>
    @page {
      size: 80mm auto;
      margin: 0;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      width: 78mm;
      max-width: 78mm;
      margin: 0 auto;
      padding: 4mm 2mm 10mm 2mm;
      font-family: 'Courier New', Courier, monospace, 'Noto Nastaliq Urdu', Tahoma, sans-serif;
      font-size: 11px;
      line-height: 1.25;
      color: #000;
      background: #fff;
    }
    .text-center { text-align: center; }
    .text-right { text-align: right; }
    .text-left { text-align: left; }
    .bold { font-weight: bold; }
    .urdu { font-family: 'Noto Nastaliq Urdu', 'Noto Sans Arabic', Tahoma, sans-serif; }
    .shop-title-ur { font-size: 17px; font-weight: bold; margin-bottom: 2px; }
    .shop-title-en { font-size: 13px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px; }
    .tagline { font-size: 9.5px; margin: 2px 0 4px 0; }
    .location { font-size: 10px; font-weight: bold; margin-bottom: 4px; }
    .divider-solid { border-top: 1.5px solid #000; margin: 4px 0; }
    .divider-dashed { border-top: 1px dashed #000; margin: 4px 0; }
    .divider-double { border-top: 2.5px double #000; margin: 5px 0; }
    .contacts-grid {
      font-size: 9px;
      line-height: 1.2;
      margin-bottom: 4px;
    }
    .row {
      display: flex;
      justify-content: space-between;
      margin: 1.5px 0;
    }
    .row-highlight {
      font-size: 12px;
      font-weight: bold;
      margin: 3px 0;
    }
    .total-box {
      border: 1.5px solid #000;
      padding: 4px;
      margin: 5px 0;
      text-align: center;
    }
    .total-amount {
      font-size: 16px;
      font-weight: 900;
      margin-top: 2px;
    }
    .footer {
      font-size: 9.5px;
      text-align: center;
      margin-top: 6px;
    }
  </style>
</head>
<body>
  <!-- Header Details -->
  <div class="text-center">
    <div class="shop-title-ur urdu">سنہری کمیشن شاپ</div>
    <div class="shop-title-en">Sunheri Commission Shop</div>
    <div class="location">غلہ منڈی ملکہ ہانس (Ghalla Mandi, Malka Hans)</div>
    <div class="tagline urdu">ہر قسم کی زرعی اجناس کی خرید و فروخت کا با اعتماد ادارہ</div>
  </div>

  <div class="divider-solid"></div>

  <!-- Contacts -->
  <div class="contacts-grid">
    <div class="row">
      <span>حاجی شبیر حسین (صدر):</span>
      <span class="bold">0300-9696234</span>
    </div>
    <div class="row">
      <span>حاجی فقیر حسین:</span>
      <span class="bold">0302-6535403</span>
    </div>
    <div class="row">
      <span>چوہدری سمیع:</span>
      <span class="bold">0303-4884306</span>
    </div>
    <div class="row">
      <span>چوہدری بلال:</span>
      <span class="bold">0309-9692044</span>
    </div>
  </div>

  <div class="divider-dashed"></div>

  <!-- Bill Meta -->
  <div class="row bold">
    <span>بل نمبر (S.No): #${serialNo}</span>
    <span>${date} ${time}</span>
  </div>
  <div class="row" style="margin-top: 2px;">
    <span>گاہک (Client):</span>
    <span class="bold">${clientName}</span>
  </div>

  <div class="divider-solid"></div>

  <!-- Weight Breakdown Table -->
  <div class="row">
    <span>صافی وزن (Gross Wt):</span>
    <span class="bold">${saafi} Kg</span>
  </div>
  <div class="row">
    <span>باردانہ کٹوتی (Bardana):</span>
    <span>-${bardana} Kg</span>
  </div>
  <div class="row">
    <span>کنڈہ کٹوتی (Kanda):</span>
    <span>-${kanda} Kg</span>
  </div>

  <div class="divider-dashed"></div>

  <!-- Net Weight & Manns -->
  <div class="row row-highlight">
    <span>خالص وزن (Net Wt):</span>
    <span>${netWeight} Kg</span>
  </div>
  <div class="row bold" style="font-size: 11.5px; background: #eee; padding: 2px 0;">
    <span>وزن بحساب من:</span>
    <span>${totalManns} من  ${remainingKgs} کلو</span>
  </div>
  <div class="row" style="font-size: 9.5px; color: #333;">
    <span>(Conversion: 1 Mann = 40 Kg)</span>
    <span>${totalManns}M ${remainingKgs}Kg</span>
  </div>

  <div class="divider-dashed"></div>

  <!-- Rates -->
  <div class="row">
    <span>ریٹ فی من (Rate/Mann):</span>
    <span class="bold">Rs. ${ratePerMann}</span>
  </div>
  <div class="row">
    <span>ریٹ فی کلو (Rate/Kg):</span>
    <span>Rs. ${ratePerKg}</span>
  </div>

  <!-- Total Bill Highlight Box -->
  <div class="total-box">
    <div class="bold" style="font-size: 11px;">کل رقم (TOTAL BILL)</div>
    <div class="total-amount">Rs. ${totalBill}</div>
  </div>

  <!-- Receipt Footer -->
  <div class="divider-double"></div>
  <div class="footer">
    <div class="urdu bold">شکریہ! دوبارہ تشریف لائیں۔</div>
    <div>Software by Mandi Desktop Billing System</div>
  </div>
</body>
</html>`
}
