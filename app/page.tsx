import HeroCarousel from '@/components/HeroCarousel';
import NewsSection from '@/components/NewsSection';

export default function Home() {
  return (
    <div className="w-full">
      {/* Slides Section - Full Width */}
      <section className="w-full">
        <HeroCarousel />
      </section>

      {/* About Us Section */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
          <div className="md:col-span-1">
            <h2 className="text-2xl font-semibold tracking-tight text-black">
              介绍｜About us
            </h2>
          </div>
          <div className="md:col-span-2 space-y-6 text-base leading-[1.8] text-gray-600 text-justify">
            <p>
              万物有灵实验室（Ani-Thing Robotics Lab, 原IM3 Lab）主要研究具有层级模块化本体架构的具身智能系统。我们是一个多学科交叉研究的团队，囊括机电、力学/应用物理、计算科学、生物学、设计学等。
            </p>
            <p>
              万物有灵的英文名Ani-thing，是由万物有灵这一个哲学概念的英文Animism引申而来，和万物有灵这一中文名共同寓意我们的理念可以被应用到非常广泛的具身系统种类中去。而原IM3代表了(Intelligent Multi-body & Many-body Machines)，也代表了（Intelligent Mechanics & Manufacturing & Machines），前者寓意了我们研究对象的特征，后者寓意了我们采用的方法和学科知识。
            </p>
          </div>
        </div>
      </section>

      {/* News Section - Constrained Width */}
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 border-t border-gray-300">
        <div className="mb-12">
          <h2 className="text-2xl font-semibold tracking-tight text-black">
            新闻｜News
          </h2>
        </div>
        <NewsSection />
      </div>
    </div>
  );
}
