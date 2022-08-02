import Tabs from "sanity-plugin-tabs";
import supportedLanguages from "../../config/supportedLanguages";

const buildFields = (fields) => {
  const languagedFields = [];
  supportedLanguages.forEach((lang) => {
    const langObject = {
      type: "object",
      name: lang.id,
      title: lang.title,
      fieldset: lang.id + "-tab",
      fields: fields,
    };
    languagedFields.push(langObject);
  });
  return languagedFields;
};

export default (fields) => ({
  name: "languages",
  type: "object",
  inputComponent: Tabs,
  fieldsets: supportedLanguages.map((lang) => ({
    name: lang.id + "-tab",
    title: lang.title,
  })),
  fields: buildFields(fields),
});
