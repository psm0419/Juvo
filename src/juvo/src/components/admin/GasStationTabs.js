import React from 'react';

function GasStationTabs({ activeTab, handleTabChange }) {
    const tabs = [
        { id: 'all', label: '전체' },
        { id: '용도외판매', label: '용도외판매' },
        { id: '품질기준부적합', label: '품질기준부적합' },
        { id: '가짜석유취급', label: '가짜석유취급' },
        { id: '정량미달판매', label: '정량미달판매' },
    ];

    return (
        <div className="tabButtons">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    className={activeTab === tab.id ? 'active' : ''}
                    onClick={() => handleTabChange(tab.id)}
                >
                    {tab.label}
                </button>
            ))}
        </div>
    );
}

export default GasStationTabs;