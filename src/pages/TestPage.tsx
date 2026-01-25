import { useState } from 'react';
import {
  editEvent,
  getEvent,
  deleteEvent,
  voteEventParticipation,
  getEventParticipation,
} from '../api/eventInfo';
import {
  getEventAnalysis,
  startSession,
  endSession,
} from '../api/analysis';

const TestPage = () => {
  const [sessionId, setSessionId] = useState<string>('');

  // 테스트용 더미 데이터
  const testEventId = 123;
  const testUserId = 'user_123';

  const testEditEvent = async () => {
    console.log('=== 행사 수정 테스트 ===');
    try {
      const result = await editEvent(testEventId, {
        capacity: 8,
        title: '테스트 행사',
      });
      console.log('✅ 행사 수정 성공:', result);
    } catch (error) {
      console.error('❌ 행사 수정 실패:', error);
    }
  };

  const testGetEvent = async () => {
    console.log('=== 행사 조회 테스트 ===');
    try {
      const result = await getEvent(testEventId);
      console.log('✅ 행사 조회 성공:', result);
    } catch (error) {
      console.error('❌ 행사 조회 실패:', error);
    }
  };

  const testDeleteEvent = async () => {
    console.log('=== 행사 삭제 테스트 ===');
    try {
      const result = await deleteEvent(testEventId);
      console.log('✅ 행사 삭제 성공:', result);
    } catch (error) {
      console.error('❌ 행사 삭제 실패:', error);
    }
  };

  const testVoteEventParticipation = async () => {
    console.log('=== 행사 참여 여부 투표 테스트 ===');
    try {
      const result = await voteEventParticipation(
        testEventId,
        testUserId,
        '참여!'
      );
      console.log('✅ 행사 참여 여부 투표 성공:', result);
    } catch (error) {
      console.error('❌ 행사 참여 여부 투표 실패:', error);
    }
  };

  const testGetEventParticipation = async () => {
    console.log('=== 행사 참여 여부 조회 테스트 ===');
    try {
      const result = await getEventParticipation(testEventId);
      console.log('✅ 행사 참여 여부 조회 성공:', result);
    } catch (error) {
      console.error('❌ 행사 참여 여부 조회 실패:', error);
    }
  };

  const testGetEventAnalysis = async () => {
    console.log('=== 통계값 획득 테스트 ===');
    try {
      const result = await getEventAnalysis(testEventId);
      console.log('✅ 통계값 획득 성공:', result);
    } catch (error) {
      console.error('❌ 통계값 획득 실패:', error);
    }
  };

  const testStartSession = async () => {
    console.log('=== 세션 시작 테스트 ===');
    try {
      const result = await startSession(testEventId);
      console.log('✅ 세션 시작 성공:', result);
      if (result.success && result.data?.sessionId) {
        setSessionId(result.data.sessionId);
        console.log('📝 세션 ID 저장:', result.data.sessionId);
      }
    } catch (error) {
      console.error('❌ 세션 시작 실패:', error);
    }
  };

  const testEndSession = async () => {
    console.log('=== 세션 종료 테스트 ===');
    if (!sessionId) {
      console.warn('⚠️ 세션 ID가 없습니다. 먼저 세션을 시작해주세요.');
      return;
    }
    try {
      const result = await endSession(testEventId, sessionId);
      console.log('✅ 세션 종료 성공:', result);
    } catch (error) {
      console.error('❌ 세션 종료 실패:', error);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">API 테스트 페이지</h1>
      <p className="text-gray-600 mb-8">
        각 버튼을 클릭하면 API가 호출되고 콘솔에 결과가 출력됩니다.
        <br />
        <span className="text-sm">
          (F12 개발자 도구 → Console 탭에서 확인)
        </span>
      </p>

      <div className="space-y-6">
        {/* eventInfo.ts API 테스트 */}
        <section className="border p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">📋 eventInfo.ts API</h2>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={testGetEvent}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              1. 행사 조회 (GET)
            </button>
            <button
              onClick={testEditEvent}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              2. 행사 수정 (PATCH)
            </button>
            <button
              onClick={testDeleteEvent}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              3. 행사 삭제 (DELETE)
            </button>
            <button
              onClick={testVoteEventParticipation}
              className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
            >
              4. 참여 여부 투표 (PUT)
            </button>
            <button
              onClick={testGetEventParticipation}
              className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 col-span-2"
            >
              5. 참여 여부 조회 (GET)
            </button>
          </div>
        </section>

        {/* analysis.ts API 테스트 */}
        <section className="border p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">📊 analysis.ts API</h2>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={testGetEventAnalysis}
              className="px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600"
            >
              1. 통계값 획득 (GET)
            </button>
            <button
              onClick={testStartSession}
              className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
            >
              2. 세션 시작 (POST)
            </button>
            <button
              onClick={testEndSession}
              className="px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600"
              disabled={!sessionId}
            >
              3. 세션 종료 (PATCH)
            </button>
          </div>
          {sessionId && (
            <p className="mt-2 text-sm text-gray-600">
              현재 세션 ID: <code className="bg-gray-100 px-2 py-1 rounded">{sessionId}</code>
            </p>
          )}
        </section>
      </div>
    </div>
  );
};

export default TestPage;
