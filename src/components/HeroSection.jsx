import React, { useState } from 'react';
import HeroFeaturedVideoCard from './HeroFeaturedVideoCard';

export default function HeroSection({ property = null }) {
  const [featuredProperty, setFeaturedProperty] = useState(null);
  const activeProperty = property || featuredProperty;
  return <HeroFeaturedVideoCard property={activeProperty} />;
}

export { HeroSection };

