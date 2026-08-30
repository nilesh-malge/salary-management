"use client";

import { useState } from "react";
import { AddEmployeeForm } from "@/components/add-employee-form";
import { EditEmployeeForm } from "@/components/edit-employee-form";
import { EmployeeTable } from "@/components/employee-table";
import type { Employee } from "@/types/employees";

export function EmployeeManagement() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null,
  );

  function refreshEmployees() {
    setRefreshKey((current) => current + 1);
  }

  function handleEmployeeCreated() {
    refreshEmployees();
  }

  function handleEmployeeUpdated() {
    setSelectedEmployee(null);
    refreshEmployees();
  }

  return (
    <div className="space-y-8">
      {selectedEmployee ? (
        <EditEmployeeForm
          key={selectedEmployee.id}
          employee={selectedEmployee}
          onUpdated={handleEmployeeUpdated}
          onCancel={() => setSelectedEmployee(null)}
        />
      ) : (
        <AddEmployeeForm onEmployeeCreated={handleEmployeeCreated} />
      )}

      <EmployeeTable
        refreshKey={refreshKey}
        onEditEmployee={setSelectedEmployee}
      />
    </div>
  );
}
