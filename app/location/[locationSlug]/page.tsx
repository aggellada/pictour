import ImageMasonry from "@/app/components/ImageMasonry";
import prisma from "@/lib/db";
import { MoveLeft } from "lucide-react";
import Link from "next/link";

type Props = {
  params: { locationSlug: string };
};

export default async function Page({ params }: Props) {
  const { locationSlug } = await params;

  const location = await prisma.marker.findUnique({
    where: { slug: locationSlug },
    include: { images: true },
  });

  if (!location) {
    return <h1>Data not found</h1>;
  }

  return (
    <>
      <div className="w-full min-h-screen flex grow flex-col p-8 md:px-16 lg:32 bg-gray-900 pb-12 text-[#F5F5F5]">
        <Link href="/map" className="mt-6 flex gap-2">
          <MoveLeft />
          Go back
        </Link>
        <h1 className="text-2xl md:text-4xl font-bold my-6 border-b-1 border-gray-700 pb-6">
          {location?.place}
        </h1>
        <ImageMasonry location={location} locationSlug={locationSlug} />
      </div>
    </>
  );
}
