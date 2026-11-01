# Landfall - Submarine Cable Atlas

Day 01: Points, 2026 #30DayMapChallenge. Explore where submarine cable networks meet land.

## Run

From this folder, run `python -m http.server 5500 --bind 127.0.0.1`, then open http://127.0.0.1:5500/. Stop with Ctrl+C. If serving the entire challenge workspace with Live Server instead, use `/2026/day01-points/` on that server.

No build step, package installation, or API key. The app uses MapLibre GL JS 4.7.1, Deck.gl 9.0.35, and OpenFreeMap Dark. Internet access and WebGL are required.

## Explore

- Search by place or cable name and filter by country.
- Select a landing point to view its cables and highlight connected routes.
- Use World, East Africa, and Southeast Asia map presets.
- Expand the legend on small screens to see the point colors and sizes.

Mint points are listed locations; amber marks a location unconfirmed in the source. Larger circles mean more listed cable connections. Dotted routes use source cable-system colors. Routes are schematic; colors and dots do not indicate traffic or operational status.

## Data and attribution

The included late-2022 snapshot has **1,414 landing points**, **180 countries / territories**, and **527 route features**. It is not a current network inventory. Cable counts do not measure capacity, latency, or resilience. Planned flags and ready-for-service years reflect the source date.

Data is copyright TeleGeography, preserved by [Open Undersea Cable Map](https://github.com/stevesong/open_undersea_cable_map) at commit [`e7903491e73bcac0d0b013b945897d10928483c4`](https://github.com/stevesong/open_undersea_cable_map/tree/e7903491e73bcac0d0b013b945897d10928483c4).

The `data/` folder contains enriched landing points (`hubs.geojson`), routes (`cable-routes.geojson`), and the [upstream license notice](data/SOURCE-LICENSE.md). Sapporo lacks cable details: its count is unknown, its country is parsed from its source name, and it uses the minimum marker size.

Source and adapted datasets use [CC BY-NC-SA 3.0](https://creativecommons.org/licenses/by-nc-sa/3.0/). Preserve attribution, the noncommercial restriction, and share-alike terms. This license does not cover TeleGeography's current commercial datasets.

Basemap attribution for OpenFreeMap, OpenMapTiles, and OpenStreetMap appears on the map. Libraries retain their own licenses; no separate application source license has been selected.

## Check syntax

Run `node --check app.js` from this project folder. Node.js is optional and is not needed to run the app.

## Repository and deployment

- [GitHub repository](https://github.com/Benard10/30daymapchallenge-2026-day01-points-landfall)
- [Live app](https://benard10.github.io/30daymapchallenge-2026-day01-points-landfall/)

GitHub Pages publishes the root of `main`. The `.nojekyll` file keeps this a plain static site. Changes pushed to `main` trigger a new deployment.

The repository contains this Day 1 folder only. The parent master plan is outside it. `.gitignore` excludes the local `prepare_data.py`, `data/summary.json`, and Python caches; both runtime GeoJSON files and source attribution remain included.

To publish future changes from this folder:

```powershell
git add .
git diff --cached --stat
git commit -m "Describe your changes"
git push
```
