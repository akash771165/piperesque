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