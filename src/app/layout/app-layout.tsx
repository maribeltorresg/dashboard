import { Outlet } from "react-router-dom";

export default function AppLayout() {
  return (
    //  className="min-h-screen bg-[#020817] text-white"
    <div>
      {/* sidebar */}
      {/* navbar */}

      <main>
        <Outlet />
      </main>
    </div>
  );
}
