export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-xl font-semibold text-slate-900">
              Salary Management
            </h1>
            <p className="text-sm text-slate-500">
              HR payroll and employee insights
            </p>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-slate-900">Dashboard</h2>
          <p className="mt-1 text-sm text-slate-600">
            Overview of employee salary and payroll information.
          </p>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <h3 className="text-base font-medium text-slate-900">
            Payroll overview
          </h3>
          <p className="mt-2 text-sm text-slate-500">
            Payroll metrics and employee analytics will appear here.
          </p>
        </div>
      </section>
    </main>
  );
}
