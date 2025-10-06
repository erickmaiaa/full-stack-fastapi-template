import { createFileRoute } from "@tanstack/react-router";
import useAuth from "@/hooks/useAuth";

export const Route = createFileRoute("/_layout/")({
  component: Dashboard,
});

function Dashboard() {
  const { user: currentUser } = useAuth();

  return (
    <div className="space-y-4">
      <div className="text-sm text-muted-foreground">
        Welcome back, {currentUser?.full_name}!
      </div>
    </div>
  );
}
