/**
 * MinIO 내부 URL을 외부 접근 가능한 URL로 변환
 * 백엔드가 내부 도메인명(onmoim-minio:9000)을 반환하는 경우를 처리
 * 
 * 주의: 서명된 URL(Signed URL)의 경우 호스트를 변경하면 서명이 무효화되므로 변환하지 않음
 */

const MINIO_INTERNAL_HOST = 'onmoim-minio:9000';
const MINIO_EXTERNAL_HOST = '168.138.41.19:9000';

/**
 * 이미지 URL이 내부 MinIO URL인 경우 외부 접근 가능한 URL로 변환
 * 
 * 서명된 URL(Signed URL)의 경우 호스트 변경 시 서명이 무효화되므로 변환하지 않음
 * 백엔드에서 외부 접근 가능한 호스트명으로 서명된 URL을 생성해야 함
 * 
 * @param url 원본 이미지 URL
 * @returns 변환된 이미지 URL (서명된 URL인 경우 변환하지 않음)
 */
export const convertImageUrl = (url: string | null | undefined): string => {
  if (!url) return '';
  
  // 서명된 URL인지 확인 (X-Amz-Signature 파라미터가 있으면 서명된 URL)
  const isSignedUrl = url.includes('X-Amz-Signature=') || url.includes('X-Amz-Algorithm=');
  
  // 서명된 URL인 경우 변환하지 않음 (서명이 무효화됨)
  // 백엔드에서 외부 접근 가능한 호스트명으로 서명된 URL을 생성해야 함
  if (isSignedUrl) {
    console.warn('[ImageURLConverter] 서명된 URL은 변환할 수 없습니다. 백엔드에서 외부 호스트명으로 서명된 URL을 생성해야 합니다:', url);
    return url;
  }
  
  // 일반 URL인 경우에만 변환
  if (url.includes(MINIO_INTERNAL_HOST)) {
    return url.replace(MINIO_INTERNAL_HOST, MINIO_EXTERNAL_HOST);
  }
  
  return url;
};
