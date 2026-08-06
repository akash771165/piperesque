import { jsonLd } from "@/lib/utils/json-ld";

interface Props {
  schema: object;
}

export default function JsonLd({ schema }: Props) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: jsonLd(schema),
      }}
    />
  );
}
