import React from "react";

const Stat = ({ label, value, accent = false }) => {
  return (
    <div className="text-center min-w-[60px]">
      
      {/* Value */}
      <div
        className="text-2xl font-bold"
        style={{
          color: accent ? "#F5C518" : "#E5E2E1",
          letterSpacing: "-0.02em",
        }}
      >
        {value ?? 0}
      </div>

      {/* Label */}
      <div
        className="text-[10px] uppercase tracking-widest mt-1"
        style={{
          color: "#9a9078",
          letterSpacing: "0.08em",
        }}
      >
        {label}
      </div>
    </div>
  );
};

export default Stat;