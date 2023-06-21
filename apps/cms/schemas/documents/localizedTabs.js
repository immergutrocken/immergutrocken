import supportedLanguages from "../../supportedLanguages";

const buildFields = (fields) => {
  const languagedFields = [];
  supportedLanguages.forEach((lang) => {
    const langObject = {
      type: "object",
      name: lang.id,
      title: lang.title,
      fields: fields,
      group: lang.id,
    };
    languagedFields.push(langObject);
  });
  return languagedFields;
};

export default (fields) => ({
  name: "languages",
  title: " ",
  type: "object",
  groups: supportedLanguages.map((lang) => ({
    name: lang.id,
    title: lang.title,
  })),
  fields: buildFields(fields),
});
