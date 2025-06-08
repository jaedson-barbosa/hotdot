/**
 * Convert RGBA image data (number[]) to a 1-bit BMP (Base64 string)
 * @param {number[]} imageData RGBA data from canvas.getImageData().data
 * @param {number} width
 * @param {number} height
 * @returns {string} .bmp file as Base64 string
 */
export function imageDataToBMP(imageData, width, height) {
  const fixedHeight = Math.ceil(1 + (height + 1) / 8) * 8;
  const bmpData = imageTo1BitBMP(imageData, width, fixedHeight);
  const base64String = btoa(String.fromCharCode(...new Uint8Array(bmpData)));
  const url = "data:image/bmp;base64," + base64String;
  return url;
}

/**
 * Convert RGBA image data (number[]) to a 1-bit BMP (ArrayBuffer)
 * @param {number[]} imageData
 * @param {number} width
 * @param {number} height
 * @returns {ArrayBuffer} .BMP file as ArrayBuffer
 */
function imageTo1BitBMP(imageData, width, height) {
  // BMP header sizes
  var FILE_HEADER_SIZE = 14;
  var INFO_HEADER_SIZE = 40;
  var PALETTE_SIZE = 8; // 2 colors, each 4 bytes

  // Rows must be padded to 4-byte multiples
  var rowSize = Math.floor((width + 31) / 32) * 4;
  var pixelArraySize = rowSize * height;
  var fileSize =
    FILE_HEADER_SIZE + INFO_HEADER_SIZE + PALETTE_SIZE + pixelArraySize;

  var buffer = new ArrayBuffer(fileSize);
  var dv = new DataView(buffer);

  // ---- BMP FILE HEADER ----
  dv.setUint8(0, 0x42); // 'B'
  dv.setUint8(1, 0x4d); // 'M'
  dv.setUint32(2, fileSize, true); // File size
  dv.setUint16(6, 0, true); // Reserved
  dv.setUint16(8, 0, true); // Reserved
  dv.setUint32(10, FILE_HEADER_SIZE + INFO_HEADER_SIZE + PALETTE_SIZE, true); // Pixel data offset

  // ---- DIB INFO HEADER (BITMAPINFOHEADER 40 bytes) ----
  dv.setUint32(14, INFO_HEADER_SIZE, true); // Header size
  dv.setInt32(18, width, true); // width
  dv.setInt32(22, height, true); // height (positive = bottom-up)
  dv.setUint16(26, 1, true); // Color planes
  dv.setUint16(28, 1, true); // Bits per pixel
  dv.setUint32(30, 0, true); // Compression (none)
  dv.setUint32(34, pixelArraySize, true); // Image size
  dv.setInt32(38, 2835, true); // Horiz. resolution (~72 DPI)
  dv.setInt32(42, 2835, true); // Vert. resolution
  dv.setUint32(46, 2, true); // Colors in palette
  dv.setUint32(50, 0, true); // Important colors

  // ---- PALETTE -- Black, White (B, G, R, reserved) ----
  var paletteOffset = FILE_HEADER_SIZE + INFO_HEADER_SIZE;
  // black
  dv.setUint32(paletteOffset + 0, 0x00000000, true);
  // white
  dv.setUint32(paletteOffset + 4, 0x00ffffff, true);

  // ---- PIXEL DATA (bottom up, left-to-right, 1bpp, padded) ----
  // Each pixel row starts at: pixelDataOffset + ((height - 1 - y) * rowSize)
  var pixelDataOffset = FILE_HEADER_SIZE + INFO_HEADER_SIZE + PALETTE_SIZE;
  for (var y = 0; y < height; y++) {
    var bmpRow = height - 1 - y; // BMPs store rows bottom-to-top
    var byteOffset = pixelDataOffset + bmpRow * rowSize;
    var bitPos = 7,
      curByte = 0;

    for (var x = 0; x < width; x++) {
      // Read RGBA for 1 pixel
      var i = (y * width + x) * 4;
      var r = imageData[i] ?? 255,
        g = imageData[i + 1] ?? 255,
        b = imageData[i + 2] ?? 255,
        a = imageData[i + 3] ?? 255;

      // Luminance threshold (>=128 is white, else black)
      var luminance = 0.299 * r + 0.587 * g + 0.114 * b;
      var bw = luminance >= 128 ? 1 : 0;
      curByte |= bw << bitPos;

      if (bitPos === 0 || x === width - 1) {
        // Write out (partial final byte ok)
        dv.setUint8(byteOffset++, curByte);
        curByte = 0;
        bitPos = 7;
      } else {
        bitPos--;
      }
    }
    // Padding is automatic: pixel row always rowSize bytes
  }

  return buffer;
}
