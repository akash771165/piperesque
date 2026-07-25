export interface BlogAuthor {
  name?: string;
  role?: string;
  image?: string;
  bio?: string;
}


export interface BlogStep {
  title: string;
  description: string;
}


export interface BlogTable {
  headers: string[];
  rows: string[][];
}


export interface BlogLink {
  title: string;
  url: string;
}


export interface BlogVideo {
  url: string;
  title?: string;
  thumbnail?: string;
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


  tips?: string[];


  warning?: string;


  note?: string;


  pros?: string[];


  cons?: string[];


  steps?: BlogStep[];


  relatedLinks?: BlogLink[];


  video?: BlogVideo;


  quote?: string;


  code?: string;


  highlight?: string;

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


export interface BlogSchema {

  type?:
    | "Article"
    | "FAQPage"
    | "HowTo"
    | "Service"
    | "LocalBusiness";


  data?: Record<string, any>;

}


export interface BlogSEO {

  title?: string;

  description?: string;


  canonical?: string;


  robots?: string;


  keywords?: string[];


  ogTitle?: string;

  ogDescription?: string;

  ogImage?: string;


  twitterTitle?: string;

  twitterDescription?: string;

  twitterImage?: string;


  schemaType?:
    | "Article"
    | "FAQPage"
    | "HowTo"
    | "Service"
    | "LocalBusiness";

}



export interface BlogService {

  name?: string;

  area?: string;

  priceRange?: string;

  emergency?: boolean;

}



export interface BlogContent {


  /*
  Basic Information
  */

  title?: string;

  description?: string;

  slug?: string;

  category?: string;

  subCategory?: string;



  /*
  Service SEO Data
  */

  service?: BlogService;



  /*
  Media
  */

  image?: string;

  imageAlt?: string;



  /*
  Author
  */

  author?: string | BlogAuthor;



  /*
  Dates
  */

  publishedAt?: string;

  updatedAt?: string;



  /*
  Reading Info
  */

  readingTime?: string;



  /*
  Keywords
  */

  keywords?: string[];



  /*
  Advanced SEO
  */

  seo?: BlogSEO;



  /*
  Main Content
  */

  introduction: string[];


  sections: BlogSection[];



  /*
  CTA
  */

  callToAction: BlogCallToAction;



  /*
  FAQ
  */

  faqs: BlogFAQ[];



  /*
  Schema
  */

  schema?: BlogSchema;



  /*
  Related Content
  */

  relatedBlogs?: BlogLink[];



  /*
  Local SEO
  */

  locations?: string[];



  /*
  Internal Links
  */

  internalLinks?: BlogLink[];



  /*
  External References
  */

  externalLinks?: BlogLink[];



  /*
  Extra Dynamic Data
  */

  metadata?: Record<string, any>;

}