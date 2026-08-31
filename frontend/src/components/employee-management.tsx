"use client";

import { useEffect, useRef, useState } from "react";
import { AddEmployeeForm } from "@/components/add-employee-form";
import { EditEmployeeForm } from "@/components/edit-employee-form";
import { EmployeeTable } from "@/components/employee-table";
import type { Employee } from "@/types/employees";

type EmployeeManagementProps = {
  onEmployeeChanged?: () => void;
};

export function EmployeeManagement({
  onEmployeeChanged,
}: EmployeeManagementProps) {
  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null,
  );

  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedEmployee) {
      formRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [selectedEmployee]);

  function refreshEmployees() {
    setRefreshKey((current) => current + 1);
    onEmployeeChanged?.();
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
      <div ref={formRef}>
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
      </div>

      <EmployeeTable
        refreshKey={refreshKey}
        onEditEmployee={setSelectedEmployee}
        onEmployeeStatusChanged={refreshEmployees}
      />
    </div>
  );
}
