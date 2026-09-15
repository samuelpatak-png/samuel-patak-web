"use client";

import { submitReview } from "@/app/reviews";
import { SITE } from "@/lib/site";
import { FormEvent, useState } from "react";

export function ReviewForm({ code }: { code: string }) {
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [pending, setPending] = useState(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setPending(true);
    const result = await submitReview(code, new FormData(event.currentTarget));
    setPending(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setDone(true);
  };

  if (done) {
    return (
      <p className="sheet-frame bg-paper px-6 py-8 text-lg leading-relaxed">
        Recenzia je zapísaná. Ďakujem. Na vizitke ju uvidíte v kolónke recenzií.
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="sheet-frame bg-paper px-6 py-8 sm:px-8">
      <label className="grid gap-1 text-sm text-mute">
        Meno
        <input required name="name" autoComplete="name" className="rule-input min-h-11 text-ink" />
      </label>
      <label className="mt-5 grid gap-1 text-sm text-mute">
        Firma alebo úloha <span className="text-rule">(nepovinné)</span>
        <input name="company" autoComplete="organization" className="rule-input min-h-11 text-ink" />
      </label>
      <label className="mt-5 grid gap-1 text-sm text-mute">
        Recenzia
        <textarea
          required
          name="body"
          rows={5}
          className="rule-input py-3 text-ink"
          placeholder="Ako prebehla spolupráca"
        />
      </label>
      {error ? <p className="mt-4 text-sm text-hot">{error}</p> : null}
      <button
        type="submit"
        disabled={pending}
        className="mt-7 inline-flex min-h-12 items-center border border-ink bg-ink px-4 text-sm text-sheet disabled:opacity-60"
      >
        {pending ? "Zapisujem" : "Zapísať recenziu"}
      </button>
      <p className="mt-4 text-sm text-mute">Ide na vizitku {SITE.name}.</p>
    </form>
  );
}
