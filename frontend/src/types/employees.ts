export type EmployeeStatus = "ACTIVE" | "INACTIVE";

export type Employee = {
  id: number;
  employeeCode: string;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  country: string;
  jobTitle: string;
  salary: string;
  currencyCode: string;
  status: EmployeeStatus;
  createdAt: string;
  updatedAt: string;
};

export type EmployeeListResponse = {
  data: Employee[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

export type EmployeeSortField =
  | "employeeCode"
  | "firstName"
  | "department"
  | "country"
  | "salary"
  | "createdAt";

export type SortOrder = "asc" | "desc";

export type EmployeeListParams = {
  page?: number;
  pageSize?: number;
  search?: string;
  department?: string;
  country?: string;
  status?: EmployeeStatus;
  sortBy?: EmployeeSortField;
  sortOrder?: SortOrder;
};
