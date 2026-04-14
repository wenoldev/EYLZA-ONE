# Design System Strategy: The Curated Heirloom

## 1. Overview & Creative North Star
The Creative North Star for this design system is **"The Digital Atelier."** It reimagines the e-commerce experience not as a high-volume storefront, but as a quiet, light-filled studio where every piece of jewelry is a focal point. 

To move beyond the "template" look common in retail, this system employs **Intentional Asymmetry** and **Generous Breathing Room**. By utilizing a non-traditional typography scale and overlapping elements (such as editorial photography bleeding into surface containers), we break the rigid verticality of standard grids. The goal is a visual experience that feels bespoke, archival, and deeply intentional—much like the jewelry it showcases.

## 2. Colors
Our palette is rooted in an organic, earth-toned sophistication. It avoids high-contrast blacks and pure whites in favor of softer, more natural transitions.

### Tonal Application & The "No-Line" Rule
*   **The No-Line Rule:** Explicitly prohibit the use of 1px solid borders to define sections. Traditional borders create a "boxed-in" feeling that contradicts high-end luxury. Instead, boundaries must be defined solely through background color shifts. For example, a `surface-container-low` (`#f6f3ee`) section should sit directly against a `surface` (`#fcf9f4`) background to create a soft, natural break.
*   **Surface Hierarchy & Nesting:** Treat the UI as a physical desk of fine paper. Use `surface-container-highest` (`#e5e2dd`) for global navigation or sidebars, and `surface-container-lowest` (`#ffffff`) for foreground cards to create a "lifted" effect.
*   **The Glass & Gradient Rule:** To add "soul" to the interface, use Glassmorphism for floating navigation bars or quick-view overlays. Use a backdrop blur (12px–20px) with a semi-transparent `surface` color.
*   **Signature Textures:** For main CTAs and hero backgrounds, use subtle linear gradients transitioning from `primary` (`#615d3c`) to `primary_container` (`#7a7553`). This depth mimics the way light hits olive-toned velvet or oxidized gold.

## 3. Typography
Typography is the voice of this system. We pair a high-contrast, editorial serif with a functional, wide-set sans-serif to create an atmosphere of modern heritage.

*   **Display & Headlines (Newsreader):** The serif font is our "Artisan" voice. It should be used with generous letter-spacing (tracking) in titles to feel expansive and premium. Use `display-lg` for hero statements to command attention through sheer scale.
*   **Body & Labels (Manrope):** The sans-serif is our "Curator" voice. It provides clarity and modern balance. Manrope’s geometric yet friendly nature ensures that even small product details are legible and feel contemporary.
*   **Hierarchy as Identity:** By emphasizing a large gap between `headline-lg` (2rem) and `body-md` (0.875rem), we create a high-fashion editorial rhythm that guides the eye toward storytelling first, and utility second.

## 4. Elevation & Depth
In this design system, depth is a whisper, not a shout. We move away from heavy material shadows toward **Tonal Layering**.

*   **The Layering Principle:** Depth is achieved by "stacking" surface tiers. An inner card using `surface-container-lowest` on a `surface-container-low` background provides a soft, structural lift without the clutter of a shadow.
*   **Ambient Shadows:** When a true "floating" effect is required (e.g., a cart drawer or modal), shadows must be extra-diffused. Use large blur values (30px-50px) and low opacity (4%–6%). The shadow color should be a tinted version of `on-surface` (a warm charcoal) rather than a neutral grey to maintain the "warmth" of the off-white palette.
*   **The Ghost Border Fallback:** If a border is required for accessibility (such as input fields), use a "Ghost Border": the `outline-variant` (`#cbc6b9`) at 20% opacity. Never use 100% opaque borders.
*   **Backdrop Blur:** Use 15px-20px blurs on overlays to allow the underlying product photography to bleed through, creating a sense of continuity and integrated space.

## 5. Components
Our components are defined by sharp corners (`0px` roundedness) to evoke the precision of jewelry cutting and the sophistication of high-end stationery.

*   **Buttons:** 
    *   *Primary:* `primary` background, `on-primary` text. No border. Sharp corners.
    *   *Secondary:* `surface` background with a `ghost border`. 
    *   *Interaction:* On hover, shift the background to `primary_container` with a subtle 200ms transition.
*   **Inputs & Text Areas:** Use a single bottom-aligned `outline` or a very subtle `surface-container` fill. Avoid the "four-sided box" look.
*   **Cards & Lists:** **Strictly forbid divider lines.** Separate list items using the Spacing Scale (vertical white space) or by alternating background tones between `surface` and `surface-container-low`.
*   **Chips:** Minimalist rectangles using `secondary_container` for "Sale" or "New" tags. Text should be `on_secondary_container` for a tonal, "gold-on-olive" feel.
*   **Product Displays:** Ensure product images are never boxed. Use the `surface` color as the image background to make the jewelry appear as if it is resting directly on the page.

## 6. Do's and Don'ts

### Do
*   **Do** use asymmetrical layouts where text blocks are offset from image centers to create an editorial feel.
*   **Do** prioritize white space over information density. If a screen feels "busy," remove an element rather than shrinking it.
*   **Do** use `on_surface_variant` for secondary text to maintain a soft, low-contrast hierarchy.

### Don't
*   **Don't** use rounded corners. The design system is strictly `0px` radius to maintain a formal, high-end architectural feel.
*   **Don't** use traditional "Drop Shadows" (high opacity, small blur). They feel "app-like" rather than "brand-like."
*   **Don't** use pure black (`#000000`). Always use the system’s `on_surface` or `primary` colors to keep the palette warm and cohesive.
*   **Don't** use dividers to separate content. Let the whitespace and tonal shifts do the work.