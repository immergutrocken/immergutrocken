import {
    FaAlignCenter, FaAlignJustify, FaAlignLeft, FaAlignRight, FaHighlighter
} from 'react-icons/fa';
import { defineArrayMember, defineField } from 'sanity';

import imageGallery from '../components/imageGallery';
import youtube from '../components/youtube';
import externalLink from './externalLink';
import { withCTA } from './fieldExtender';
import image from './image';
import internalLink from './internalLink';
import link from './link';

const HighlightRender = (props: { children: JSX.Element }): JSX.Element => (
  <span style={{ backgroundColor: "yellow" }}>{props.children}</span>
);

const AlignRender =
  (
    align:
      | "start"
      | "end"
      | "left"
      | "right"
      | "center"
      | "justify"
      | "match-parent"
  ) =>
  (props: { children: JSX.Element }) => (
    <div
      style={{
        textAlign: align,
      }}
    >
      {props.children}
    </div>
  );

const ColorRender = (color: string) => (props: { children: JSX.Element }) => (
  <span style={{ color: color }}>{props.children}</span>
);

export default defineField({
  title: "Inhalt",
  name: "content",
  type: "array",
  of: [
    defineArrayMember({
      type: "block",
      styles: [
        { title: "Normal", value: "normal" },
        { title: "H1", value: "h1" },
        { title: "H2", value: "h2" },
        { title: "Quote", value: "blockquote" },
      ],
      marks: {
        decorators: [
          { title: "Strong", value: "strong" },
          { title: "Emphasis", value: "em" },
          { title: "Code", value: "code" },
          { title: "Underline", value: "underline" },
          { title: "Strike", value: "strike-through" },
          {
            title: "Highlight",
            value: "highlight",
            icon: FaHighlighter,
            component: HighlightRender,
          },
          {
            title: "Align left",
            value: "align-left",
            icon: FaAlignLeft,
            component: AlignRender("left"),
          },
          {
            title: "Align center",
            value: "align-center",
            icon: FaAlignCenter,
            component: AlignRender("center"),
          },
          {
            title: "Align right",
            value: "align-right",
            icon: FaAlignRight,
            component: AlignRender("right"),
          },
          {
            title: "Align justify",
            value: "align-justify",
            icon: FaAlignJustify,
            component: AlignRender("justify"),
          },
          {
            title: "Primary Color",
            value: "color-primary",
            icon: () => "CP",
            component: ColorRender("red"),
          },
          {
            title: "Secondary Color",
            value: "color-secondary",
            icon: () => "CS",
            component: ColorRender("green"),
          },
          {
            title: "Tertiary Color",
            value: "color-tertiary",
            icon: () => "CT",
            component: ColorRender("blue"),
          },
        ],
        annotations: [
          withCTA(externalLink),
          withCTA(internalLink("article", "artist")),
        ],
      },
    }),
    youtube,
    defineArrayMember({
      ...image,
      title: "Bild",
      fields: [...(image.fields ?? []), link(["article"])],
    }),
    imageGallery,
  ],
});
