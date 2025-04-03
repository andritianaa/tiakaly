import FAQ from '@/app/(web)/components/faq';
import RecentContent from '@/app/(web)/components/recent-content';
import Testimonial from '@/app/(web)/components/testimonial';
import { MouseAnimation } from '@/components/mouse-animation';

import Hero from './components/hero';

export default async function RoutePage() {
  return (
    <>
      <Hero />
      <MouseAnimation />
      <RecentContent />
      <FAQ />
      <Testimonial />
    </>
  );
}
