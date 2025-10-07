import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { isLoggedIn } from "@/hooks/useAuth";

export const Route = createFileRoute("/_auth_layout")({
  component: AuthLayout,
  beforeLoad: () => {
    if (isLoggedIn()) {
      throw redirect({
        to: "/",
      });
    }
  },
});

function AuthLayout() {
  return (
    <div>
      <Outlet />
    </div>
  );
}
