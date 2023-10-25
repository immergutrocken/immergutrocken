import supportedLanguages from "../../supportedLanguages";

export default (title, name) => ({
  title: title,
  name: name,
  type: "object",
  fields: supportedLanguages.map((lang) => ({
    title: lang.title,
    name: lang.id,
    type: "string",
  })),
});
