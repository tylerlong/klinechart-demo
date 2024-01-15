export interface Company {
  name: string;
  description: string;
  branding: { icon_url: string };
}

export interface News {
  id: string;
  title: string;
  article_url: string;
  published_utc: string;
  publisher: { name: string };
}
