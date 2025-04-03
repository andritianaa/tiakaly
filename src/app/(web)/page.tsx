import FAQ from '@/app/(web)/components/faq';
import Footer from '@/app/(web)/components/footer';
import RecentContent from '@/app/(web)/components/recent-content';
import Testimonial from '@/app/(web)/components/testimonial';

import Hero from './components/hero';

export default async function RoutePage() {
  return (
    <>
      <Hero />
      <RecentContent />
      <FAQ />
      <Testimonial />
      <Footer />
    </>
  );
}
