---
version: 1.0.0
name: WorkAdda-Airbnb-System
description: "A warm, high-trust hyperlocal marketplace design system inspired by Airbnb's consumer design language. Built on a crisp white canvas (#FFFFFF) with warm Rausch coral (#FF385C) as the primary brand voltage, obsidian charcoal (#222222) for high-contrast typographic clarity, and WhatsApp emerald (#25D366) for instant direct worker communication. Tailored specifically for bilingual English and Telugu readability with soft rounded surfaces (16px cards, full pill search & actions), elevated floating cards, and micro-interactions."

colors:
  # Primary Brand Voltage (Airbnb Rausch)
  primary: "#FF385C"
  primary-hover: "#E00B41"
  primary-active: "#D7043A"
  primary-subtle: "#FFF1F3"
  primary-border: "#FFD2D9"

  # Communication & Trust Actions
  whatsapp: "#25D366"
  whatsapp-hover: "#20BA5A"
  whatsapp-subtle: "#E8FBF0"
  verified-green: "#008A05"
  verified-badge-bg: "#ECFDF5"

  # Typographic Hierarchy (Airbnb Ink Ladder)
  ink: "#222222"             # High-contrast title and headline color
  ink-body: "#484848"        # Primary readable body text
  ink-muted: "#717171"       # Secondary labels, subtitles, hints
  ink-subtle: "#B0B0B0"      # Placeholder and disabled text
  ink-inverse: "#FFFFFF"     # Text on dark or brand colored surfaces

  # Canvas & Surface System
  canvas: "#FFFFFF"          # Page base
  surface-soft: "#F7F7F7"    # App background wash
  surface-card: "#FFFFFF"    # Card container surface
  surface-hover: "#F2F2F2"   # Interactive card hover
  surface-active: "#EBEBEB"  # Pressed state

  # Hairlines & Dividers
  hairline: "#EBEBEB"        # Clean 1px card and list separator
  hairline-subtle: "#F0F0F0"
  border-input: "#B0B0B0"
  border-focus: "#222222"

typography:
  display:
    fontSize: "28px"
    fontWeight: "700"
    lineHeight: "1.25"
    letterSpacing: "-0.02em"
  title-lg:
    fontSize: "22px"
    fontWeight: "600"
    lineHeight: "1.3"
  title-md:
    fontSize: "18px"
    fontWeight: "600"
    lineHeight: "1.35"
  body-md:
    fontSize: "15px"
    fontWeight: "400"
    lineHeight: "1.5"
  body-sm:
    fontSize: "13px"
    fontWeight: "400"
    lineHeight: "1.4"
  caption:
    fontSize: "12px"
    fontWeight: "500"
    lineHeight: "1.3"

radius:
  card: "16px"               # rounded-2xl
  pill: "9999px"             # rounded-full
  button: "12px"             # rounded-xl
  avatar: "9999px"

shadows:
  card: "0 2px 8px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04)"
  card-hover: "0 8px 24px rgba(0, 0, 0, 0.12)"
  floating-search: "0 4px 18px rgba(0, 0, 0, 0.10)"
  bottom-bar: "0 -4px 16px rgba(0, 0, 0, 0.08)"

rules:
  - "Never use harsh pure red (#EF4444) or generic blue (#2563EB). Use Airbnb Rausch (#FF385C) as the unifying primary voltage."
  - "Search bars must always be pill-shaped (`rounded-full`) with a distinct search action orb."
  - "Worker cards must use 16px radius, subtle hairline borders (#EBEBEB), and crisp white backgrounds with soft shadows."
  - "Telugu text must be paired with generous line-height to prevent diacritic/vowel-sign clipping."
  - "Direct action CTAs (Call Now and WhatsApp) must be prominent, high-contrast, and touch-friendly for mobile."
