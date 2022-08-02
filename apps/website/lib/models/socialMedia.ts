interface ISocialMediaElement {
  url: string;
  brandLogo: string;
}

const socialMedia: ISocialMediaElement[] = [
  {
    url: "https://open.spotify.com/user/immergut_festival",
    brandLogo: "spotify",
  },
  {
    url: "https://www.youtube.com/immergutfestival",
    brandLogo: "youtube",
  },
  {
    url: "https://www.facebook.com/immergutrocken",
    brandLogo: "facebook-f",
  },
  {
    url: "https://instagram.com/immergutrocken",
    brandLogo: "instagram",
  },
  {
    url: "https://twitter.com/immergutrocken",
    brandLogo: "twitter",
  },
  {
    url: "https://www.flickr.com/photos/immergutrocken",
    brandLogo: "flickr",
  },
];

export default socialMedia;
