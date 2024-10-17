import { defineField } from 'sanity';

import supportedLanguages from '../../supportedLanguages';

export default (title: string, name: string) =>
  defineField({
    title: title,
    name: name,
    type: "object",
    fields: supportedLanguages.map((lang) =>
      defineField({
        title: lang.title,
        name: lang.id,
        type: "string",
      })
    ),
  });
