import { Outlet } from "react-router-dom";
import NavBar from "./common/NavBar";
import InquiryButton from "./common/InquiryButton";
import AnalyzeButton from "./common/AnalyzeButton";

const Layout = () => {
  return (
    <div className="min-h-screen bg-white">
      <NavBar />
      <div className="flex">
        <main className="min-w-0 flex-1">
          <Outlet />
        </main>
        <aside
          className="flex shrink-0 flex-col items-end gap-4 pr-[54px] pt-nav-bar-to-buttons"
          aria-label="문의 및 분석"
        >
          <InquiryButton />
          <AnalyzeButton />
        </aside>
      </div>
    </div>
  );
};

export default Layout;
