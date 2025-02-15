import * as fs from "fs";

// @ts-ignore
export const dataDir = fs.realpathSync(`${import.meta.dirname}/../../../data/04-documentation/w`);

export const sleep = (ms: number) =>
  new Promise(res => setTimeout(res, ms));

export const truncate = (file: string) =>
  new Promise(res => fs.truncate(file, 0, res));

export const appendFile = (file: string, content: string) =>
  new Promise(res => fs.appendFile(file, content, res));

export const urlFilter = (anchors: HTMLAnchorElement[], base: string) => {
  const hrefs = [] as string[];
  for (const a of anchors) {
    const url = new URL((a as HTMLAnchorElement).href, base).toString();
    if (url.startsWith(base)) {
      hrefs.push(url);
    }
  }
  return hrefs;
}