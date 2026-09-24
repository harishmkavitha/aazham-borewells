# Multi-client GitHub Pages website

This website uses one static GitHub Pages codebase for multiple customer demos.

## Demo URLs

- Default customer: `index.html?client=aazham`
- Second demo: `index.html?client=demo-002`
- Client editor: `editor.html?client=aazham`

Add customers to `config/site-config.xlsx`. The included GitHub Action converts the workbook to `config/site-config.json` when the workbook is pushed.

## Excel configuration

- **Customers**: business name, phone, WhatsApp, email, address, map, social/business links, logo and favicon paths.
- **Theme**: CSS color tokens per customer.
- **Typography**: heading/body font families, sizes and optional Google Fonts URL.
- **Pages**: enable/disable a page, show/hide its menu entry, or keep the menu visible while hiding demo content.
- **Sections**: enable/disable a stable section ID such as `section-index-01`.
- **Content** and **Media**: key-based overrides. The Home hero contains examples.

## Visual client editor

Open `editor.html?client=<ClientID>`. It loads the real website in editing mode. Text can be clicked and edited; images can be clicked and replaced; links can be double-clicked; YouTube/video embeds can be clicked and assigned a new URL. Hold **Alt and click a section** to select that section. The toolbar supports Save, Undo, Restore Selected, Hide Selected, Reset Page and Export Edits.

Editor changes are stored in browser `localStorage`, so they survive refreshes on the same browser/device. For a permanent cross-device publish workflow, export edits or move them into the Excel/JSON configuration before deployment.

## Contact form

The Contact page builds a WhatsApp message using the configured business WhatsApp number and includes Name, Phone, Email, Service, Area and Message.

## GitHub Pages

No server-side code is required. Keep `.nojekyll` at the repository root. The GitHub Action needs repository **Actions** enabled and `contents: write` permission to commit regenerated JSON.
