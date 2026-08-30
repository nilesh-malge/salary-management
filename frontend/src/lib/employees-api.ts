import type {
  EmployeeListParams,
  EmployeeListResponse,
} from "@/types/employees";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export async function getEmployees(
  params: EmployeeListParams = {},
): Promise<EmployeeListResponse> {
  const searchParams = new URLSearchParams();

  if (params.page) {
    searchParams.set("page", params.page.toString());
  }

  if (params.pageSize) {
    searchParams.set("pageSize", params.pageSize.toString());
  }

  if (params.search) {
    searchParams.set("search", params.search);
  }

  if (params.department) {
    searchParams.set("department", params.department);
  }

  if (params.country) {
    searchParams.set("country", params.country);
  }

  if (params.status) {
    searchParams.set("status", params.status);
  }

  const query = searchParams.toString();
  const url = `${API_URL}/employees${query ? `?${query}` : ""}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Unable to load employees");
  }

  return response.json() as Promise<EmployeeListResponse>;
}
