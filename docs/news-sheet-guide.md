# News Google Sheet Guide

This project reads published articles from a Google Sheet so content editors can manage news without touching the code base. Use this guide to set up and maintain the sheet correctly.

## Sheet location & access

- **Default sheet name:** `News` (override with `GOOGLE_NEWS_SHEET`).
- **Default range:** `A1:N400` (override with `GOOGLE_NEWS_RANGE`).
- Share the sheet with the service account configured in `.env.local` so it has at least read access.

If you change the sheet name or the tab range, update the environment variables and redeploy.

## Required columns

Each row represents a single article. Header names are matched case-insensitively (e.g. `Title`, `TITLE`, or `headline` are all accepted). At minimum provide:

| Purpose             | Accepted headers                   | Notes                                                                                                              |
| ------------------- | ---------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| Title               | `Title`, `Headline`, `Name`        | Used as display title and default fallback for slug & image alt text.                                              |
| Slug (URL fragment) | `Slug`, `URL`, `Permalink`         | Optional—auto-generated from title if blank. Must be unique per article.                                           |
| Visibility / Status | `Status`, `Visibility`, `State`    | Accepted values: `Published`, `Draft`, `Archived` (draft & archived hidden from site unless explicitly requested). |
| Featured flag       | `Featured`, `IsFeatured`           | `true/yes/on/1` marks the article as featured on the news page hero slot.                                          |
| Publish date        | `Date`, `PublishDate`, `Published` | ISO format preferred (`YYYY-MM-DD`). Used for sorting and display.                                                 |

## Optional content columns

| Purpose             | Accepted headers                         | Details                                                                            |
| ------------------- | ---------------------------------------- | ---------------------------------------------------------------------------------- |
| Summary/Excerpt     | `Excerpt`, `Summary`, `Description`      | Short teaser text displayed on cards.                                              |
| Author/Byline       | `Author`, `Byline`                       | Optional text shown with the article.                                              |
| Category/Section    | `Category`, `Section`                    | Used for filtering on the news page.                                               |
| Detailed body       | `Content`, `Body`, `Article`             | Future use for full article pages.                                                 |
| Read time (minutes) | `ReadTime`, `Minutes`, `ReadTimeMinutes` | Numeric value; rounded to the nearest minute.                                      |
| Tags                | `Tags`, `Keywords`                       | Comma, semicolon, or newline separated.                                            |
| Sources / Links     | `Sources`, `Links`, `References`         | Comma, semicolon, or newline separated (rendered as references).                   |
| Gallery images      | `Gallery`, `Images`, `ImageList`         | Comma, semicolon, or newline separated list of image URLs (Drive links supported). |

Blank cells are ignored. Tags, sources, and galleries are stored as arrays after splitting on commas, semicolons, or new lines.

## Image handling

| Purpose         | Accepted headers                             | Details                                                                                                              |
| --------------- | -------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| Main image URL  | `Image`, `Thumbnail`, `ImageURL`             | Use a public URL or a Google Drive share link. Drive links are converted automatically.                              |
| Image alt text  | `ImageAlt`, `ImgAlt`, `Alt`                  | If blank, the title is used.                                                                                         |
| Image credit    | `ImageCredit`, `Credit`                      | Optional attribution displayed beneath the image.                                                                    |
| Image placement | `ImagePlacement`, `ImageLayout`, `Placement` | Controls layout of the main image. Accepted values: `top`, `left`, `right`, `background`, `none`. Defaults to `top`. |

### Using Google Drive images

1. Upload the image to Google Drive.
2. Open the share dialog and make the file accessible to "Anyone with the link" (view only).
3. Copy the share URL (`https://drive.google.com/file/d/.../view?usp=sharing`).
4. Paste the link into the main image or gallery column. The system extracts the file ID and converts it to a direct image URL.

## Featured & homepage behavior

- Articles marked as `Featured` appear in the large hero slot on `/news` if they are the most recent featured item.
- The home page shows up to six of the latest published articles. If fewer items are available, it falls back to static content defined in the code.

## Drafts & archival

- Rows marked `Draft` or `Archived` in the visibility column are ignored by default. To preview them locally, set `includeDrafts: true` when calling `fetchNewsArticles` or modify the page component temporarily.
- Remove old rows or mark them `Archived` to keep the sheet tidy without losing history.

## Troubleshooting checklist

- **Nothing shows up:** Confirm the service account can access the sheet and that visibility is `Published`.
- **Images not loading:** Ensure the Drive link is public and that the ID is valid (no typos). You can paste the generated `https://lh3.googleusercontent.com/d/<id>` into a browser to test.
- **Wrong order:** Articles are sorted by `PublishedAt` (or `Date` if `PublishedAt` is empty). Make sure the most recent dates are correct.
- **Filtering issues:** Categories and tags are case-sensitive in the UI. Keep naming consistent (e.g., "Gameday" vs. "Game Day").

Keep this document close to the sheet so editors always have the latest instructions.
