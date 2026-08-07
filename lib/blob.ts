import { getStore } from '@netlify/blobs';

export function getAfbeeldingenStore() {
  return getStore('afbeeldingen');
}
