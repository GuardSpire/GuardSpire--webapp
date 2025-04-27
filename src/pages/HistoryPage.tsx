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
  type?: string; // ✅ added optional type
  percentage: number;
  dateLabel: string;
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
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const parsed = response.data.history.map((item: any) => {
          let percentage = 0;
          const level = item.threatLevel?.toLowerCase();
          if (level === 'critical') percentage = 100;
          else if (level === 'suspicious') percentage = 60;
          else if (level === 'stable') percentage = 0;

          const date = new Date(item.timestamp);
          const today = new Date();
          let label = 'Other';
          if (date.toDateString() === today.toDateString()) {
            label = 'Monthly';
          } else if (date.getMonth() === today.getMonth()) {
            label = 'Monthly';
          } else if (date.getFullYear() === today.getFullYear()) {
            label = 'Yearly';
          }

          return {
            ...item,
            percentage,
            dateLabel: label,
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
    if (selectedFilter === 'Daily') return item.dateLabel === 'Monthly';
    if (selectedFilter === 'Monthly') return item.dateLabel === 'Monthly';
    if (selectedFilter === 'Yearly') return item.dateLabel === 'Yearly';
    return true;
  });

  const handleNavigate = (item: HistoryItem) => {
    navigate('/report', { state: { scan: item } }); // ✅ Pass clicked scam
  };

  return (
    <div className="historypg-container">
      <Sidebar />
      <div className="historypg-content">
        <Header />

        <h2 className="historypg-section-title">Recent History</h2>
        <div className="historypg-card">
          {historyData.slice(0, 5).map((item, index) => (
            <div key={index} className="historypg-row" onClick={() => handleNavigate(item)}>
              <p className="historypg-text">{item.type || item.input}</p>
              <p className="historypg-percentage">{item.percentage}%</p>
            </div>
          ))}
        </div>


        <h2 className="historypg-section-title">Past History</h2>

        <div className="historypg-tabs">
          {filterOptions.map(filter => (
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
              <p className="historypg-text">{item.type || item.input}</p> {/* ✅ updated */}
              <p className="historypg-percentage">{item.percentage}%</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HistoryPage;
