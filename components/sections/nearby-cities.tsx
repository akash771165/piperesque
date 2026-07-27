import Link from "next/link";
import { cities } from "@/lib/data/cities";

interface NearbyCitiesProps {
  currentCity: string;
}

export default function NearbyCities({
  currentCity,
}: NearbyCitiesProps) {
  const nearby = cities.filter(
    (city) => city.slug !== currentCity
  );

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center">
          Nearby Service Areas
        </h2>

        <p className="mt-4 text-center text-gray-600">
          Piperesque also provides plumbing services throughout the Greater
          Houston area.
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {nearby.map((city) => (
            <Link
              key={city.slug}
              href={`/service-areas/${city.slug}`}
              className="rounded-lg border p-4 transition hover:border-red-600 hover:text-red-600"
            >
              {city.name}, TX
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}