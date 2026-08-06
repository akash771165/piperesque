import JsonLd from "@/components/seo/json-ld";
import { breadcrumbListSchema, type BreadcrumbItem } from "@/lib/seo/schema";

interface Props {
  items: BreadcrumbItem[];
}

export default function BreadcrumbSchema({ items }: Props) {
  return <JsonLd schema={breadcrumbListSchema(items)} />;
}
