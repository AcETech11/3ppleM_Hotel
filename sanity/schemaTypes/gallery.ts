import {ImageIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const galleryType = defineType({
  name: 'gallery',
  title: 'Gallery Items',
  type: 'document',
  icon: ImageIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Image Title',
      type: 'string',
      description: 'Internal name or title for the image (e.g., Executive Suite Morning)',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
        name: 'category',
        title: 'Category',
        type: 'reference',
        to: [{type: 'category'}],
        description: 'Which section of the hotel does this belong to?',
        validation: (Rule) => Rule.required(),
        }),
    defineField({
      name: 'image',
      title: 'Main Image',
      type: 'image',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          type: 'string',
          title: 'Alt Text',
          description: 'Crucial for SEO (Osapa London Keywords).',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'caption',
          type: 'string',
          title: 'Caption',
          description: 'The elegant description guests see on the site.',
        }),
      ],
      validation: (Rule) => Rule.required(),
    }),
  ],
 preview: {
    select: {
      title: 'title',
      categoryTitle: 'category.title', // Follow the reference to get the actual name
      media: 'image',
    },
    prepare(selection) {
      const {title, categoryTitle, media} = selection
      return {
        title: title,
        subtitle: categoryTitle ? `Category: ${categoryTitle}` : 'No Category',
        media: media,
      }
    },
  },
})
