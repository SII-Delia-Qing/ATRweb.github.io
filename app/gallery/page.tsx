import { client } from '@/sanity/lib/client'
import Image from 'next/image'

interface GalleryItem {
  _id: string
  imageUrl: string
  caption?: string
  date?: string
}

async function getGalleryItems() {
  const query = `*[_type == "galleryItem"] | order(order asc, _createdAt desc) {
    _id,
    caption,
    date,
    "imageUrl": image.asset->url
  }`

  return client.fetch(query, {}, { next: { revalidate: 60 } })
}

export default async function GalleryPage() {
  const items: GalleryItem[] = await getGalleryItems()

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-gray-500">
          <p className="text-lg">相册暂无照片</p>
          <p className="text-sm">请在后台上传照片</p>
        </div>
      ) : (
        <div className="columns-1 gap-4 space-y-4 sm:columns-2 lg:columns-3 xl:columns-4">
          {items.map((item) => (
            <div
              key={item._id}
              className="break-inside-avoid overflow-hidden rounded-xl bg-gray-50 transition-all duration-300 hover:shadow-lg hover:scale-[1.01]"
            >
              <div className="relative w-full">
                <Image
                  src={item.imageUrl}
                  alt={item.caption || 'Gallery Image'}
                  width={800}
                  height={1200}
                  className="h-auto w-full object-cover"
                  loading="lazy"
                />
              </div>

              {item.caption && (
                <div className="p-4 bg-white">
                  <p className="text-sm font-medium text-gray-800 leading-relaxed">
                    {item.caption}
                  </p>

                  {item.date && (
                    <p className="mt-2 text-xs text-gray-400 font-mono">
                      {item.date}
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}