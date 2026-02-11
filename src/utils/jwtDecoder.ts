/** JWT 토큰에서 userId 추출 */
export const getUserIdFromToken = (): number | null => {
  try {
    const token = localStorage.getItem("accessToken");
    if (!token) return null;

    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const payload = parts[1];
    const decoded = JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
    
    return decoded.userId || decoded.sub || decoded.id || null;
  } catch (error) {
    console.warn("[JWT] 토큰 디코딩 실패:", error);
    return null;
  }
};
