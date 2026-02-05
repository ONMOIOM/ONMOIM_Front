import AnalysisSidebar from "./components/AnalysisSidebar";
import StatCard from "./components/StatCard";
import cursorIcon from "../../assets/icons/Cursor_perspective_matte.svg";
import userIcon from "../../assets/icons/User_perspective_matte.svg";
import finishIcon from "../../assets/icons/Padlock_perspective_matte.svg";
import clockIcon from "../../assets/icons/Clock_perspective_matte.svg";
import AnalysisChart from "./components/AnalysisChart";

const Analysis = () => {
  return (
    <div className="flex gap-6 pl-[107px] pt-[154px]">
      <AnalysisSidebar />
      <div className="flex flex-col">
        <div className="flex gap-[26px]">
          <StatCard
            icon={
              <img src={cursorIcon} alt="" className="h-[100px] w-[90px]" />
            }
            label="링크 클릭수"
            value="322"
          />
          <StatCard
            icon={<img src={userIcon} alt="" className="h-[100px] w-[90px]" />}
            label="참여"
            value="1004"
          />
          <StatCard
            icon={
              <img src={finishIcon} alt="" className="h-[100px] w-[90px]" />
            }
            label="완료"
            value="83.44%"
          />
          <StatCard
            icon={<img src={clockIcon} alt="" className="h-[100px] w-[90px]" />}
            label="평균 세션시간"
            value="0:43"
          />
        </div>
        <div className="mt-[34px] mb-[70px]">
          <AnalysisChart />
        </div>
      </div>
    </div>
  );
};

export default Analysis;
