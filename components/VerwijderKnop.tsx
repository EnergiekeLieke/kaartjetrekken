'use client';

export default function VerwijderKnop({
  formAction,
  bevestiging,
  className,
}: {
  formAction: (formData: FormData) => void;
  bevestiging: string;
  className?: string;
}) {
  return (
    <button
      type="submit"
      formAction={formAction}
      className={className}
      onClick={(e) => {
        if (!confirm(bevestiging)) e.preventDefault();
      }}
    >
      Verwijderen
    </button>
  );
}
