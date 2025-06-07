import { FontFamily } from "@/utils/fonts";
import { TextAlign, writeText } from "@/utils/text";
import { memo } from "react";
import { imageTo1BitBMP } from "@/utils/imageTo1BitBMP";

interface TextProps {
  text: string;
  font: FontFamily;
  width: number;
  align: TextAlign;
  bold?: boolean;
}

export const Text = memo((props: TextProps) => {
  const image = renderTextToImage(props);
  return <img src={image} />;
});

const renderTextToImage = (props: TextProps) => {
  const imageData = new Uint8ClampedArray(props.width * 100);
  imageData.fill(255);
  const font = props.font.font;
  const height = writeText(
    imageData,
    props.bold ? font.bold : font.regular,
    props.font.size,
    1,
    props.text,
    0,
    0,
    props.width,
    props.align,
  );
  const fixedHeight = Math.ceil(1 + (height + 1) / 8) * 8;
  const bmpData = imageTo1BitBMP(imageData, props.width, fixedHeight);
  const base64String = btoa(String.fromCharCode(...new Uint8Array(bmpData)));
  const url = "data:image/bmp;base64," + base64String;
  return url;
};
