import type {StructureResolver} from 'sanity/structure'
import {HomeIcon, UserIcon, ImagesIcon, EditIcon, TagIcon} from '@sanity/icons'

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .title('3PPLEM Admin Portal') // The main heading of the sidebar
    .items([
      // 1. Accommodation Management
      S.documentTypeListItem('room')
        .title('Rooms & Suites')
        .icon(HomeIcon),
      
      // 2. Social Proof
      S.documentTypeListItem('guestVoice')
        .title('Guest Voices')
        .icon(UserIcon),

      // 3. Visual Content
      S.documentTypeListItem('gallery')
        .title('Gallery Sets')
        .icon(ImagesIcon),

      S.divider(), // A visual break for clarity

      // 4. Editorial Content
      S.documentTypeListItem('journal')
        .title('The Journal')
        .icon(EditIcon),

      S.documentTypeListItem('category')
        .title('Categories')
        .icon(TagIcon),

      // Filter out everything we've already listed so they don't appear twice
      ...S.documentTypeListItems().filter(
        (item) => 
          item.getId() && 
          !['room', 'guestVoice', 'gallery', 'journal', 'category'].includes(item.getId()!)
      ),
    ])