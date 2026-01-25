import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">메인 페이지</h1>
      <button
        onClick={() => navigate('/test')}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        🧪 API 테스트 페이지로 이동
      </button>
    </div>
  );
};

export default Home;
