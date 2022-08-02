import groq from "groq";
import { NotificationDisplayCategory } from "./enums/notificationDisplayCategory";
import sanityClient from "./shared/sanityClient";

export interface INotification {
  title: string;
  content: [];
  display: NotificationDisplayCategory;
  startDate: Date;
  endDate: Date;
}

export const getNotificationList = async (
  locale: string
): Promise<INotification[]> => {
  const query = groq`*[_type == "notification"]{
    "titleDe": languages.de.title,
    "titleEn": languages.en.title,
    startDate,
    endDate,
    "display": displayCategory,
    "contentDe": languages.de.content[]{..., asset->{..., "_key": _id}, markDefs[]{
      ...,
      _type == "internalLink" => {
        "docType": @.reference->_type,
        "slug": @.reference->slug.current
      },
    }},
    "contentEn": languages.en.content[]{..., asset->{..., "_key": _id}, markDefs[]{
      ...,
      _type == "internalLink" => {
        "docType": @.reference->_type,
        "slug": @.reference->slug.current
      }
    },
    }}`;
  const result = await sanityClient.fetch(query);
  return result.map((item) => ({
    title: locale === "en" && item.titleEn ? item.titleEn : item.titleDe,
    startDate: item.startDate,
    endDate: item.endDate,
    display: item.display,
    content:
      locale === "en" && item.contentEn ? item.contentEn : item.contentDe,
  }));
};
