import React from "react";
import { ScanSearch } from "lucide-react";

export const RecentScans = ({ scans }: { scans: any[] }) => {
  return (
    <div className="bg-backgroundLight rounded-2xl p-4">
      <div className="my-4">
        {scans.length === 0 ? (
          <div className="text-center py-10">
            <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-primary/10 flex items-center justify-center">
              <ScanSearch />
            </div>
            <h3 className="text-white font-medium mb-1">No Recent Scans</h3>
            <p className="text-gray-400 text-sm">
              Scan products to see them here
            </p>
          </div>
        ) : (
          scans.map((scan) => (
            <div
              key={scan.id}
              className="flex items-center justify-between p-4 bg-background/40 rounded-xl hover:bg-background/60 transition-all duration-300 gap-8"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-2 h-2 rounded-full ${
                    scan.product.ecoScore > 50 ? "bg-[#22C55E]" : "bg-red-500"
                  }`}
                />
                <div>
                  <h3 className="text-white text-sm font-medium">
                    {scan.product.name}
                  </h3>
                  <span className="text-gray-400 text-xs">
                    {getTimeAgo(scan.scannedAt)}
                  </span>
                </div>
              </div>

              <div className="flex items-center">
                {scan.product.ecoScore > 50 ? (
                  <div className="text-[#22C55E] flex items-center gap-1">
                    <span>+{scan.product.ecoScore}</span>
                    <svg
                      className="w-4 h-4"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                    </svg>
                  </div>
                ) : (
                  <button className="text-[#22C55E] text-sm hover:text-[#22C55E]/80">
                    Claim Points
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const getTimeAgo = (date: Date) => {
  const now = new Date();
  const scanDate = new Date(date);
  const diffDays = Math.floor(
    (now.getTime() - scanDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  return `${diffDays} days ago`;
};
