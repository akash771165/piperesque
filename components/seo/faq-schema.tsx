import JsonLd from "@/components/seo/json-ld";
import { faqPageSchema, type FAQItem } from "@/lib/seo/schema";

export type { FAQItem };

interface FAQSchemaProps {
  faqs: FAQItem[];
}

export default function FAQSchema({ faqs }: FAQSchemaProps) {
  return <JsonLd schema={faqPageSchema(faqs)} />;
}
