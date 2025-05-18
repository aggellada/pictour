import prisma from "@/lib/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import Map from "../../components/Map";

export default async function Home() {
  const { isAuthenticated, getUser } = getKindeServerSession();
  
  const user = await getUser();
  const authenticated = await isAuthenticated();

  if (!authenticated) return redirect("api/auth/login");

  if (!user?.id) {
    throw new Error("User not found");
  }

  const markers = await prisma.marker.findMany({
    where: {
      userId: user.id,
    },
    include: {
      images: true,
    },
  });

  return (
    <div className="w-full h-screen ">
      <Map markersData={markers} />
    </div>
  );
}
