// next/image needs the Next.js server (/_next/image) to resolve src, which
// doesn't exist outside the site. The design-sync bundle swaps it for a plain
// <img> that keeps the same layout contract (`fill` = absolutely fills its
// positioned parent), the same way Storybook's Next.js framework mocks it.
import { forwardRef, type ImgHTMLAttributes } from "react";

type ImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, "src"> & {
  src: string | { src: string };
  fill?: boolean;
  priority?: boolean;
  quality?: number | string;
  placeholder?: string;
  blurDataURL?: string;
  unoptimized?: boolean;
  loader?: unknown;
};

const Image = forwardRef<HTMLImageElement, ImageProps>(function Image(
  { src, fill, priority, quality, placeholder, blurDataURL, unoptimized, loader, style, loading, ...rest },
  ref
) {
  const url = typeof src === "string" ? src : src.src;
  const fillStyle = fill
    ? { position: "absolute" as const, inset: 0, width: "100%", height: "100%" }
    : undefined;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      ref={ref}
      src={url}
      loading={priority ? "eager" : loading ?? "lazy"}
      decoding="async"
      style={{ ...fillStyle, ...style }}
      {...rest}
    />
  );
});

export default Image;
