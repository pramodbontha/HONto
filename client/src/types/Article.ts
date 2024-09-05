export interface Article {
  id: string;
  name: string;
  citing_cases: {
    low: number;
    high: number;
  };
  number: number;
  text: string;
  total_case_citations: {
    low: number;
    high: number;
  };
}

export interface ArticleFilter {
  searchTerm: string;
  name: boolean;
  number: boolean;
  text: boolean;
  skip: number;
  limit: number;
}
