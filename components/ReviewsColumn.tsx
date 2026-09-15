"use client";

import type { Review } from "@/app/reviews";

function formatDay(iso: string): string {
  return new Intl.DateTimeFormat("sk-SK", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(iso));
}

export function ReviewsColumn({ reviews }: { reviews: Review[] }) {
  return (
    <section id="recenzie" className="px-4 py-14 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <h2 className="font-display text-2xl tracking-[-0.03em] sm:text-3xl">Recenzie</h2>
        <p className="mt-2 max-w-xl text-mute">
          Samostatná kolónka. Pribudnú tu texty od ľudí, ktorým pošlem priamy odkaz.
        </p>
        {reviews.length === 0 ? (
          <p className="sheet-frame mt-8 bg-paper px-5 py-6 text-mute">Zatiaľ žiadny zápis.</p>
        ) : (
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {reviews.map((review) => (
              <article key={review.id} className="sheet-frame bg-paper px-5 py-6">
                <p className="text-sm text-mute">{formatDay(review.createdAt)}</p>
                <h3 className="mt-2 font-display text-2xl">{review.name}</h3>
                {review.company ? <p className="mt-1 text-sm text-mute">{review.company}</p> : null}
                <p className="mt-3 leading-relaxed">{review.body}</p>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
