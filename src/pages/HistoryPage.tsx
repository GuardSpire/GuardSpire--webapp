import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import axios from 'axios';

interface HistoryItem {
  input: string;
  status: string;
  threatLevel: string;
  timestamp: string;
  description: string;
  threatCategory?: string;
  scan_id: string;
  threatPercentage: number;
  label: string;
}

const HistoryPage = () => {
  const navigate = useNavigate();
  const [historyData, setHistoryData] = useState<HistoryItem[]>([]);
  const [selectedFilter, setSelectedFilter] = useState('All');

  useEffect(() => {
    const fetchHistory = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get('http://localhost:5000/api/scan/history', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const parsed: HistoryItem[] = (response.data.history || []).map((item: any) => {
          const rawConfidence = item.confidence ?? item.threatPercentage ?? 0;
          const threatPercentage =
            typeof rawConfidence === 'string'
              ? parseFloat(rawConfidence.replace('%', '')) || 0
              : rawConfidence <= 1
              ? rawConfidence * 100
              : rawConfidence;

          const threatCategory = (item.threatCategory || item.threatLevel || 'legitimate').toLowerCase();
          let label = 'Legitimate';
          if (threatCategory === 'critical') label = 'Scam Alert';
          else if (threatCategory === 'suspicious') label = 'Potential Threat';

          return {
            ...item,
            scan_id: item.scan_id || item._id,
            threatPercentage,
            threatCategory,
            label,
          };
        });

        setHistoryData(parsed.reverse());
      } catch (err) {
        console.error('Error fetching history:', err);
      }
    };

    fetchHistory();
  }, []);

  const filterOptions = ['All', 'Daily', 'Monthly', 'Yearly'];

  const filteredData = historyData.filter((item) => {
    if (selectedFilter === 'All') return true;

    const itemDate = new Date(item.timestamp);
    const now = new Date();

    if (selectedFilter === 'Daily') {
      return itemDate.toDateString() === now.toDateString();
    }

    if (selectedFilter === 'Monthly') {
      return itemDate.getMonth() === now.getMonth() && itemDate.getFullYear() === now.getFullYear();
    }

    if (selectedFilter === 'Yearly') {
      return itemDate.getFullYear() === now.getFullYear();
    }

    return true;
  });

  const handleNavigate = (item: HistoryItem) => {
    navigate('/report', { state: { scan: { ...item, scanId: item.scan_id } } });
  };

  return (
    <div className="historypg-container">
      <Sidebar />
      <div className="historypg-content">
        <Header />

        <h2 className="historypg-section-title">Recent History</h2>
        <div className="historypg-card">
          {historyData.slice(0, 3).map((item, index) => (
            <div key={index} className="historypg-row" onClick={() => handleNavigate(item)}>
              <p className="historypg-text">{item.label}</p>
              <p className="historypg-percentage">{Math.round(item.threatPercentage)}%</p>
            </div>
          ))}
        </div>

        <h2 className="historypg-section-title">Past History</h2>

        <div className="historypg-tabs">
          {filterOptions.map((filter) => (
            <button
              key={filter}
              className={`historypg-tab ${selectedFilter === filter ? 'active' : ''}`}
              onClick={() => setSelectedFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="historypg-card wide">
          {filteredData.map((item, index) => (
            <div key={index} className="historypg-row" onClick={() => handleNavigate(item)}>
              <p className="historypg-text">{item.label}</p>
              <p className="historypg-percentage">{Math.round(item.threatPercentage)}%</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HistoryPage;
