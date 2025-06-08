import { renderTextToImage, TextProps } from "@/utils/text";
import { memo } from "react";

export const Text = memo((props: TextProps) => {
  const image = renderTextToImage(props);
  return <img src={image} className="w-full" />;
});
