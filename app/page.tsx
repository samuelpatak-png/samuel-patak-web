import { listReviews } from "@/app/reviews";
import { SiteShell } from "@/components/SiteShell";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const reviews = await listReviews();
  return <SiteShell reviews={reviews} />;
}
