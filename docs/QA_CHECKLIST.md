# QA checklist

## Automated

Run:

```bash
npm run check
```

This validates the 22-route map, Figma mappings, required content, build output, metadata, sitemap, robots.txt, header and footer.

## Manual visual QA

- Desktop: 1440 × full page.
- Mobile: 390 × full page.
- Tablet: 768 and 1024.
- No horizontal scroll.
- No clipped button labels.
- No text overlays.
- Header and footer use the approved compact logo.
- Hero image remains inside its production frame.
- CTA button stays inside the dark container.
- Sticky mobile actions do not cover FAQ/footer.
- All phone links use `tel:`.
- All images have meaningful alt text.
- Keyboard navigation and visible focus state.
- Form success and error states.
- Lighthouse checks before release.

## Release gate

Do not connect the custom domain until:

- contacts are confirmed;
- form delivery works;
- privacy/consent text exists;
- warranty and prices are approved;
- technical images are verified.
