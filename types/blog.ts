export interface BlogAuthor {
  name?: string;
  role?: string;
  image?: string;
  bio?: string;
}



export interface BlogLink {
  title: string;
  url: string;
}



export interface BlogStep {
  title: string;
  description: string;
}



export interface BlogTable {
  headers: string[];
  rows: string[][];
}



export interface BlogVideo {
  url: string;
  title?: string;
  thumbnail?: string;
}



export interface BlogFAQ {

  question: string;

  answer: string;

  category?: string;

}



export interface BlogCallToAction {

  title: string;

  description: string;

  button: string;

  phone?: string;

  url?: string;

}




export interface BlogSEO {

  title?: string;

  description?: string;

  canonical?: string;

  robots?: string;

  keywords?: string[];

  focusKeyword?: string;

  secondaryKeywords?: string[];

  searchIntent?:
    | "informational"
    | "commercial"
    | "transactional"
    | "navigational";


  ogTitle?: string;

  ogDescription?: string;

  ogImage?: string;


  twitterTitle?: string;

  twitterDescription?: string;

  twitterImage?: string;


}



export interface BlogSchema {

  type?:
    | "Article"
    | "FAQPage"
    | "HowTo"
    | "Service"
    | "LocalBusiness";


  data?: Record<string, unknown>;

}




export interface BlogCardEntry {
  title?: string;
  name?: string;
  factor?: string;
  item?: string;
  reason?: string;
  option?: string;
  step?: string;
  description?: string;
  details?: string[];
  service?: string;
  purpose?: string;
  benefit?: string;
}

export interface BlogSection {
  id?: string;
  title: string;
  subtitle?: string;
  content: string[];
  bullets?: string[];
  numberedList?: string[];
  image?: string;
  imageAlt?: string;
  table?: BlogTable;
  steps?: BlogStep[];
  tips?: string[];
  warning?: string;
  note?: string;
  pros?: string[];
  cons?: string[];
  relatedLinks?: BlogLink[];
  video?: BlogVideo;
  quote?: string;
  code?: string;
  highlight?: string;
  importantNote?: string;
  emergencySigns?: string[];
  warningSigns?: string[];
  signs?: string[];
  preventionBenefits?: string[];
  locations?: string[];
  benefits?: Array<string | BlogCardEntry>;
  checklist?: Array<string | BlogCardEntry>;
  services?: Array<string | BlogCardEntry>;
  advantages?: Array<string | BlogCardEntry>;
  inspectionMethods?: Array<string | BlogCardEntry>;
  types?: Array<string | BlogCardEntry>;
  problems?: BlogCardEntry[];
  process?: BlogCardEntry[];
  methods?: BlogCardEntry[];
  costFactors?: BlogCardEntry[];
  solutions?: BlogCardEntry[];
  causes?: BlogCardEntry[];
  repairOptions?: BlogCardEntry[];
  replacementReasons?: BlogCardEntry[];
  selectionFactors?: BlogCardEntry[];
  serviceList?: BlogCardEntry[];
  situations?: BlogCardEntry[];
  technology?: BlogCardEntry[];
  materials?: BlogCardEntry[];
  mistakes?: BlogCardEntry[];
  emergencyIssues?: BlogCardEntry[];
  emergencyServices?: BlogCardEntry[];
  maintenanceSteps?: BlogCardEntry[];
  maintenanceTips?: BlogCardEntry[];
  preventionSteps?: Array<string | BlogCardEntry>;
  comparisonPoints?: BlogCardEntry[];
  propertyTypes?: Array<{
    type?: string;
    services?: string[];
  }>;
  comparison?: Array<{
    method?: string;
    type?: string;
    title?: string;
    option?: string;
    description?: string;
    service?: string;
    purpose?: string;
    benefit?: string;
    benefits?: string[];
    features?: string[];
  }>;
}





export interface BlogService {

  name?: string;

  area?: string;

  priceRange?: string;

  emergency?: boolean;

}





export interface BlogContent {


  title?: string;


  description?: string;


  slug?: string;


  category?: string;


  subCategory?: string;



  service?: BlogService;



  image?: string;

  imageAlt?: string;



  author?: string | BlogAuthor;



  publishedAt?: string;

  updatedAt?: string;



  readingTime?: string;

  wordCount?: number;



  keywords?: string[];



  seo?: BlogSEO;



  introduction: string[];



  sections: BlogSection[];



  callToAction: BlogCallToAction;



  faqs: BlogFAQ[];



  schema?: BlogSchema;



  relatedBlogs?: BlogLink[];



  relatedKeywords?: string[];



  locations?: string[];



  internalLinks?: BlogLink[];



  externalLinks?: BlogLink[];



  metadata?: {

    status?:
      | "draft"
      | "published"
      | "review";


    generatedBy?:
      | "manual"
      | "ai";


    reviewedBy?: string;


    lastUpdated?: string;


    [key:string]: unknown;

  };


}