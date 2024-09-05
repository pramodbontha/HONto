export interface ReferenceFilter {
  searchTerm: string;
  context: boolean;
  text: boolean;
  resources: string[];
  refCasesArticles: boolean;
  skip: number;
  limit: number;
}
