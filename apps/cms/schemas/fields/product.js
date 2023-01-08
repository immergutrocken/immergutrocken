import localizedTabs from "../documents/localizedTabs"
import blockContent from "./blockContent"
import { getImage } from "./image"

const localizedFields = [
    {
        title: 'Titel',
        type: 'string',
        name: 'title',
        validation: (Rule) => Rule.required(),
    },
    {
        ...blockContent,
        title: "Beschreibung",
        name: "description",
        validation: (Rule) => Rule.required(),
    },
    {
        title: 'Kategorie',
        type: 'string',
        name: 'category',
        validation: (Rule) => Rule.required(),
    },
]


export default {
    title: 'Produkt',
    type: 'object',
    name: 'product',
    preview: {
        select: {
            title: 'languages.de.title',
            media: 'images.0'
        }
    },
    fields: [
        localizedTabs(localizedFields),
        {
            type: 'array',
            name: 'images',
            title: 'Bilder',
            description: 'Das oberste Bild wird automatisch als Anzeigebild für das Produkt auf der "Merch"-Seite genutzt',
            of: [getImage(false)],
            validation: (Rule) => Rule.required()
        }
    ]
}