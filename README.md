# New Life Laptops – Website

> **"We rebuild computers, God rebuilds lives."**

Full website for [newlifelaptops.com](https://www.newlifelaptops.com) — a premium refurbished laptop store built with modern HTML, CSS, and JavaScript.

---

## 📁 File Structure

```
newlifelaptops/
├── index.html          ← Homepage (hero, featured products, process, mission)
├── shop.html           ← Full shop with search, filters, sort
├── product.html        ← Individual product detail page
├── about.html          ← About page + mission + values
├── contact.html        ← Contact form + info
├── terms.html          ← Terms of Service
├── refund.html         ← Refund Policy
├── privacy.html        ← Privacy Policy
├── css/
│   └── style.css         ← All styles (dark tech theme, responsive)
├── js/
│   ├── circuit.js        ← Animated circuit board canvas background
│   ├── components.js     ← Shared nav + footer (update once, applies everywhere)
│   ├── products.js       ← ⭐ PRODUCT DATABASE – edit this to update products
│   ├── shop.js           ← Shop filtering, search, sorting logic
│   └── main.js           ← Scroll animations, contact form, product detail
└── images/
    ├── logo.png          ← ⚠️ ADD YOUR LOGO HERE
    └── products/         ← Product photos go here
```

---

## 🚀 How to Preview Locally

**Option 1 – VS Code (easiest):**
1. Install the [Live Server extension](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer)
2. Right-click `index.html` → **Open with Live Server**

**Option 2 – Python (built-in):**
```bash
cd newlifelaptops
python -m http.server 8000
# Then open: http://localhost:8000
```

> ⚠️ Don't open HTML files directly in a browser (file:// URLs). Use a local server so scripts load correctly.

---

## ➕ How to Add or Edit Products

Open **`js/products.js`** and edit the `products` array.

Each product looks like this:
```javascript
{
  id: 11,                          // Unique number (increment from last)
  name: 'Dell Latitude E5470',
  brand: 'Dell',
  model: 'Latitude E5470',
  category: 'business',            // budget | business | student | gaming | desktop
  processor: 'Intel Core i5-6300U (2.4GHz)',
  ram: '8GB DDR4',
  storage: '256GB SSD',
  display: '14" FHD IPS',
  os: 'Windows 11 Pro',
  condition: 'Grade A – Excellent',
  battery: 'Holds 80%+ charge',
  price: 229.99,
  availability: 'in-stock',        // 'in-stock' or 'sold-out'
  image: 'images/products/dell-e5470.jpg',
  badge: 'New Arrival',            // null for no badge
  description: 'A reliable business laptop...',
  features: [
    'Fast SSD storage',
    'Windows 11 Pro included',
    // add more as needed
  ]
},
```

**To change featured products on the homepage**, edit this line in `products.js`:
```javascript
const featuredProductIds = [3, 5, 9]; // Change to the IDs you want featured
```

---

## 📧 Setting Up the Contact Form

The contact form currently simulates a submission. To make it actually send emails, use one of these free services:

**Option 1 – Formspree (easiest, free):**
1. Go to [formspree.io](https://formspree.io) and create a free account
2. Create a new form and copy your endpoint URL
3. In `contact.html`, add `action="https://formspree.io/f/YOUR_ID" method="POST"` to the `<form>` tag
4. Remove the `e.preventDefault()` block in `main.js`

**Option 2 – Netlify Forms (if hosting on Netlify):**
- Add `netlify` attribute to your `<form>` tag
- Netlify handles the rest automatically

---

## 📸 Adding Your Logo

1. Copy your logo PNG to `images/logo.png`
2. That's it — it shows automatically in the nav, hero, and footer

Recommended: PNG with transparent background, at least 200px tall.

---

## 📸 Adding Product Photos

1. Add photo to `images/products/your-photo.jpg`
2. Update the `image` field in `js/products.js` for that product
3. Recommended size: 800×600px, JPG or PNG

---

## 🔧 Updating Contact Info

Your contact details appear in `js/components.js` (footer) and `contact.html`.

Search for and replace these placeholders:
- `info@newlifelaptops.com` → your real email
- `(000) 000-0000` → your real phone number
- Facebook link → your real Facebook page URL

---

## 🌐 Connecting to GoDaddy (newlifelaptops.com)

**Option A – GitHub Pages (Free Hosting):**
1. In your GitHub repo, go to **Settings → Pages**
2. Set Source to **main branch / root**
3. GitHub will give you a URL like `neservicewv.github.io/newlifelaptops`
4. In GoDaddy DNS settings, add a **CNAME record**:
   - Name: `www`
   - Value: `neservicewv.github.io`
5. Add a file named `CNAME` to your repo root with content: `www.newlifelaptops.com`
6. In GoDaddy, set an **A record** for `@` pointing to GitHub Pages IPs:
   - `185.199.108.153`
   - `185.199.109.153`
   - `185.199.110.153`
   - `185.199.111.153`

**Option B – Netlify (Free, Easiest, Faster):**
1. Go to [netlify.com](https://netlify.com) and sign up free
2. Connect your GitHub repo
3. It auto-deploys whenever you push changes
4. In Netlify, go to **Domain Settings** and add `newlifelaptops.com`
5. Follow Netlify’s instructions to update your GoDaddy DNS

---

## 📤 How to Push Changes to GitHub

After making edits to any file:

```bash
git add .
git commit -m "Updated product listings"
git push
```

If using GitHub Desktop:
1. Open the app, it shows changed files
2. Write a summary and click **Commit to main**
3. Click **Push origin**

---

## 💳 Adding Payments Later

The site is structured for easy payment integration:

- **Stripe:** Add Stripe.js and a payment button to `contact.html` or a new `checkout.html`
- **PayPal:** Add a PayPal Buy Now button to any product card
- **Square:** Embed a Square payment link
- **Invoice method:** Current setup — customers click "Contact to Buy" and you send an invoice

---

## ✅ Pre-Launch Checklist

- [ ] Add your logo to `images/logo.png`
- [ ] Add real product photos to `images/products/`
- [ ] Update contact info (email, phone, Facebook) in `components.js` and `contact.html`
- [ ] Set up contact form with Formspree or Netlify Forms
- [ ] Connect domain via GitHub Pages or Netlify
- [ ] Test on mobile phone
- [ ] Review all product listings in `products.js`

---

*Built with care for New Life Laptops — "We rebuild computers, God rebuilds lives."*
