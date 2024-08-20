export interface Reference {
  id: string;
  context: string;
  next_toc: string;
  resource: string;
  text: string;
}

export interface ReferenceFilter {
  searchTerm: string;
  context: boolean;
  text: boolean;
  skip: number;
  limit: number;
}
