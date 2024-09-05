export interface ArticleFilter {
  searchTerm: string;
  name: boolean;
  number: boolean;
  text: boolean;
  skip: number;
  limit: number;
}
