export interface CaseFilter {
  searchTerm: string;
  name?: boolean;
  number?: boolean;
  judgment?: boolean;
  facts?: boolean;
  reasoning?: boolean;
  headnotes?: boolean;
  startYear?: string;
  endYear?: string;
  skip: number;
  limit: number;
}
