import { ScanResult } from "@/types/scan";
import { Award, CheckCircle, Receipt, XCircle } from "lucide-react";

export const ResultModal: React.FC<{
  result: ScanResult;
  onClose: () => void;
  onScanReceipt: () => void;
}> = ({ result, onClose, onScanReceipt }) => {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
      <div className="bg-backgroundLight rounded-3xl w-full max-w-sm overflow-hidden">
        <div
          className={`p-6 ${
            result.isEcoFriendly ? "bg-[#4ADE80]" : "bg-red-500"
          }`}
        >
          <div className="flex items-center gap-3">
            {result.isEcoFriendly ? (
              <CheckCircle className="w-8 h-8 text-black" />
            ) : (
              <XCircle className="w-8 h-8 text-white" />
            )}
            <div>
              <h2 className="text-black text-lg font-medium">
                {result.isEcoFriendly
                  ? "Eco-Friendly Product"
                  : "Not Eco-Friendly"}
              </h2>
              <p className="text-black/70 text-sm">
                Eco Score: {result.score}/100
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div className="space-y-2">
            <h3 className="text-white text-sm font-medium">
              Analysis Results:
            </h3>
            {result.reasons.map((reason, index) => (
              <div
                key={index}
                className="bg-backgroundDark rounded-xl p-3 text-[#6B7280] text-sm"
              >
                {reason}
              </div>
            ))}
          </div>

          {result.isEcoFriendly && (
            <div className="bg-backgroundDark rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-[#4ADE80]" />
                  <span className="text-white text-sm font-medium">
                    Potential Points
                  </span>
                </div>
                <span className="text-[#4ADE80] font-bold">
                  +{result.potentialPoints}
                </span>
              </div>
              <button
                onClick={onScanReceipt}
                className="w-full bg-[#4ADE80] text-black font-medium py-2.5 px-4 rounded-lg flex items-center justify-center gap-2"
              >
                <Receipt className="w-4 h-4" />
                Scan Receipt to Claim Points
              </button>
            </div>
          )}

          <button
            onClick={onClose}
            className="w-full bg-[#374151] text-white py-2.5 px-4 rounded-lg"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
