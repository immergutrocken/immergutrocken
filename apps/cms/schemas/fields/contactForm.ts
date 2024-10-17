import { RiContactsFill } from 'react-icons/ri';
import { defineField, defineType } from 'sanity';

export default defineType({
  type: "object",
  name: "contactForm",
  title: "Kontakt Formular",
  icon: RiContactsFill,
  fields: [
    defineField({
      type: "boolean",
      name: "withTelephone",
      title: "mit Telefon",
    }),
  ],
});
