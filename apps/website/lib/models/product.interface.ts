export interface IProduct {
  title: string;
  category: string;
  description: [];
  images: {
    asset: unknown;
    hotspot: { x: number; y: number };
    url: string;
    urlBlur: string;
    urlPreview: string;
    urlPreviewBlur: string;
  }[];
}
