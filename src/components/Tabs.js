import React, { useState } from "react";

const Tabs = ({ tabs }) => {
  const [active, setActive] = useState(0);
  return (
    <div className="tabs-container">
      <div className="tabs-header">
        {tabs.map((tab, i) => (
          <button
            key={tab.label}
            className={i === active ? "tab-btn active" : "tab-btn"}
            onClick={() => setActive(i)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="tabs-content">
        {tabs[active].content}
      </div>
    </div>
  );
};

export default Tabs;
