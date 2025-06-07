import type { Font } from "bdf-fonts";

export type TextAlign = "left" | "center" | "right";

export function writeText(
  imageData: Uint8ClampedArray,
  font: Font,
  lineHeight: number,
  scale: 1 | 2,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  align: "left" | "center" | "right"
) {
  /** @param {number} code */
  function getGlyph(code: number) {
    if (code === 160) code = 32; // Non-breaking space to simple space
    if (code >= 127) code -= 66; // 32 + 161 - 127
    else code -= 32;
    if (code < 0) code = 32;
    const g = font[code];
    return g;
  }

  function fillRect(x: number, y: number, width: number, height: number) {
    for (let k = 0; k < 4; k++) {
      imageData[(y * maxWidth + x) * 4 + k] = 0;
    }
    // for (let i = 0; i < width; i++) {
    //   const row = (y + i) * maxWidth;
    //   for (let j = 0; j < height; j++) {
    //     const index = (row + x + j) * 4;
    //     for (let k = 0; k < 4; k++) {
    //       imageData[index + k] = 255;
    //     }
    //   }
    // }
  }

  /**
   *
   * @param {number} c
   * @param {number} bx
   * @param {number} by
   * @returns {number}
   */
  function drawChar(c: number, bx: number, by: number): number {
    const g = getGlyph(c);
    const b = g["BITMAP"];
    const ox = bx + g["BBox"] * scale - 1;
    const oy = by - g["BBoy"] * scale - g["BBh"] * scale + 1;
    for (let y = 0, len = b.length; y < len; y++) {
      const l = b[y];
      for (let i = g.BITS, x = 0; i >= 0; i--, x++) {
        if (((l >> i) & 0x01) == 1) {
          fillRect(ox + x * scale, oy + y * scale, scale, scale);
        }
      }
    }
    return bx + g["DWIDTH"] * scale;
  }

  /**
   *
   * @param {string} text
   * @param {number} x
   * @param {number} y
   */
  function writeLine(text: string, x: number, y: number) {
    for (let i = 0, len = text.length; i < len; i++) {
      const c = text[i].charCodeAt(0);
      x = drawChar(c, x, y);
    }
  }

  /**
   *
   * @param {string} text
   * @returns {number}
   */
  function measureText(text: string): number {
    let width = 0;
    for (let i = 0, len = text.length; i < len; i++) {
      const c = text[i].charCodeAt(0);
      const g = getGlyph(c);
      width += g["DWIDTH"] * scale;
    }
    return width;
  }

  // Alocate space for the first line
  y += lineHeight * scale;

  // Remove all non-ASCII characters.
  text = text.replace(/[^\x00-\xFF]/g, "");

  const words = text.split(" ");
  let line = "";
  let lineWidth = 0;
  function getX() {
    if (align == "left") return x;
    else {
      let freeSpace = maxWidth - lineWidth;
      if (align == "right") return x + freeSpace;
      else return x + Math.floor(freeSpace / 2);
    }
  }
  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + " ";
    const testLineWidth = measureText(testLine);
    if (testLineWidth > maxWidth && n > 0) {
      writeLine(line, getX(), y);
      line = words[n] + " ";
      y += lineHeight * scale;
    } else line = testLine;
    lineWidth = testLineWidth;
  }
  lineWidth = measureText(line);
  writeLine(line, getX(), y);
  return y;
}
