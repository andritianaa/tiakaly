import RecentContent from '@/app/(web)/components/recent-content';
import { MouseAnimation } from '@/components/mouse-animation';

import Hero from './components/hero';

export default async function RoutePage() {
  return (
    <>
      <Hero />
      <MouseAnimation />
      <RecentContent />
      {/* <FAQ /> */}
      {/* <Testimonial /> */}
    </>
  );
}
