import {UserIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const guestVoiceType = defineType({
  name: 'guestVoice',
  title: 'Guest Voice',
  type: 'document',
  icon: UserIcon,
  fields: [
    defineField({
      name: 'guestName',
      title: 'Guest Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'role',
      title: 'Guest Role/Designation',
      type: 'string',
      description: 'e.g., Business Traveler, Architect, Fashion Designer',
    }),
    defineField({
      name: 'quote',
      title: 'The Quote',
      type: 'text',
      description: 'The "Jaw-Dropping" feedback they gave.',
      validation: (Rule) => Rule.required().max(200),
    }),
    defineField({
    name: 'email',
    title: 'Guest Email',
    type: 'string',
    readOnly: true,
    hidden: ({ document }) => (document?.rating as number) >= 4,
  }),
  defineField({
    name: 'phone',
    title: 'Guest Phone',
    type: 'string',
    readOnly: true,
    hidden: ({ document }) => (document?.rating as number) >= 4,
  }),
  defineField({
    name: 'status',
    title: 'Status',
    type: 'string',
    initialValue: 'new',
    options: {
      list: [
        { title: 'New', value: 'new' },
        { title: 'Resolved / Contacted', value: 'resolved' },
        { title: 'Archived', value: 'archived' },
      ],
    },
  }),
    defineField({
      name: 'rating',
      title: 'Rating (1-5)',
      type: 'number',
      initialValue: 5,
      validation: (Rule) => Rule.min(1).max(5),
    }),
  ],
  preview: {
    select: {
      title: 'guestName',
      subtitle: 'quote',
    },
  },
})