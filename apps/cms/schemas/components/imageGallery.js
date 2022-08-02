import React from "react";
import image from "../fields/image";
import sanityClient from "part:@sanity/base/client";
import imageUrlBuilder from "@sanity/image-url";
import { IoMdImages } from "react-icons/io";

const builder = imageUrlBuilder(sanityClient);

function urlFor(source) {
  return builder.image(source);
}

const Preview = ({ value }) => {
  const { images } = value;
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        overflowX: "auto",
        alignItems: "center",
        padding: "10px",
      }}
    >
      {images &&
        images.map((image) => {
          if (image.asset != null) {
            const url = urlFor(image).url();
            return (
              <img
                src={url}
                style={{ maxWidth: "25%", margin: "10px", maxHeight: "100px" }}
                key={url}
              />
            );
          }
        })}
    </div>
  );
};

export default {
  type: "object",
  name: "imageGallery",
  title: "Bildergalerie",
  icon: IoMdImages,
  fields: [
    {
      type: "array",
      name: "images",
      title: "Bilder",
      of: [image],
    },
  ],
  preview: {
    select: {
      images: "images",
    },
    component: Preview,
  },
};
