import { readFileSync, writeFileSync } from "fs";
import MomentItem from "./interfaces/MomentItem";
import fixRawData from "./utils/fixRawData";
import { renderFile } from "pug";
import QRCode from "qrcode";
import md5 from "md5";

const rawJson = readFileSync("./data/exported_sns.json");

const raw = JSON.parse(rawJson.toString()) as MomentItem[];

(async () => {
  const moments = (await fixRawData(raw)).reverse();
  moments.forEach(moment => {
    const firstLine = moment.content.split("\n")[0];
    if (firstLine.length < 15) {
      moment.title = firstLine.replace(/[：:。；]$/, "");
      moment.content = moment.content.replace(/^.*?\n/, "");
    }
    if (moment.originalPost) {
      QRCode.toFile(
        `./public/${md5(moment.originalPost.url)}.png`,
        moment.originalPost.url
      );
    }
  });
  // const html = renderFile("./template/index.pug", { moments });
  // writeFileSync("./public/index.html", html);
  const mdHtml = renderFile("./template/md.pug", { moments });
  writeFileSync("./public/md.html", mdHtml);
})();
