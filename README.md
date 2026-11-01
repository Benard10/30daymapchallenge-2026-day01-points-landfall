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

## Push this folder

Create an empty GitHub repository, then run these commands in PowerShell. Replace `YOUR-USERNAME` and `YOUR-REPOSITORY` with your GitHub details:

```powershell
Set-Location -LiteralPath 'D:\Development\App Development\#30DayMapChallenge\2026\day01-points'
git init -b main
git add .
git status
git diff --cached --stat
git commit -m "Add Landfall submarine cable atlas"
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPOSITORY.git
git push -u origin main
```

The `.gitignore` here excludes `prepare_data.py`, `data/summary.json`, and Python caches. Runtime files, both GeoJSON datasets, this README, and source attribution are included.

Only this folder becomes the repository. The parent master plan and collection README are outside it. On GitHub, `index.html` will appear at the repository root; the local parent path `2026/day01-points` will not be included. Pushing source does not automatically publish a website.
