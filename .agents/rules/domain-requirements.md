---
trigger: always_on
---

# Business Context: Mandi Commission Shop (Arthia)
This is an offline desktop application for a grain market (Mandi) commission shop. It calculates agricultural commodity weights and generates thermal printer receipts. 

# Header Details (Hardcode into UI)
- Title: Sunheri Commission Shop (سنہری کمیشن شاپ)
- Location: Ghalla Mandi, Malka Hans (غلہ منڈی ملکہ ہانس)
- Tagline: ہر قسم کی زرعی اجناس کی خرید و فروخت کا با اعتماد ادارہ
- Contacts: 
  - Haji Shabbir Hussain (President Anjuman Arthian): 0300-9696234
  - Haji Faqir Hussain: 0302-6535403
  - Chaudhry Sami: 0303-4884306
  - Chaudhry Bilal: 0309-9692044

# Core Mathematical Logic
The application relies on a base unit called a "Mann" (1 Mann = exactly 40 Kgs).
1. Inputs required from user: `saafi_weight` (Gross Weight), `bardana_weight` (Bag Weight), `kanda_weight` (Machine Variation), and `rate_per_mann`.
2. Net Weight calculation: `Net Weight = saafi_weight - bardana_weight - kanda_weight`
3. Conversion to Manns & Kgs:
   - `Total Manns = Math.floor(Net Weight / 40)`
   - `Remaining Kgs = Net Weight % 40`
4. Financial Calculation:
   - `Rate per Kg = rate_per_mann / 40`
   - `Total Bill = (Total Manns * rate_per_mann) + (Remaining Kgs * Rate per Kg)`

# UI Layout (Single Screen)
- Top: Static header with the shop details.
- Middle: Bill generation form. Date and Serial Number must auto-generate. Inputs for Client Name, Saafi, Bardana, Kanda, and Rate. The Net Weight, Total Manns, Remaining Kgs, and Total Bill must auto-calculate in real-time as the user types.
- Actions: "Generate & Print Bill" button, "Clear Form" button.
- Bottom: A data table acting as a daily ledger showing historical transactions saved in the local database.