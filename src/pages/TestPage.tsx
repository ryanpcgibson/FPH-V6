import React from "react";

const rows = 7;
const cols = 7;

const TestPage: React.FC = () => {
  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <div className="w-[600px] h-[200px] border border-gray-300 flex overflow-hidden">
        <div className="flex-grow overflow-auto relative">
          <div className="flex">
            <div className="flex-grow">
              <div className="flex sticky top-0 z-10 bg-gray-100">
                {[...Array(cols)].map((_, i) => (
                  <div
                    key={`col-${i}`}
                    className="w-20 h-[30px] flex items-center justify-center font-bold border border-gray-300"
                  >
                    {String.fromCharCode(65 + i)}
                  </div>
                ))}
              </div>
              {[...Array(rows)].map((_, rowIndex) => (
                <div key={`row-${rowIndex}`} className="flex">
                  {[...Array(cols)].map((_, colIndex) => (
                    <div
                      key={`cell-${rowIndex}-${colIndex}`}
                      className="w-20 h-[30px] flex items-center justify-center border border-gray-300 bg-white"
                    >
                      {String.fromCharCode(65 + colIndex)}
                      {rowIndex + 1}
                    </div>
                  ))}
                </div>
              ))}
            </div>
            <div className="sticky right-0 z-20 bg-gray-100 flex flex-col">
              {/* Fixed HC cell */}
              <div className="sticky top-0 w-20 h-[30px] flex items-center justify-center font-bold border border-gray-300 bg-white z-30">
                HC
              </div>
              {[...Array(rows)].map((_, i) => (
                <div
                  key={`header-${i}`}
                  className="w-20 h-[30px] flex items-center justify-center border border-gray-300 bg-white"
                >
                  H{i + 1}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestPage;
