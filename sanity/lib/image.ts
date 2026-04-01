import { createImageUrlBuilder } from '@sanity/image-url'
import { dataset, projectId } from '../env'

const imageBuilder = createImageUrlBuilder({
  projectId: projectId || 'ht3ye9vm',
  dataset: dataset || 'production',
})

export function urlForImage(source: any) {
  return imageBuilder.image(source).auto('format').fit('max')
}
