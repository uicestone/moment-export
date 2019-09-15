import { readFileSync, writeFileSync } from "fs";
import MomentItem from "./interfaces/MomentItem";
import fixRawData from "./utils/fixRawData";
import { renderFile } from "pug";
import QRCode from "qrcode";
import { createHash } from "crypto";

const rawJson = readFileSync("./data/exported_sns.json");

const raw = JSON.parse(rawJson.toString()) as MomentItem[];

(async () => {
  const moments = (await fixRawData(raw)).reverse();
  const shortenUrls: { [shorten: string]: string } = {};
  moments.forEach(moment => {
    const firstLine = moment.content.split("\n")[0];
    if (firstLine.length < 15) {
      moment.title = firstLine.replace(/[：:。；]$/, "");
      moment.content = moment.content.replace(/^.*?\n/, "");
    }
    if (moment.originalPost) {
      const hash = createHash("md5")
        .update(moment.originalPost.url)
        .digest("base64")
        .replace(/[\/\+]/, "")
        .substr(0, 4);
      QRCode.toFile(
        `./public/qrcodes/${hash}.png`,
        // moment.originalPost.url
        "https://uice.lu/r?" + hash,
        { margin: 0, errorCorrectionLevel: "M" }
      );
      shortenUrls[hash] = moment.originalPost.url;
    }
  });
  writeFileSync("./data/shorten_urls.json", JSON.stringify(shortenUrls));
  // const html = renderFile("./template/index.pug", { moments });
  // writeFileSync("./public/index.html", html);
  const mdHtml = renderFile("./template/md.pug", { moments });
  writeFileSync("./public/md.html", mdHtml);
})();
