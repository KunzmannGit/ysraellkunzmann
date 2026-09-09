import { Hero } from "@/components/home/Hero";
import { Manifesto } from "@/components/home/Manifesto";
import { Featured } from "@/components/home/Featured";
import { DualPath } from "@/components/home/DualPath";
import { Partnership } from "@/components/home/Partnership";
import { getFeatured, getHeroProperty } from "@/lib/properties";

export default async function HomePage() {
  const [hero, featured] = await Promise.all([getHeroProperty(), getFeatured()]);

  return (
    <>
      <Hero featured={hero} />
      <Manifesto />
      <Featured properties={featured} />
      <DualPath />
      <Partnership />
    </>
  );
}
