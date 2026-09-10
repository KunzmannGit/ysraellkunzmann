import { Hero } from "@/components/home/Hero";
import { Manifesto } from "@/components/home/Manifesto";
import { Featured } from "@/components/home/Featured";
import { DualPath } from "@/components/home/DualPath";
import { Partnership } from "@/components/home/Partnership";
import { getFeatured, getProperties } from "@/lib/properties";

export default async function HomePage() {
  const [properties, featured] = await Promise.all([getProperties(), getFeatured()]);

  return (
    <>
      <Hero properties={properties} featured={featured} />
      <Manifesto />
      <Featured properties={featured} />
      <DualPath />
      <Partnership />
    </>
  );
}
