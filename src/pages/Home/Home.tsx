import { useEffect } from 'react';

const Home = () => {
  useEffect(() => {
    // 콘솔에서 폰트 확인용
    const checkFont = () => {
      const bodyFont = getComputedStyle(document.body).fontFamily;
      console.log('현재 적용된 폰트:', bodyFont);
      
      
      if (bodyFont.includes('Pretendard JP')) {
        console.log('✅ Pretendard JP 폰트가 적용되었습니다!');
      } else {
        console.log('❌ Pretendard JP 폰트가 적용되지 않았습니다.');
        console.log('적용된 폰트:', bodyFont);
      }
    };
    
    checkFont();
  }, []);

  return (
    <div className="p-6">
      <div className="bg-yellow-50 border-2 border-yellow-400 rounded-lg p-4 mb-6">
        <h2 className="text-lg font-bold text-yellow-800 mb-2">⚠️ 개발자 메모</h2>
        <p className="text-yellow-900 font-semibold">
          완전 초기 셋팅입니다.
        </p>
        <p className="text-yellow-900 font-semibold mt-2">
          위에 bar나 모두 다 수정 진행 필수입니다!!
        </p>
      </div>
      
      <h1 className="text-2xl font-bold mb-6">메인 페이지</h1>
      <p style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '20px' }}>
        폰트 확인용 텍스트
      </p>
      <p style={{ fontSize: '14px', color: '#666', marginTop: '10px' }}>
        개발자 도구(F12) → Console 탭에서 폰트 확인 메시지를 확인하세요
      </p>
      {/* 메인 페이지 구현 */}
    </div>
  );
};

export default Home;
