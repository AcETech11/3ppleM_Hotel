import { type SchemaTypeDefinition } from 'sanity'

import { blockContentType } from './blockContentType'
import { categoryType } from './category'
import { roomType } from './room'
import { galleryType } from './gallery'
import { guestVoiceType } from './guestVoice'
import { journalType } from './journal'
import { staffSchema } from './staff'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    blockContentType, 
    categoryType, 
    roomType, 
    galleryType, 
    guestVoiceType, 
    journalType, 
    staffSchema
  ],
}