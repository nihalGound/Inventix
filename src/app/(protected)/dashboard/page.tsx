import React from "react";
import StatsCard from "./_components/StatsCard";
import { AlertTriangle, CircleDollarSign, Clipboard, Package } from "lucide-react";

function Dashboard() {
  // call getBusinessAnalytics()
  const data = {
    totalSales: 32621,
    totalProducts: 2451,
    totalOrders: 64,
  };
  return (
    <div className="h-full w-full p-6 flex flex-col items-start gap-y-3">
      <div className="flex gap-y-2 items-start flex-col mb-2">
        <h2 className="text-white text-2xl capitalize font-bold">
          Dashboard Overview
        </h2>
        <span className="text-[#a3a3a3] text-lg">Welcome Back, Admin</span>
      </div>
      {/* //stats card  */}
      <div className="w-full gap-2 grid md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          icon={
            <div className="flex items-center justify-center text-center bg-[#2e384e] p-2 rounded-lg">
              <Package className="text-[#4e80ee]" size={28} />
            </div>
          }
          title="total Products"
          stats={data.totalProducts}
        />
        <StatsCard
          icon={
            <div className="flex items-center justify-center text-center bg-[#314533] p-2 rounded-lg">
              <CircleDollarSign className="text-[#5ec269]" size={28} />
            </div>
          }
          title="total Products"
          stats={data.totalProducts}
        />
        <StatsCard
          icon={
            <div className="flex items-center justify-center text-center bg-[#4a2e2d] p-2 rounded-lg">
              <AlertTriangle className="text-[#dd524b]" size={28} />
            </div>
          }
          title="total Products"
          stats={data.totalProducts}
        />
        <StatsCard
          icon={
            <div className="flex items-center justify-center text-center bg-[#a855f733] p-2 rounded-lg">
              <Clipboard className="text-[#a855f7]" size={28} />
            </div>
          }
          title="total Products"
          stats={data.totalProducts}
        />
      </div>

      {/* graph overview  */}
      <div className="flex flex-col lg:flex-row gap-x-2">
          <div>
            
          </div>
          <div>
            
          </div>
      </div>
    </div>
  );
}

export default Dashboard;
