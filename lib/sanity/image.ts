import imageUrlBuilder from '@sanity/image-url';
import { client } from './client';

const builder = imageUrlBuilder(client);

export function urlFor(source: any) {
  // This allows you to do urlFor(image).width(800).url()
  return builder.image(source);
}