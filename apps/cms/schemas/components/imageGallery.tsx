import { IoMdImages } from "react-icons/io";
import { defineField, PreviewLayoutKey, PreviewProps, useClient } from "sanity";

import imageUrlBuilder from "@sanity/image-url";

import image from "../fields/image";

const Preview = (
  props: PreviewProps<PreviewLayoutKey> & {
    images?: { asset: unknown; _key: string; alt: string }[];
  },
) => {
  const { images, renderDefault } = props;
  const builder = imageUrlBuilder(useClient());

  return (
    <div>
      {renderDefault({ ...props, title: "Bildergalerie" })}
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
              const url = builder.image(image).url();
              return (
                <img
                  src={url}
                  style={{
                    maxWidth: "25%",
                    margin: "10px",
                    maxHeight: "100px",
                  }}
                  key={image._key}
                  alt={image.alt}
                />
              );
            }
          })}
      </div>
    </div>
  );
};

export default defineField({
  type: "object",
  name: "imageGallery",
  title: "Bildergalerie",
  icon: IoMdImages,
  fields: [
    defineField({
      type: "array",
      name: "images",
      title: "Bilder",
      of: [image],
    }),
  ],
  components: {
    preview: Preview,
  },
  preview: {
    select: {
      images: "images",
    },
  },
});
