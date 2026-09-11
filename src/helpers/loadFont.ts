import fs from "fs";
import path from "path";

const FONT_REGULAR = fs
  .readFileSync(path.join(process.cwd(), "public/font/Roboto-Regular.ttf"))
  .toString("base64");

const FONT_BOLD = fs
  .readFileSync(path.join(process.cwd(), "public/font/Roboto-Bold.ttf"))
  .toString("base64");

export const getFontBase64 = () => FONT_REGULAR;
export const getFontBoldBase64 = () => FONT_BOLD;

const IMAGE_CACHE = new Map<string, Uint8Array>();

export function getImage(fileName: string) {
  if (IMAGE_CACHE.has(fileName)) {
    return IMAGE_CACHE.get(fileName)!;
  }

  const buffer = fs.readFileSync(path.join(process.cwd(), "public", fileName));

  const image = new Uint8Array(buffer);

  IMAGE_CACHE.set(fileName, image);

  return image;
}
