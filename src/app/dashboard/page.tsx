import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardPage() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>Welcome</CardTitle>
          <CardDescription>
            This is the dashboard shell. Feature widgets get added here as modules are built.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
