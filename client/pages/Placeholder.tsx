import { Link } from "react-router-dom";

export default function Placeholder({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="min-h-[calc(100dvh-56px-56px)] sm:min-h-[calc(100dvh-56px)] grid place-items-center px-6">
      <div className="max-w-md text-center space-y-4">
        <div className="mx-auto size-16 rounded-xl brand-gradient" />
        <h1 className="text-2xl font-bold">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
        <div className="text-sm">
          <Link className="text-primary underline" to="/">
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
