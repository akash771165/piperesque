import Image from "next/image";

type Props = {
  author: string;
  publishedAt: string;
  readingTime: string;
};

export default function AuthorBox({
  author,
  publishedAt,
  readingTime,
}: Props) {
  return (
    <section className="mt-16 rounded-3xl border border-slate-200 bg-slate-50 p-8">

      <div className="flex flex-col gap-6 md:flex-row md:items-center">

        <Image
          src="/images/author.png"
          alt={author}
          width={80}
          height={80}
          className="rounded-full border"
        />

        <div>

          <h3 className="text-2xl font-black">
            {author}
          </h3>

          <p className="mt-2 text-slate-600">
            Professional plumbing content reviewed and maintained by the Piperesque Editorial Team.
          </p>

          <div className="mt-4 flex flex-wrap gap-6 text-sm text-slate-500">

            <span>
              📅 Published: {publishedAt}
            </span>

            <span>
              ⏱ {readingTime}
            </span>

          </div>

        </div>

      </div>

    </section>
  );
}