import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Home() {
  const { isAuthenticated } = getKindeServerSession();

  if (await isAuthenticated()) {
    redirect("/map");
  }

  return (
    <div className="relative w-full min-h-screen flex flex-col items-center justify-center px-6 py-20 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 text-white overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-[-200px] left-[-150px] w-[600px] h-[600px] bg-blue-500 opacity-20 rounded-full blur-[200px] z-0" />
      <div className="absolute bottom-[-150px] right-[-100px] w-[500px] h-[500px] bg-pink-500 opacity-20 rounded-full blur-[150px] z-0" />

      <main className="relative z-10 max-w-4xl text-center">
        <h1 className="text-5xl font-extrabold mb-6 tracking-tight leading-tight">
          Map Your Memories with <span className="text-blue-400">Pictour</span>
        </h1>
        <p className="text-lg max-w-2xl mx-auto mb-6 text-gray-300">
          Pictour is your visual travel companion — pin locations on an
          interactive map and attach your personal travel photos to each
          destination. Relive every journey and share your adventures with the
          world.
        </p>

        <div className="flex justify-center my-10">
          <img
            src="/pictour-map-preview.png"
            alt="Pictour interactive map preview"
            className="w-full max-w-2xl rounded-xl shadow-xl border border-gray-700"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/api/auth/login"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg text-lg font-medium transition"
          >
            Get Started
          </Link>
        </div>
      </main>

      {/* Future Feature Section */}
      <section
        id="features"
        className="relative z-10 mt-24 w-full max-w-5xl grid gap-10 sm:grid-cols-3 text-center"
      >
        <div>
          <h3 className="text-xl font-semibold mb-2 text-blue-400">
            Interactive Map
          </h3>
          <p className="text-sm text-gray-400">
            Pin your favorite places and see where your memories live.
          </p>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-2 text-pink-400">
            Photo Galleries
          </h3>
          <p className="text-sm text-gray-400">
            Upload photos to each location and relive your travel stories.
          </p>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-2 text-green-400">
            Your Travel Timeline
          </h3>
          <p className="text-sm text-gray-400">
            Watch your adventures unfold with a dynamic photo history.
          </p>
        </div>
      </section>
    </div>
  );
}
