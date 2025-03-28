import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';

const Sidebar: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const sidebarRef = useRef<HTMLDivElement>(null);
  const { setIsOpen, setPosition } = useSettings();

  const handleSettingsClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const icon = e.currentTarget.querySelector('img');
    if (!icon) return;

    const iconRect = icon.getBoundingClientRect();
    const popupHeight = 550;
    const spaceBelow = window.innerHeight - iconRect.bottom;
    const top = spaceBelow > popupHeight
      ? iconRect.top
      : iconRect.top - popupHeight + 40;

    const left = iconRect.right + 12;

    setPosition({
      top: Math.max(10, top),
      left: Math.max(10, left),
      anchor: 'sidebar',
    });

    setIsOpen(true);
    setDrawerOpen(false);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (drawerOpen && sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setDrawerOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [drawerOpen]);

  return (
    <>
      <div ref={sidebarRef} className={`sidebar ${drawerOpen ? 'open' : ''}`}>
        <div className="menu">
          <div className="menu-item" onClick={() => setDrawerOpen(!drawerOpen)}>
            <img src="src/assets/dashboard.png" alt="Dashboard" className="menu-icon" />
            {drawerOpen && <p onClick={() => navigate('/')}>Dashboard</p>}
          </div>
          <div className="menu-item" onClick={() => setDrawerOpen(!drawerOpen)}>
            <img src="src/assets/msg-url-scan.png" alt="Msg & URL Scanner" className="menu-icon" />
            {drawerOpen && <p onClick={() => navigate('/')}>Msg & URL Scanner</p>}
          </div>
          <div className="menu-item" onClick={() => setDrawerOpen(!drawerOpen)}>
            <img src="src/assets/report.png" alt="Report" className="menu-icon" />
            {drawerOpen && <p onClick={() => navigate('/report')}>Report</p>}
          </div>
          <div className="menu-item" onClick={() => setDrawerOpen(!drawerOpen)}>
            <img src="src/assets/history.png" alt="History" className="menu-icon" />
            {drawerOpen && <p onClick={() => navigate('/history')}>History</p>}
          </div>
        </div>

        <div className="menu-bottom">
          <div className="menu-item" onClick={handleSettingsClick}>
            <img src="src/assets/setting.png" alt="Settings" className="menu-icon" />
            {drawerOpen && <p>Settings</p>}
          </div>
          <div className="menu-item" onClick={() => setDrawerOpen(!drawerOpen)}>
            <img src="src/assets/logout.png" alt="Logout" className="menu-icon" />
            {drawerOpen && <p onClick={() => navigate('/logout')}>Logout</p>}
          </div>
        </div>
      </div>

      {drawerOpen && <div className="overlay" onClick={() => setDrawerOpen(false)}></div>}
    </>
  );
};

export default Sidebar;
