import { ReviewForm } from "@/components/ReviewForm";
import { inviteMatches } from "@/lib/invite";
import { SITE } from "@/lib/site";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{ code: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { code } = await params;
  if (!inviteMatches(code)) {
    return { title: "Recenzia" };
  }
  return {
    title: "Zapísať recenziu",
    robots: { index: false, follow: false },
  };
}

export default async function ReviewInvitePage({ params }: PageProps): Promise<React.ReactElement> {
  const { code } = await params;
  if (!inviteMatches(code)) notFound();

  return (
    <main className="px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-xl">
        <p className="font-display text-2xl">{SITE.name}</p>
        <h1 className="mt-4 font-display text-4xl tracking-[-0.03em]">Zapísať recenziu</h1>
        <p className="mt-3 text-mute">
          Tento list ste dostali priamym odkazom. Krátky text stačí. Uverejní sa v kolónke recenzií.
        </p>
        <div className="mt-8">
          <ReviewForm code={code} />
        </div>
      </div>
    </main>
  );
}
