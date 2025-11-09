import * as cheerio from "cheerio";

const NORSK_TIPPING_URL =
  "https://www.norsk-tipping.no/grasrotandelen/din-mottaker/iframe/887798052";

export interface NorskTippingCardResult {
  srcDoc: string;
}

export async function fetchNorskTippingCard(): Promise<NorskTippingCardResult | null> {
  try {
    const response = await fetch(NORSK_TIPPING_URL, {
      // Revalidate every 6 hours – the statistics don't change frequently.
      next: { revalidate: 60 * 60 * 6 },
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
      },
    });

    if (!response.ok) {
      return null;
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    const card = $('[data-ntds-name="Card"]').first();
    if (!card.length) {
      return null;
    }

    card.find("script").remove();

    const styles: string[] = [];
    $("style").each((_, element) => {
      const block = $(element).html();
      if (block?.trim()) {
        styles.push(block);
      }
    });

    const stylesheetLinks: string[] = [];
    $("link[rel='stylesheet']").each((_, element) => {
      const href = $(element).attr("href");
      if (href) {
        const absoluteHref = href.startsWith("http")
          ? href
          : new URL(href, NORSK_TIPPING_URL).toString();
        stylesheetLinks.push(absoluteHref);
      }
    });

    const srcDoc = `<!DOCTYPE html>
<html lang="nb">
  <head>
    <meta charset="utf-8" />
    <base href="https://www.norsk-tipping.no/" />
    ${stylesheetLinks
      .map((href) => `<link rel="stylesheet" href="${href}" />`)
      .join("\n")}
    <style>
      html, body {
        margin: 0;
        padding: 0;
        background: transparent;
      }
    </style>
    ${styles.length ? `<style>${styles.join("\n")}</style>` : ""}
  </head>
  <body>
    ${card.toString()}
  </body>
</html>`;

    return { srcDoc };
  } catch (error) {
    console.error("Failed to fetch Norsk Tipping card", error);
    return null;
  }
}
