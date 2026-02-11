import { Outlet, useLocation } from "react-router-dom";
import NavBar from "./common/NavBar";
import AnalyzeButton from "./common/AnalyzeButton";

const Layout = () => {
  const { pathname } = useLocation();
  const isAnalysisPage = pathname === "/analysis" || pathname.startsWith("/analysis/");

  return (
    <div className="min-h-screen bg-white">
      <NavBar />
      <div className="flex">
        <main className="min-w-0 flex-1">
          <Outlet />
        </main>
        <aside
          className="pointer-events-none flex shrink-0 flex-col items-end gap-4 pr-[54px] pt-nav-bar-to-buttons"
          aria-label="분석"
        >
          <div className="pointer-events-auto flex flex-col gap-4">
            {!isAnalysisPage && <AnalyzeButton />}
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Layout;
