import { createBrowserRouter, RouterProvider } from "react-router-dom";

import AppLayout from "../layout/app-layout";
import DashboardPage from "@/pages/dashboard/dashboard-page";

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        path: "/",
        element: <DashboardPage />,
      },
    ],
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
