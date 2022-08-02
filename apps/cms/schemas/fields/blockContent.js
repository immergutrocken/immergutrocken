import React from "react";
import image from "../fields/image";
import youtube from "../components/youtube";
import {
  FaHighlighter,
  FaAlignLeft,
  FaAlignRight,
  FaAlignCenter,
  FaAlignJustify,
} from "react-icons/fa";
import imageGallery from "../components/imageGallery";
import link from "../fields/link";
import externalLink from "../fields/externalLink";
import { withCTA } from "../fields/fieldExtender";
import internalLink from "../fields/internalLink";

const highlightRender = (props) => (
  <span style={{ backgroundColor: "yellow" }}>{props.children}</span>
);

const alignRender = (align) => (props) =>
  (
    <div
      class="test"
      style={{
        textAlign: align,
      }}
    >
      {props.children}
    </div>
  );

const colorRender = (color) => (props) =>
  <span style={{ color: color }}>{props.children}</span>;

export default {
  title: "Inhalt",
  name: "content",
  type: "array",
  of: [
    {
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
            blockEditor: {
              icon: FaHighlighter,
              render: highlightRender,
            },
          },
          {
            title: "Align left",
            value: "align-left",
            blockEditor: {
              icon: FaAlignLeft,
              render: alignRender("left"),
            },
          },
          {
            title: "Align center",
            value: "align-center",
            blockEditor: {
              icon: FaAlignCenter,
              render: alignRender("center"),
            },
          },
          {
            title: "Align right",
            value: "align-right",
            blockEditor: {
              icon: FaAlignRight,
              render: alignRender("right"),
            },
          },
          {
            title: "Align justify",
            value: "align-justify",
            blockEditor: {
              icon: FaAlignJustify,
              render: alignRender("justify"),
            },
          },
          {
            title: "Primary Color",
            value: "color-primary",
            blockEditor: {
              icon: () => "CP",
              render: colorRender("red"),
            },
          },
          {
            title: "Secondary Color",
            value: "color-secondary",
            blockEditor: {
              icon: () => "CS",
              render: colorRender("green"),
            },
          },
          {
            title: "Tertiary Color",
            value: "color-tertiary",
            blockEditor: {
              icon: () => "CT",
              render: colorRender("blue"),
            },
          },
        ],
        annotations: [
          withCTA(externalLink),
          withCTA(internalLink("article", "artist")),
        ],
      },
    },
    youtube,
    {
      ...image,
      title: "Bild",
      fields: [...image.fields, link(["article"])],
    },
    imageGallery,
  ],
};
