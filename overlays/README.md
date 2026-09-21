# Renée Marino — Video Stat Overlays

Transparent-PNG stat cards and comment cards, sized for video, built from her real
numbers so they can be dropped straight onto a timeline.

## What's in `out/`

Every card renders at two sizes, with a fully transparent background:

- `*-vertical.png` — 1080 × 1920 (Reels, Shorts, TikTok). Card sits in the middle
  third; the top 240px and bottom 470px are left clear of platform UI chrome.
- `*-horizontal.png` — 1920 × 1080 (YouTube long-form). Card sits lower-left.

Drop the PNG on a track above the footage. No keying, no masking — the alpha is
already cut.

## Where every number comes from

| Card | Figure | Source | As of |
|---|---|---|---|
| `peak-views` | 3,077,079 views | YouTube, video `0RVqSBisvHU` | 21 Sep 2026 |
| `peak-likes` | 184,671 likes | YouTube, video `0RVqSBisvHU` | 21 Sep 2026 |
| `peak-comments` | 11,042 comments | YouTube, video `0RVqSBisvHU` | 21 Sep 2026 |
| `yt-lifetime` | 3,239,159 views | YouTube channel `UCsSkET6muRFdrKhnW2yyr7g` | 21 Sep 2026 |
| `yt-subs` | 15,200 subscribers | YouTube channel | 21 Sep 2026 |
| `ig-followers` | 23.4K followers | Instagram `@iamreneemarino` | 21 Sep 2026 |
| `li-followers` | 5,093 followers | Dashboard `index.html` | May 2026 |
| `li-impressions` | *blank template* | **not sourced — see below** | — |
| `audience-rank` | 5-platform stack | mixed, per row | per row |
| `comment-*` | verbatim | YouTube public comments | date on card |
| `thread-*` | verbatim, both sides | YouTube public threads | date on card |

**Comment cards** (`comment-*`) show one audience comment, with the commenter's real
handle.

**Reply cards** (`thread-*`) show the exchange: the comment, then Renée's actual reply
beneath it, marked `CREATOR`. Both halves are taken from the public thread.

On both, obvious typos are corrected and long comments trimmed to fit the frame.
Nothing substantive is changed and no wording is invented — if a line is on a card,
someone really wrote it.

Her replies use an “R” monogram by default. To use her headshot instead, open
`studio.html`, pick any `thread-*` card, and choose a file under **Renée's photo**;
it applies to every reply card and is remembered in that browser.

## The one number that isn't here

**LinkedIn impressions.** LinkedIn only exposes post and follower analytics to the
account owner, and this repo has no LinkedIn connection — so there was nothing to
read. `li-impressions` ships as a clearly-marked blank template rather than a guess.

The LinkedIn follower count (5,093) is real but dates from the May 2026 dashboard
snapshot, so it is labelled with that date on the card.

To fill either one: open `studio.html`, pick the card, type the figure from
**LinkedIn → Me → Posts & Activity → Analytics → Impressions**, and download.

## studio.html

Open it in a browser — locally, or via GitHub Pages at `/overlays/studio.html`.

- Edit any card's figures, labels, comment text and replies
- Drop in Renée's headshot for the reply cards
- Toggle vertical / horizontal
- Download a single card, or the whole set, as transparent PNGs
- Edits persist in the browser; **Reset** restores the verified values

## Re-rendering the batch

```
npm install playwright
node overlays/render.mjs
```

Writes every card, both formats, to `overlays/out/`.
