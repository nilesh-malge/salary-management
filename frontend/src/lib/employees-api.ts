import type {
  CreateEmployeeInput,
  Employee,
  EmployeeListParams,
  EmployeeListResponse,
  UpdateEmployeeInput,
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

  if (params.sortBy) {
    searchParams.set("sortBy", params.sortBy);
  }

  if (params.sortOrder) {
    searchParams.set("sortOrder", params.sortOrder);
  }

  const query = searchParams.toString();
  const url = `${API_URL}/employees${query ? `?${query}` : ""}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Unable to load employees");
  }

  return response.json() as Promise<EmployeeListResponse>;
}

export async function createEmployee(
  input: CreateEmployeeInput,
): Promise<Employee> {
  const response = await fetch(`${API_URL}/employees`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const error = (await response.json()) as {
      message?: string | string[];
    };

    const message = Array.isArray(error.message)
      ? error.message.join(", ")
      : error.message;

    throw new Error(message || "Unable to create employee");
  }

  return response.json() as Promise<Employee>;
}

export async function updateEmployee(
  id: number,
  input: UpdateEmployeeInput,
): Promise<Employee> {
  const response = await fetch(`${API_URL}/employees/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const error = (await response.json()) as {
      message?: string | string[];
    };

    const message = Array.isArray(error.message)
      ? error.message.join(", ")
      : error.message;

    throw new Error(message || "Unable to update employee");
  }

  return response.json() as Promise<Employee>;
}

export async function deactivateEmployee(id: number): Promise<Employee> {
  const response = await fetch(`${API_URL}/employees/${id}/deactivate`, {
    method: "PATCH",
  });

  if (!response.ok) {
    const error = (await response.json()) as {
      message?: string | string[];
    };

    const message = Array.isArray(error.message)
      ? error.message.join(", ")
      : error.message;

    throw new Error(message || "Unable to deactivate employee");
  }

  return response.json() as Promise<Employee>;
}

export async function activateEmployee(id: number): Promise<Employee> {
  const response = await fetch(`${API_URL}/employees/${id}/activate`, {
    method: "PATCH",
  });

  if (!response.ok) {
    const error = (await response.json()) as {
      message?: string | string[];
    };

    const message = Array.isArray(error.message)
      ? error.message.join(", ")
      : error.message;

    throw new Error(message || "Unable to activate employee");
  }

  return response.json() as Promise<Employee>;
}
