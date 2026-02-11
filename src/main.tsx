import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import "./index.css";
import App from "./App";

function Root() {
  // QueryClient를 컴포넌트 내부에서 생성하여 React 19 호환성 문제 해결
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 30, // 30분간 캐시 유지 (기본값)
            gcTime: 1000 * 60 * 60, // 1시간간 가비지 컬렉션 방지
            refetchOnWindowFocus: false, // 창 포커스 시 자동 리패치 비활성화
            refetchOnMount: false, // 마운트 시 리패치 비활성화 (캐시 우선)
            refetchOnReconnect: false, // 재연결 시 리패치 비활성화
            retry: 1,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

const rootElement = document.getElementById("root");

if (rootElement) {
  createRoot(rootElement).render(<Root />);
}
