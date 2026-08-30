import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AddEmployeeForm } from "@/components/add-employee-form";
import { createEmployee } from "@/lib/employees-api";

jest.mock("@/lib/employees-api", () => ({
  createEmployee: jest.fn(),
}));

const mockedCreateEmployee = jest.mocked(createEmployee);

describe("AddEmployeeForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("creates an employee with the selected country currency", async () => {
    const user = userEvent.setup();
    const onEmployeeCreated = jest.fn();

    mockedCreateEmployee.mockResolvedValue({
      id: 10001,
      employeeCode: "EMP10001",
      firstName: "Rahul",
      lastName: "Patil",
      email: "rahul.patil@example.com",
      department: "Engineering",
      country: "India",
      jobTitle: "Software Engineer",
      salary: "900000.00",
      currencyCode: "INR",
      status: "ACTIVE",
      createdAt: "2026-08-30T00:00:00.000Z",
      updatedAt: "2026-08-30T00:00:00.000Z",
    });

    render(<AddEmployeeForm onEmployeeCreated={onEmployeeCreated} />);

    await user.type(screen.getByLabelText(/employee code/i), "EMP10001");

    await user.type(screen.getByLabelText(/first name/i), "Rahul");

    await user.type(screen.getByLabelText(/last name/i), "Patil");

    await user.type(screen.getByLabelText(/email/i), "rahul.patil@example.com");

    await user.selectOptions(
      screen.getByLabelText(/department/i),
      "Engineering",
    );

    await user.selectOptions(screen.getByLabelText(/country/i), "India");

    await user.type(screen.getByLabelText(/job title/i), "Software Engineer");

    await user.type(screen.getByLabelText(/salary/i), "900000");

    await user.click(screen.getByRole("button", { name: /add employee/i }));

    expect(mockedCreateEmployee).toHaveBeenCalledWith({
      employeeCode: "EMP10001",
      firstName: "Rahul",
      lastName: "Patil",
      email: "rahul.patil@example.com",
      department: "Engineering",
      country: "India",
      jobTitle: "Software Engineer",
      salary: 900000,
      currencyCode: "INR",
    });

    expect(onEmployeeCreated).toHaveBeenCalled();
  });
});
