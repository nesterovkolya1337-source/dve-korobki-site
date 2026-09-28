# Assets manifest

| Asset | Status | Usage | Rights / note |
|---|---|---|---|
| `public/images/hero-home.webp` | Preview approved | Home desktop hero | AI-generated project image; do not identify as a specific gearbox |
| `public/images/hero-dq200-placeholder.svg` | Placeholder | DQ200 | Replace with technically confirmed DQ200 image |
| `public/brand/logo-detailed-compact.webp` | Approved preview | Header | Detailed compact brand lockup adapted from the owner-approved logo concept |
| `public/brand/logo-detailed-compact-dark.webp` | Approved preview | Footer/dark surfaces | Inverse detailed brand lockup |
| `public/brand/hero-brand-emblem.webp` | Approved preview | Home hero identity panel | Owner-provided logo artwork, adapted for the website |
| `public/brand/logo-compact.svg` | Archive fallback | Header/footer | Previous simplified compact adaptation |
| `public/brand/logo-symbol.svg` | Draft | Favicon/mobile | Requires owner approval |
| `public/brand/logo-original-reference.png` | Reference only | Brand work | Do not serve as the small header logo |
| `public/brand/logo-ai-compact-reference.png` | Reference only | Brand work | Raster reference, not production asset |

## Naming convention

`{subject}-{placement}-{variant}.{webp|svg}`

Examples:

- `dq200-hero-v1.webp`
- `mechatronic-card-solenoids.webp`
- `icon-diagnostics.svg`
- `logo-compact-white.svg`

## Owner photographs — 2026-09-28

The owner explicitly requested use of the supplied photographs and confirmed the workshop photographs show the team's previous service location. Public gallery heading: «Из практики нашей команды». No claim that the photographs show a current branch, a specific customer case or a verified gearbox model.

| Website asset | Supplied original | Placement | Treatment |
|---|---|---|---|
| `public/images/team/gearbox-measurement.jpg` | `IMG_7231.jpeg` | Home gallery, diagnostics hero | Original bytes; CSS framing around gauge, hands and transmission |
| `public/images/team/double-clutch.jpg` | `IMG_7242.jpeg` | Home gallery, clutch service hero | Original bytes; square presentation without naming an unverified model |
| `public/images/team/workshop.jpg` | `IMG_7251.jpeg` | Home gallery, about page | Original bytes; original 1280:577 photographic ratio |
| `public/images/team/mechatronic.jpg` | `IMG_7255.jpeg` | Home gallery, mechatronic service hero | Original screenshot; fixed CSS viewport y=418..862 at 592px wide hides phone UI, retains photographic source area and watermark |

No image generation or mechanical-detail retouching. Model-specific gearbox pages retain their existing visuals pending model-confirmed source images. The small Instagram ranking graphics are not used as technical identification evidence. Existing approved homepage brand hero is preserved. Photo definitions and placements live in `src/lib/photos.mjs`.
