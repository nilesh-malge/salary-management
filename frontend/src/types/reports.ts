export type PayrollSummary = {
  totalPayroll: number;
  averageSalary: number;
  medianSalary: number;
  employeeCount: number;
  currencyCode: string;
};

export type DepartmentPayroll = {
  department: string;
  totalPayroll: number;
  averageSalary: number;
  employeeCount: number;
  currencyCode: string;
};

export type CountryPayroll = {
  country: string;
  totalPayroll: number;
  averageSalary: number;
  employeeCount: number;
  currencyCode: string;
};

export type SalaryDistribution = {
  salaryRange: string;
  employeeCount: number;
};

export type ReportFilters = {
  department?: string;
  country?: string;
};
