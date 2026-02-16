import { useEffect, useState } from "react";

/**
 * useDebounce hook
 * 입력값의 변경을 지연시켜 API 호출 횟수를 줄입니다.
 *
 * @param value - debounce할 값
 * @param delay - 지연 시간 (ms)
 * @returns debounced된 값
 */
export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // delay 후에 debouncedValue 업데이트
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // value가 변경되면 이전 timeout을 취소
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
