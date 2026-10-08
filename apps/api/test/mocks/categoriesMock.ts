export interface CategoryMock {
  id: string;
  name: string;
  estimatedAmount: number;
}

export const mockCategory1: CategoryMock = {
  id: 'category-1',
  name: 'Alimentation',
  estimatedAmount: 300,
};

export const mockCategory2: CategoryMock = {
  id: 'category-2',
  name: 'Salaire',
  estimatedAmount: 2000,
};

export const mockCategoryList: CategoryMock[] = [
  mockCategory1,
  mockCategory2,
];
