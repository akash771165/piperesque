import Script from "next/script";

import { jsonLd } from "@/lib/utils/json-ld";

interface Props {
  id: string;
  schema: object;
}

export default function JsonLdScript({ id, schema }: Props) {
  return (
    <Script
      id={id}
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: jsonLd(schema),
      }}
    />
  );
}
