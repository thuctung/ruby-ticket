"use client";
import UpdatePassword from "@/app-controler/updatePassword";

export default async function UpdatePasswordPage({ params }: { params: Promise<{ lng: string }> }) {
  const { lng } = await params;

  return <UpdatePassword lng={lng} />;
}
