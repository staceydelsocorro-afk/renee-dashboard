# Renée Marino — Screenshot Cards

Post, profile and comment screenshots rebuilt in each platform's own interface and
typeface, carrying her real figures and real comments. Transparent PNGs, sized to
scale and place over video.

## What's in `out/`

17 cards, each rendered in both interface themes:

- `*-light.png` — light interface
- `*-dark.png` — dark interface

Each PNG is its natural card size (1080px wide, height set by content) on a
transparent background with a soft drop shadow already cut in. Drop one on a track
above the footage and scale it to taste — no keying, no masking.

## Typefaces

Each card uses the typeface the platform actually renders in:

| Platform | Typeface |
|---|---|
| LinkedIn | Source Sans 3 — LinkedIn's own face |
| YouTube | Roboto — YouTube's own face |
| Instagram | Inter — closest open substitute for Instagram Sans / SF Pro, which are not licensable |

## Every card stays on its own platform

Her comments are real YouTube comments, so they render in YouTube's comment UI.
Putting them in LinkedIn or Instagram chrome would attribute real people's words to
a platform they never posted on. LinkedIn chrome carries the LinkedIn figures,
Instagram chrome the Instagram ones.

## Where every number comes from

| Card | Figure | Source | As of |
|---|---|---|---|
| `yt-video` | 3,077,079 views · 184,671 likes · 11,042 comments | YouTube, video `0RVqSBisvHU` | 21 Sep 2026 |
| `yt-channel` | 15.2K subscribers · 297 videos · 3,239,159 views | YouTube channel `UCsSkET6muRFdrKhnW2yyr7g` | 21 Sep 2026 |
| `ig-profile` | 2.4K posts · 23.4K followers · 3.2K following | Instagram `@iamreneemarino` | 21 Sep 2026 |
| `li-profile` | 5,093 followers | Dashboard `index.html` | May 2026 |
| `li-impressions` | *blank template* | **not sourced — see below** | — |
| `yt-comment-*` | verbatim | public YouTube comments | relative to 21 Sep 2026 |
| `yt-thread-*` | verbatim, both sides | public YouTube threads | relative to 21 Sep 2026 |

`yt-thread-*` cards show the exchange: the comment, then Renée's actual reply with
her handle in YouTube's channel-owner pill. Both halves come from the public thread.
Obvious typos are corrected and long comments trimmed to fit; nothing substantive is
changed and no wording is invented.

Timestamps read as relative ages ("2 weeks ago") anchored to 21 Sep 2026. If the
video is cut much later than that, nudge them in `studio.html`.

## The one number that isn't here

**LinkedIn impressions.** LinkedIn exposes impression analytics only to the account
owner, and this repo has no LinkedIn connection — so there was nothing to read.
`li-impressions` ships as a visibly marked blank template rather than a guess, since
a fabricated figure in a real-looking analytics panel is the one thing these cards
must never carry.

Fill it from **LinkedIn → Me → Posts & Activity → Analytics → Impressions**: open
`studio.html`, pick the card, type the figure, set the range, download.

The LinkedIn follower count (5,093) is real but dates from the May 2026 dashboard
snapshot. Instagram moved 18,400 → 23.4K over the same period, so it is worth
re-checking against her live profile.

## Avatars

Her profile photo host is blocked by this environment's network policy, so avatars
fall back to an initial. `studio.html` takes a headshot through a file picker under
**Renée's photo**; it applies to every card and is remembered in that browser.

## studio.html

Open it in a browser — locally, or via GitHub Pages at `/overlays/studio.html`.

- Edit any figure, name, timestamp, comment or reply
- Switch between light and dark interface
- Download one card, or the whole set in both themes
- Edits persist in the browser; **Reset** restores the verified values

## Re-rendering the batch

```
npm install playwright
node overlays/render.mjs
```

Writes every card, both themes, to `overlays/out/`.
