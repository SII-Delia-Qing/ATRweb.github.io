import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between md:flex-row">
          
          {/* Left Side: Lab Info */}
          <div className="mb-8 md:mb-0 space-y-2">
            <h2 className="text-xl font-bold text-gray-900">
              Ani-Thing Robotics Lab
            </h2>
            <div className="text-sm text-gray-600 space-y-1">
              <p>Email: yinzhen@sii.edu.cn</p>
              <p>Address: 699 Huafa Road, Xuhui District, Shanghai</p>
            </div>
            <p className="pt-4 text-xs text-gray-500">
              Copyright ©️ AniThing Robotics Lab, All Rights Reserved
            </p>
          </div>

          {/* Right Side: QR Codes */}
          <div className="flex space-x-6">
            
            {/* Xiaohongshu */}
            <div className="flex flex-col items-center space-y-2">
              <div className="relative h-24 w-24 overflow-hidden rounded-lg border border-gray-200 bg-white p-1 shadow-sm">
                <Image
                  src="/qrcode-rednote.png"
                  alt="Xiaohongshu QR Code"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <span className="text-xs font-medium text-gray-500">
                小红书
              </span>
            </div>

            {/* Bilibili */}
            <div className="flex flex-col items-center space-y-2">
              <div className="relative h-24 w-24 overflow-hidden rounded-lg border border-gray-200 bg-white p-1 shadow-sm">
                <Image
                  src="/qrcode-bilibili.png"
                  alt="Bilibili QR Code"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <span className="text-xs font-medium text-gray-500">
                哔哩哔哩
              </span>
            </div>

          </div>
        </div>
      </div>
    </footer>
  );
}