import { type FontPair, Fonts } from "bdf-fonts";

export interface FontFamily {
  name: string;
  size: number;
  font: FontPair;
}

export const fontFamilies = new Map<string, FontFamily>(
  Object.entries(Fonts).flatMap(([name, fonts]) =>
    Object.entries(fonts).map(([size, font]) => [
      `${name} (${size})`,
      { name, size: +size, font },
    ])
  )
);
