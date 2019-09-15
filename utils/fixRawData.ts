import { parseString } from "xml2js";
import moment from "moment";
import MomentItem from "../interfaces/MomentItem";

export default (raw: MomentItem[]) => {
  return Promise.all(
    raw.map(async m => {
      const momentRaw = (await new Promise((resolve, reject) => {
        parseString(m.rawXML, (err, data) =>
          err ? reject(err) : resolve(data.TimelineObject)
        );
      })) as any;
      delete m.rawXML;
      //   console.log(m.content);
      //   console.log(moment(m.timestamp * 1000).format("YYYY-MM-DD HH:mm:ss"));
      //   console.log();
      if (momentRaw.ContentObject[0].contentUrl[0]) {
        m.originalPost = {
          title: momentRaw.ContentObject[0].title[0],
          description: momentRaw.ContentObject[0].description[0],
          url: momentRaw.ContentObject[0].contentUrl[0],
          thumbnail:
            momentRaw.ContentObject[0].mediaList &&
            momentRaw.ContentObject[0].mediaList[0].media[0].url[0]._
        };
        delete m.mediaList;
      }
      m.date = moment(m.timestamp * 1000).format("YYYY-MM-DD HH:mm:ss");
      if (m.mediaList) {
        m.mediaList = m.mediaList.map(media => {
          const match = media.match(/.*\/(.*)\/.*?$/);
          if (!match) {
            throw new Error(`No hash matched for ${media}.`);
          }
          const hash = match[1];
          const url = `https://cdn.uice.lu/bianzhou/photos/${hash}.jpg`;
          return url;
        });
      }
      return m;
    })
  );
};
