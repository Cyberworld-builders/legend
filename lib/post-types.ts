export interface PostMeta {
  title: string;
  description: string;
  slug: string;
  publishedDate: string;
  modifiedDate: string;
  keywords?: string[];
  canonicalUrl?: string;
  socialImage?: string;
  headerImage?: string;
  topics?: string[];
  tags?: string[];
  series?: string;
  category?: string;
  isDraft?: boolean;
  isFeatured?: boolean;
  priority?: number;
  language?: string;
  author?: {
    name?: string;
    email?: string;
    url?: string;
    social?: {
      twitter?: string;
      github?: string;
      linkedin?: string;
    };
  };
}
