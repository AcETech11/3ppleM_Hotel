import {HomeIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

export const roomType = defineType({
  name: 'room',
  title: 'Hotel Rooms',
  type: 'document',
  icon: HomeIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Room Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: {
        source: 'title',
      },
      validation: (Rule) => Rule.required(),
    }),
    // ADDED: Availability toggle for the "Mute" function
    defineField({
      name: 'isAvailable',
      title: 'Room Availability',
      type: 'boolean',
      initialValue: true,
      description: 'Turn off to "Mute" this room from the website without deleting it.',
    }),
    defineField({
      name: 'price',
      title: 'Price per Night (₦)',
      type: 'number',
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: 'tags',
      title: 'Quick Tags',
      type: 'array',
      of: [defineArrayMember({type: 'string'})],
      options: {
        layout: 'tags',
      },
      description: 'e.g., WiFi, King Bed, City View',
    }),
    defineField({
      name: 'gallery',
      title: 'Room Gallery',
      type: 'array',
      description: 'Please upload at least 5 high-quality photos.',
      of: [
        defineArrayMember({
          type: 'image',
          options: {hotspot: true},
          fields: [
            defineField({
              name: 'alt',
              type: 'string',
              title: 'Alternative text',
            }),
          ],
        }),
      ],
      validation: (Rule) => Rule.required().min(5),
    }),
    defineField({
      name: 'videoTour',
      title: 'Room Video Tour',
      type: 'file',
      options: {
        accept: 'video/*',
      },
      description: 'Upload a cinematic 1-minute walk-through (MP4/MOV).',
    }),
    defineField({
      name: 'details',
      title: 'Room Description',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'block', 
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      price: 'price',
      isAvailable: 'isAvailable',
      media: 'gallery.0', 
    },
    prepare(selection) {
      const {price, isAvailable} = selection
      const status = isAvailable === false ? ' [MUTED]' : ''
      return {
        ...selection, 
        title: `${selection.title}${status}`,
        subtitle: price ? `₦${price.toLocaleString()} per night` : 'No price set'
      }
    },
  },
})