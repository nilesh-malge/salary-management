"use client";

import { useState } from "react";
import { AddEmployeeForm } from "@/components/add-employee-form";
import { EmployeeTable } from "@/components/employee-table";

export function EmployeeManagement() {
  const [refreshKey, setRefreshKey] = useState(0);

  function handleEmployeeCreated() {
    setRefreshKey((current) => current + 1);
  }

  return (
    <div className="space-y-8">
      <AddEmployeeForm onEmployeeCreated={handleEmployeeCreated} />
      <EmployeeTable refreshKey={refreshKey} />
    </div>
  );
}
