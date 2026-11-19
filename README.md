# Nexora Business Solutions — Website Template

Project 01 from the Imperial Tech Innovations *Website Design Templates* portfolio.
A premium multi-page corporate website for a fictional London business consulting firm.

> All brands, people and figures are fictional and used for demonstration only.

## Run locally

```bash
cd nexora
npm run dev        # serves the site at http://localhost:8000
```

No dependencies to install: it is plain HTML, CSS and JavaScript.

## Pages

| Page | File |
|---|---|
| Home | `index.html` |
| About Us | `about.html` |
| Services (all five, with detail sections `#strategy`, `#digital`, `#finance`, `#people`, `#process`) | `services.html` |
| Industries We Serve | `industries.html` |
| Case Studies (illustrative) | `case-studies.html` |
| Insights listing + 5 articles | `insights.html`, `insights/*.html` |
| Contact Us (form, WhatsApp, map placeholder, FAQs) | `contact.html` |
| Privacy Policy | `privacy-policy.html` |
| Terms & Conditions | `terms.html` |
| Cookie Policy + Cookie Preferences (`#preferences`) | `cookie-policy.html` |
| Website Disclaimer | `disclaimer.html` |
| Not found | `404.html` |

Plus `sitemap.xml` and `robots.txt`.

## Brand

| Token | Value |
|---|---|
| Navy (primary) | `#142B45` |
| White (secondary) | `#FFFFFF` |
| Light grey (background) | `#F3F5F7` |
| Gold (accent) | `#B89B62` |
| Headings | Manrope |
| Body | Inter |

All colours and the hero image are CSS variables at the top of `css/styles.css`.

## Before going live: checklist

1. **Settings in `js/main.js`** (the `CONFIG` block at the top):
   - `whatsappNumber`: the WhatsApp Business number (digits only, e.g. `447700900123`).
   - `gaMeasurementId`: Google Analytics 4 ID. Analytics only loads after the visitor accepts analytics cookies.
   - `formEndpoint`: a JSON form endpoint (e.g. Formspree). Without one, the enquiry form opens the visitor's email app pre-filled.
   - `newsletterEndpoint`: your email provider's sign-up endpoint (Mailchimp, Brevo, etc.).
2. **Legal pages**: every yellow `[To be confirmed: …]` highlight needs real details (company name and number, registered office, ICO registration, providers, retention periods). Have the policies reviewed by a qualified adviser.
3. **Contact page**: full office address, then replace the map placeholder with an embedded map (and add it to the Cookie Policy).
4. **Domain**: canonical URLs, Open Graph tags and `sitemap.xml` use `https://www.nexora.co.uk`. Find and replace if the domain differs.
5. **Social links** in the footer (currently `#`).
6. **Images** load from Unsplash. For best performance, download your chosen photos into `assets/images/` and update the `src` paths (and `--img-hero` / `--img-cta` in the CSS).
7. **Case studies** are illustrative. Replace them with approved client projects when available.
8. **Leadership team**: a commented-out section is ready in `about.html` for when names, roles and photos are approved.
9. **Fonts**: optionally self-host Manrope and Inter rather than using Google Fonts.

## Features

- Responsive desktop, tablet and mobile layouts; sticky header; accessible mobile menu
- Enquiry form with inline validation, consultation toggle, service pre-selection (`contact.html?service=digital`, `?type=consultation`) and spam honeypot
- Floating WhatsApp button on every page
- Cookie consent banner and preferences dialog (strictly necessary + analytics), stored for 12 months, reopened from the footer
- Insights topic filter, individual article URLs, share links
- SEO: unique titles and descriptions, canonical URLs, Open Graph tags, JSON-LD (organisation, services, articles, FAQs, breadcrumbs), sitemap
- Skip link, focus styles, labelled form fields, reduced-motion support
