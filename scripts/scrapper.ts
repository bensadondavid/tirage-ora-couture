const { chromium } = require("playwright");
const readline = require("readline");
const fs = require("fs");

const POST_URL = "https://www.instagram.com/p/DYVGNOkqrIx/";

function waitForEnter(msg) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl.question(msg, () => {
      rl.close();
      resolve();
    });
  });
}

async function main() {
  const browser = await chromium.launch({ headless: false });

  const context = await browser
    .newContext({ storageState: "instagram-session.json" })
    .catch(() => browser.newContext());

  const page = await context.newPage();

  await page.goto(POST_URL, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(3000);

  console.log("Charge manuellement tous les commentaires dans la fenêtre.");
  await waitForEnter("Quand tu as fini, appuie sur Entrée ici : ");

  const authors = await page.evaluate(() => {
    const links = [...document.querySelectorAll("a[href]")].map((a) => ({
      text: a.innerText?.trim() || "",
      href: a.getAttribute("href") || "",
    }));

    const results = [];
    const seen = new Set();

    const isProfile = (x) => {
      if (!x.text || !x.href) return false;
      if (x.text.startsWith("@")) return false;

      const parts = x.href.split("?")[0].split("/").filter(Boolean);

      return (
        parts.length === 1 &&
        x.text === parts[0] &&
        /^[a-zA-Z0-9._]{1,30}$/.test(x.text)
      );
    };

    for (let i = 0; i < links.length; i++) {
      if (!links[i].href.includes("/c/")) continue;

      for (let j = i - 1; j >= Math.max(0, i - 30); j--) {
        if (isProfile(links[j])) {
          if (!seen.has(links[i].href)) {
            seen.add(links[i].href);
            results.push(links[j].text);
          }

          break;
        }
      }
    }

    return results;
  });

  fs.writeFileSync("names.json", JSON.stringify(authors, null, 2));

  console.log("\n===== AUTEURS =====\n");
  console.log(authors.join("\n"));
  console.log("\nTotal:", authors.length);
  console.log("\nFichier créé : names.json");

  await browser.close();
}

main().catch(console.error);