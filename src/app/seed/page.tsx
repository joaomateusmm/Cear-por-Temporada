import { redirect } from "next/navigation";

import { seedAmenities } from "@/lib/seed-amenities";

export default async function SeedPage() {
  const result = await seedAmenities();

  if (result.success) {
    console.log(result.message);
  } else {
    console.error(result.error);
  }

  redirect("/");
}
