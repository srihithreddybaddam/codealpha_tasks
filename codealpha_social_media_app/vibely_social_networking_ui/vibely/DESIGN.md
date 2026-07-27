---
name: Vibely
colors:
  surface: '#f9f9ff'
  surface-dim: '#d9d9e0'
  surface-bright: '#f9f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f3fa'
  surface-container: '#ededf4'
  surface-container-high: '#e8e7ef'
  surface-container-highest: '#e2e2e9'
  on-surface: '#1a1c20'
  on-surface-variant: '#464556'
  inverse-surface: '#2e3036'
  inverse-on-surface: '#f0f0f7'
  outline: '#777588'
  outline-variant: '#c7c4d9'
  surface-tint: '#4e3bf3'
  primary: '#4129e7'
  on-primary: '#ffffff'
  primary-container: '#5b4bff'
  on-primary-container: '#ede9ff'
  inverse-primary: '#c4c0ff'
  secondary: '#ad2d47'
  on-secondary: '#ffffff'
  secondary-container: '#fd6a80'
  on-secondary-container: '#6c0020'
  tertiary: '#505355'
  on-tertiary: '#ffffff'
  tertiary-container: '#686b6e'
  on-tertiary-container: '#ebecef'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e3dfff'
  primary-fixed-dim: '#c4c0ff'
  on-primary-fixed: '#120068'
  on-primary-fixed-variant: '#340edd'
  secondary-fixed: '#ffdadc'
  secondary-fixed-dim: '#ffb2b9'
  on-secondary-fixed: '#400010'
  on-secondary-fixed-variant: '#8c1231'
  tertiary-fixed: '#e1e2e5'
  tertiary-fixed-dim: '#c5c6c9'
  on-tertiary-fixed: '#191c1e'
  on-tertiary-fixed-variant: '#44474a'
  background: '#f9f9ff'
  on-background: '#1a1c20'
  surface-variant: '#e2e2e9'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
    letterSpacing: 0em
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: 0em
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.02em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  container-max: 1280px
  gutter: 24px
  margin-desktop: 64px
  margin-mobile: 20px
---

## Brand & Style
The design system is centered on a "Forward-Luxury" startup aesthetic, tailored for a high-end social networking experience in 2026. The brand personality is sophisticated yet approachable, emphasizing high-fidelity interactions and a serene user environment.

The visual style blends **Soft Minimalism** with **Refined Glassmorphism**. It prioritizes clarity and "breathability," ensuring that user-generated content remains the focal point while the interface provides a premium, tactile frame. The emotional response should be one of calm, exclusivity, and modern precision.

## Colors
This design system utilizes a high-clarity light mode palette designed for depth and visual comfort. 

- **Primary (#5B4BFF):** A deep periwinkle used for primary actions, active states, and brand signifiers.
- **Accent (#FF6B81):** A soft coral used sparingly for notification badges, interactive highlights, and secondary emotional triggers.
- **Surface (#F8F9FC):** The primary background color, providing a soft, non-clinical white base that reduces eye strain.
- **Neutrals:** Typography utilizes a high-contrast near-black (#1A1C21) for maximum legibility, while borders and dividers use a subtle silver-gray (#E2E8F0) to maintain a "borderless" feel.

## Typography
The system uses **Inter** exclusively to achieve a systematic, utilitarian, yet modern look. The typographic hierarchy is built on a tight scale to maintain a clean, "app-like" feel even on the web.

- **Headlines:** Use tighter letter spacing and semi-bold to bold weights to create a strong visual anchor.
- **Body:** Standardized at 16px for optimal readability with generous line-height (1.5x) to support the "breathable" brand pillar.
- **Labels:** Used for metadata, button text, and overlines, often employing a slightly heavier weight to compensate for smaller sizes.

## Layout & Spacing
The design system employs a **Fluid-Fixed Hybrid Grid**. Content is housed in a centered container with a maximum width of 1280px, while background elements and glassmorphic panels can bleed to the edges of the viewport.

- **Spacing Rhythm:** Based on an 8px linear scale. Most component gaps should use 16px (2u) or 24px (3u) to maintain "breathability."
- **Desktop:** 12-column grid with 24px gutters and 64px side margins.
- **Tablet:** 8-column grid with 20px gutters and 40px side margins.
- **Mobile:** 4-column grid with 16px gutters and 20px side margins.
- **Reflow:** Sidebars and navigation panels collapse into a bottom navigation bar or a "hamburger" glass sheet on mobile devices.

## Elevation & Depth
Depth is created through a combination of **Tonal Layering** and **Subtle Glassmorphism**. 

- **The Base:** The #F8F9FC surface is the lowest level.
- **The Cards:** Primary content cards use a pure white (#FFFFFF) background with a very soft, multi-layered shadow (0px 4px 20px rgba(0, 0, 0, 0.04)). 
- **The Overlays:** Navigation bars and floating action menus utilize a "Glass" effect: `#FFFFFF` at 70% opacity with a `backdrop-filter: blur(12px)`.
- **The Interaction:** Upon hover, elements should slightly lift (shadow increases to 0px 8px 30px rgba(0, 0, 0, 0.08)) rather than changing color significantly, preserving the minimal aesthetic.

## Shapes
The shape language is defined by large, friendly radii that evoke a sense of modern comfort.

- **Standard Components:** Buttons, input fields, and small cards use a **16px (rounded-lg)** radius.
- **Large Containers:** Main content feeds and modal sheets use a **24px (rounded-xl)** radius.
- **Interactive Elements:** Avatars and icon containers follow a **Squircle** or fully circular profile to provide visual contrast against the structured grid.

## Components
- **Buttons:** Primary buttons are solid #5B4BFF with white text and 16px rounding. Secondary buttons use a subtle ghost style with a #5B4BFF border or a light periwinkle tint background.
- **Cards:** White backgrounds, 24px corner radius, and subtle glassmorphic headers when used for "Featured" content. Padding inside cards should be a generous 24px or 32px.
- **Input Fields:** Soft gray background (#F1F3F9) with no border in default state; transitions to a #5B4BFF border on focus.
- **Chips:** Small, highly rounded (pill-shaped) elements with a light tint of the primary color (#5B4BFF at 10% opacity) for tags and categories.
- **Lists:** Clean, borderless rows with 16px vertical padding, using 1px dividers only when content density is high.
- **Glass Overlays:** Used for sticky headers and bottom navigation, providing a sense of place by allowing content to peek through during scroll.