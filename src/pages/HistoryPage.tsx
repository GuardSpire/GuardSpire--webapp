import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';

const HistoryPage = () => {
  const navigate = useNavigate();
  const [selectedFilter, setSelectedFilter] = useState('All');

  const historyData = [
    { id: 1, type: 'Phishing Attack', percentage: '100%', date: 'Today' },
    { id: 2, type: 'Job Scam', percentage: '85%', date: 'Today' },
    { id: 3, type: 'Sampath Bank', percentage: '60%', date: 'Today' },
    { id: 4, type: 'Phishing Attack', percentage: '100%', date: 'March 12' },
    { id: 5, type: 'Job Scam', percentage: '85%', date: 'March 10' },
    { id: 6, type: 'Sampath Bank', percentage: '60%', date: 'March 9' },
    { id: 7, type: 'Phishing Attack', percentage: '100%', date: 'Feb 28' },
    { id: 8, type: 'Job Scam', percentage: '85%', date: 'Jan 15' },
  ];

  const filterOptions = ['All', 'Daily', 'Weekly', 'Monthly', 'Yearly'];

  const filteredData = historyData.filter((item) => {
    if (selectedFilter === 'All') return true;
    if (selectedFilter === 'Daily') return item.date === 'Today';
    if (selectedFilter === 'Weekly') return item.date.includes('March');
    if (selectedFilter === 'Monthly') return item.date.includes('Feb');
    if (selectedFilter === 'Yearly') return item.date.includes('Jan');
    return true;
  });

  const handleNavigate = () => navigate('/report');

  return (
    <div className="historypg-container">
      <Sidebar />
      <div className="historypg-content">
        <Header />

        <h2 className="historypg-section-title">Recent History</h2>
        <div className="historypg-card">
          {historyData.filter(item => item.date === 'Today').map(item => (
            <div key={item.id} className="historypg-row" onClick={handleNavigate}>
              <p className="historypg-text">{item.type}</p>
              <p className="historypg-percentage">{item.percentage}</p>
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
          {filteredData.map(item => (
            <div key={item.id} className="historypg-row" onClick={handleNavigate}>
              <p className="historypg-text">{item.type}</p>
              <p className="historypg-percentage">{item.percentage}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HistoryPage;
