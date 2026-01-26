import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">메인 페이지</h1>
      <div className="flex gap-4">
        <button
          onClick={() => navigate('/test')}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          🧪 TestPage Kaya
        </button>
        <button
          onClick={() => navigate('/test-other')}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          🧪 TestPage
        </button>
      </div>
    </div>
  );
};

export default Home;
