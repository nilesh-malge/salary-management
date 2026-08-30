import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { EmployeeTable } from "@/components/employee-table";
import {
  activateEmployee,
  deactivateEmployee,
  getEmployees,
} from "@/lib/employees-api";

jest.mock("@/lib/employees-api", () => ({
  getEmployees: jest.fn(),
  activateEmployee: jest.fn(),
  deactivateEmployee: jest.fn(),
}));

const mockedGetEmployees = jest.mocked(getEmployees);
const mockedActivateEmployee = jest.mocked(activateEmployee);
const mockedDeactivateEmployee = jest.mocked(deactivateEmployee);

describe("EmployeeTable", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockedGetEmployees.mockResolvedValue({
      data: [
        {
          id: 1,
          employeeCode: "EMP00001",
          firstName: "Amit",
          lastName: "Sharma",
          email: "amit.sharma@example.com",
          department: "Engineering",
          country: "India",
          jobTitle: "Software Engineer",
          salary: "900000.00",
          currencyCode: "INR",
          status: "ACTIVE",
          createdAt: "2026-08-30T00:00:00.000Z",
          updatedAt: "2026-08-30T00:00:00.000Z",
        },
        {
          id: 2,
          employeeCode: "EMP00002",
          firstName: "Priya",
          lastName: "Patel",
          email: "priya.patel@example.com",
          department: "Finance",
          country: "India",
          jobTitle: "Finance Analyst",
          salary: "750000.00",
          currencyCode: "INR",
          status: "INACTIVE",
          createdAt: "2026-08-30T00:00:00.000Z",
          updatedAt: "2026-08-30T00:00:00.000Z",
        },
      ],
      page: 1,
      pageSize: 20,
      total: 2,
      totalPages: 1,
    });
  });

  it("shows the correct status action for active and inactive employees", async () => {
    render(<EmployeeTable />);

    expect(await screen.findByText("Amit Sharma")).toBeInTheDocument();
    expect(screen.getByText("Priya Patel")).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: "Deactivate" }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: "Activate" }),
    ).toBeInTheDocument();
  });

  it("deactivates an active employee", async () => {
    const user = userEvent.setup();

    mockedDeactivateEmployee.mockResolvedValue({
      id: 1,
      employeeCode: "EMP00001",
      firstName: "Amit",
      lastName: "Sharma",
      email: "amit.sharma@example.com",
      department: "Engineering",
      country: "India",
      jobTitle: "Software Engineer",
      salary: "900000.00",
      currencyCode: "INR",
      status: "INACTIVE",
      createdAt: "2026-08-30T00:00:00.000Z",
      updatedAt: "2026-08-30T00:00:00.000Z",
    });

    jest.spyOn(window, "confirm").mockReturnValue(true);

    render(<EmployeeTable />);

    await screen.findByText("Amit Sharma");

    await user.click(screen.getByRole("button", { name: "Deactivate" }));

    expect(mockedDeactivateEmployee).toHaveBeenCalledWith(1);
  });

  it("activates an inactive employee", async () => {
    const user = userEvent.setup();

    mockedActivateEmployee.mockResolvedValue({
      id: 2,
      employeeCode: "EMP00002",
      firstName: "Priya",
      lastName: "Patel",
      email: "priya.patel@example.com",
      department: "Finance",
      country: "India",
      jobTitle: "Finance Analyst",
      salary: "750000.00",
      currencyCode: "INR",
      status: "ACTIVE",
      createdAt: "2026-08-30T00:00:00.000Z",
      updatedAt: "2026-08-30T00:00:00.000Z",
    });

    jest.spyOn(window, "confirm").mockReturnValue(true);

    render(<EmployeeTable />);

    await screen.findByText("Priya Patel");

    await user.click(screen.getByRole("button", { name: "Activate" }));

    expect(mockedActivateEmployee).toHaveBeenCalledWith(2);
  });
});
