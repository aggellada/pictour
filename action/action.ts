"use server";

import prisma from "@/lib/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const saveForm = async (formData: FormData): Promise<void> => {
  try {
    const { isAuthenticated, getUser } = getKindeServerSession();
    const user = await getUser();
    const authenticated = await isAuthenticated();

    if (!authenticated) {
      redirect("/api/auth/login");
    }

    if (!user?.id) {
      throw new Error("User not found");
    }

    if (
      formData.get("place") === "" ||
      formData.get("date") === "" ||
      formData.get("lat") === "" ||
      formData.get("lng") === ""
    ) {
      throw new Error("No data entered. Please try again.");
    }

    await prisma.marker.create({
      data: {
        place: formData.get("place") as string,
        date: new Date(formData.get("date") as string),
        lat: parseFloat(formData.get("lat") as string),
        lng: parseFloat(formData.get("lng") as string),
        slug: (formData.get("place") as string)
          .trim()
          .toLowerCase()
          .replace(/\s+/g, "-"),
        userId: user?.id as string,
      },
    });

    revalidatePath("/");
  } catch (err) {
    throw err;
  }
};

export const uploadImages = async (
  formData: FormData,
  markerId: string
): Promise<void> => {
  try {
    const { isAuthenticated, getUser } = getKindeServerSession();
    const user = await getUser();
    const authenticated = await isAuthenticated();

    if (!authenticated) {
      redirect("/api/auth/login");
    }

    if (!user?.id) {
      throw new Error("User not found");
    }

    const files = formData.getAll("file") as File[];

    if (!files.length || !markerId) {
      throw new Error("No images uploaded. Please try again.");
    }

    // study this !!!!!

    const uploadPromises = files.map(async (file) => {
      const arrayBuffer = await file.arrayBuffer();
      const blob = new Blob([arrayBuffer]);

      const uploadRes = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: (() => {
            const fd = new FormData();
            fd.append("file", blob);
            fd.append(
              "upload_preset",
              `${process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}`
            );
            return fd;
          })(),
        }
      );

      if (!uploadRes.ok) {
        throw new Error("Failed to upload image to Cloudinary");
      }

      const data = await uploadRes.json();
      return { url: data.secure_url, publicId: data.public_id };
    });

    const imageUrls = await Promise.all(uploadPromises);

    // //////////// !!!!!!

    await prisma.image.createMany({
      data: imageUrls.map(({ url, publicId }) => ({
        markerId,
        publicId,
        link: url,
      })),
    });

    revalidatePath("/map");
  } catch (err) {
    throw err;
  }
};

export const deleteCloudinaryImage = async (publicId: string) => {
  try {
    return cloudinary.uploader.destroy(publicId);
  } catch (err) {
    throw err;
  }
};

export const deleteImage = async (
  imageId: string,
  locationSlug: string,
  publicId: string
) => {
  try {
    await prisma.image.delete({ where: { id: imageId } });
    await deleteCloudinaryImage(publicId);
    revalidatePath(`/${locationSlug}`);
  } catch (err) {
    throw err;
  }
};

export const deleteMarker = async (markerId: string) => {
  try {
    const marker = await prisma.marker.findUnique({
      where: {
        id: markerId,
      },
      include: { images: true },
    });

    const publicIds = marker?.images.map((image) => image.publicId);

    if (!publicIds) return;

    if (publicIds.length > 0) {
      await cloudinary.api.delete_resources(publicIds);
    }

    await prisma.image.deleteMany({
      where: {
        markerId: markerId,
      },
    });

    await prisma.marker.delete({ where: { id: markerId } });

    revalidatePath("/map");
  } catch (err) {
    throw err;
  }
};

export const fetchSearchCoordinates = async (searchValue: string) => {
  try {
    if (!searchValue) return;

    const res = await fetch(
      `https://api.api-ninjas.com/v1/geocoding?city=${searchValue}`,
      {
        method: "GET",
        headers: {
          "X-Api-Key": `${process.env.NEXT_PUBLIC_GEOCODE_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const data = await res.json();

    return data;
  } catch (err) {
    throw err;
  }
};
