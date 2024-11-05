import { RiContactsFill } from 'react-icons/ri';
import { defineField } from 'sanity';

export default defineField({
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
