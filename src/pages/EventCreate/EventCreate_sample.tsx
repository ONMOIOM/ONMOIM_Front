import { LeftFormPanel } from "./components/LeftFormPanel";
import { CoverPreviewPanel } from "./components/CoverPreviewPanel";
import { ActionPanel } from "./components/ActionPanel";

export default function EventCreate() {
  return (
    <div className="w-full bg-white">
      <div className="mx-auto max-w-[1280px] px-8 pt-6">
        <div className="flex gap-10">

            {/* Left Panel*/}
            <LeftFormPanel/>
          
            {/* Middle Panel */}
            <CoverPreviewPanel/>

            {/* Right Panel */}
            <ActionPanel/>    
        </div>
      </div>
    </div>
  );
}
