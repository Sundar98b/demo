import "react-lazy-load-image-component/src/effects/blur.css";

import React from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";

interface LazyImage {
  alt: string;
  width?: string;
  height?: string;
  src: string;
}
const LazyImage: React.FC<LazyImage> = image => (
  <div>
    <LazyLoadImage
      alt={image.alt}
      className="lazy-img"
      effect="blur"
      height={image.height}
      src={image.src} // use normal <img> attributes as props
      width={image.width}
    />
  </div>
);

export default LazyImage;
