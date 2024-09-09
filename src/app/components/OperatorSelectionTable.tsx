"use client";
import React, { useState, useEffect } from "react";
import UpArrow2 from "../assets/UpArrow2-New.png";
import DownArrow2 from "../assets/DownArrow2.png";
import UpDownArrow from "../assets/UpDownArrow.png";
import { toast, Toaster } from "react-hot-toast";
import "../css/OperatorSelectionTable.css";
import UploadKeystoreData from "./UploadKeystoreData";
import Image from "next/image";
import icon from "../assets/icon.png";

// Define the type for an operator
interface Operator {
  id: number;
  pubkey: string;
  name: string;
  validators: number;
  performance: string;
  yearlyFee: string;
  mev: number;
  image: string;
}

export default function OperatorSelectionTable() {
  const [operators, setOperators] = useState<Operator[]>([]);
  const [selectedOperators, setSelectedOperators] = useState<Operator[]>([]);
  const [showKeystoreUpload, setShowKeystoreUpload] = useState(false);
  const [clusterSize, setClusterSize] = useState<number>(4);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Operator;
    direction: "ascending" | "descending" | null;
  }>({
    key: "id",
    direction: null,
  });
  const [parsedPayload, setParsedPayload] = useState<{
    publicKey: string;
    operatorIds: number[];
    operatorKeys: string[];
    sharesData: string;
    totalFee: number;
    networkFee: number;
  }>({
    publicKey: "",
    operatorIds: [],
    operatorKeys: [],
    sharesData: "",
    totalFee: 0,
    networkFee: 0,
  });

  const [loading, setLoading] = useState(true);

  const [totalFee, setTotalFee] = useState<number>(0);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [operatorsPerPage] = useState(10);

  useEffect(() => {
    if (selectedOperators.length > clusterSize) {
      // If selected operators exceed the new cluster size, trim the list
      setSelectedOperators(selectedOperators.slice(0, clusterSize));
    }
  }, [clusterSize]);

  useEffect(() => {
    const fetchOperators = async () => {
      try {
        const response = await fetch(
          "https://api.ssv.network/api/v4/holesky/operators/graph?page=1&perPage=1000",
          {
            headers: {
              accept: "*/*", // Optional, can be omitted
            },
          }
        );
        const data = await response.json();

        if (data.operators && Array.isArray(data.operators)) {
          const transformedOperators = data.operators.map((op: any) => ({
            id: op.id,
            pubkey: op.public_key,
            name: op.name,
            validators: 0,
            performance: `${op.performance["30d"].toFixed(2)}%`,
            yearlyFee: `${(parseInt(op.fee) / 1e9).toFixed(2)} SSV`,
            mev: 0,
            image: op.logo,
          }));

          setOperators(transformedOperators);
        } else {
          console.error("Invalid response structure:", data);
        }
      } catch (error) {
        console.error("Failed to fetch operators:", error);
      } finally {
        setLoading(false); // Set loading to false when data is fetched or on error
      }
    };

    fetchOperators();
  }, []);

  const calculateTotalFee = (selectedOps: Operator[]) => {
    const total = selectedOps.reduce(
      (sum, op) => sum + parseInt(op.yearlyFee.split(" ")[0]),
      0
    );
    const opertorIds = selectedOps.map((op) => op.id);
    const operatorKeys = selectedOps.map((op) => op.pubkey);

    setTotalFee(total);
  
    const paersedPayload = {
      publicKey: "",
      operatorIds: opertorIds,
      operatorKeys: operatorKeys,
      sharesData: "",
      totalFee: total,
      networkFee: 0,
    };

    setParsedPayload(paersedPayload);
    // console.log("Parsed Payload:", paersedPayload);
  };

  const handleRowSelection = (operator: Operator) => {
    setSelectedOperators((prev) => {
      let updatedOperators;
      if (prev.find((op) => op.id === operator.id)) {
        updatedOperators = prev.filter((op) => op.id !== operator.id);
      } else if (prev.length < clusterSize) {
        updatedOperators = [...prev, operator];
      } else {
        updatedOperators = prev;
      }

      calculateTotalFee(updatedOperators); // Calculate fee whenever selection changes
      return updatedOperators;
    });
  };

  const handleSort = (key: keyof Operator) => {
    let direction: "ascending" | "descending" = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }

    setSortConfig({ key, direction });
  };

  const renderSortIcon = (key: keyof Operator) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === "ascending" ? (
        <Image src={DownArrow2} alt="Descending" width={20} height={20} />
      ) : (
        <Image src={UpArrow2} alt="Ascending" width={20} height={20} />
      );
    }
    return <Image src={UpDownArrow} alt="Default" width={20} height={20} />; // Default unsorted state
  };

  // Apply search filter and sorting
  const filteredAndSortedOperators = [...operators]
    .filter((operator) =>
      operator.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (!sortConfig.direction) return 0;

      const { key, direction } = sortConfig;
      if (a[key] < b[key]) {
        return direction === "ascending" ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return direction === "ascending" ? 1 : -1;
      }
      return 0;
    });

  // Get current operators
  const indexOfLastOperator = currentPage * operatorsPerPage;
  const indexOfFirstOperator = indexOfLastOperator - operatorsPerPage;
  const currentOperators = filteredAndSortedOperators.slice(
    indexOfFirstOperator,
    indexOfLastOperator
  );

  // Calculate total pages
  const totalPages = Math.ceil(
    filteredAndSortedOperators.length / operatorsPerPage
  );

  // Change page
  const nextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const prevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleKeystoreUpload = () => {
    setShowKeystoreUpload(true);
  };

  // Function to go back to the operator selection table
  const goBackToOperatorSelection = () => {
    setShowKeystoreUpload(false);
  };

  if (showKeystoreUpload) {
    return <UploadKeystoreData goBack={goBackToOperatorSelection} parsedPayload={parsedPayload} />;
  }

  return (
    <div className="operator-selection-container z-10">
      <div className="table-container">
        <h1 className="text-2xl font-semibold">Select Operators</h1>
        <div className="flex justify-between items-center">
          <h2>Pick the cluster of network operators to run your validator</h2>
          <div className="cluster-size-selector">
            {[4, 7, 10, 13].map((size) => (
              <button
                key={size}
                onClick={() => setClusterSize(size)}
                style={{
                  border: "1px solid transparent",
                  borderImage:
                    "linear-gradient(to right, #A257EC 0% , #DA619C 60%)",
                  borderImageSlice: 1,
                  color: "white",
                  background:
                    "linear-gradient(to right, #121212 0%, #252525 60%)",
                }}
                className={clusterSize === size ? "active" : ""}
              >
                <span className="text-white">{size}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="search-filter">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <span className="search-icon">🔍</span>
          </div>
        </div>
        <div
          className={`operator-table ${operators.length > 4 ? "scroll" : ""}`}
        >
          <table>
            <thead>
              <tr className="border border-gray-500">
                <th className=""></th>
                <th className="cursor-pointer" onClick={() => handleSort("id")}>
                  <span className="flex items-center gap-2">
                    ID {renderSortIcon("id")}
                  </span>
                </th>
                <th
                  className="cursor-pointer"
                  onClick={() => handleSort("name")}
                >
                  <span className="flex items-center gap-2 ml-[2rem]">
                    Name {renderSortIcon("name")}
                  </span>
                </th>
                <th
                  className="cursor-pointer"
                  onClick={() => handleSort("validators")}
                >
                  <span className="flex items-center gap-2">
                    Validators {renderSortIcon("validators")}
                  </span>
                </th>
                <th
                  className="cursor-pointer"
                  onClick={() => handleSort("performance")}
                >
                  <span className="flex items-center gap-2">
                    30d performance {renderSortIcon("performance")}
                  </span>
                </th>
                <th
                  className="cursor-pointer"
                  onClick={() => handleSort("yearlyFee")}
                >
                  <span className="flex items-center gap-2">
                    Yearly Fee {renderSortIcon("yearlyFee")}
                  </span>
                </th>
                <th
                  className="cursor-pointer"
                  onClick={() => handleSort("mev")}
                >
                  <span className="flex items-center gap-2">
                    MEV {renderSortIcon("mev")}
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              {loading
                ? // Render 10 skeleton loaders when data is being fetched
                  Array(15)
                    .fill(null)
                    .map((_, index) => (
                      <tr key={index} className="animate-pulse">
                        {/* Checkbox */}
                        <td>
                          <div className="bg-gray-300 h-5 w-5 rounded"></div>
                        </td>
                        {/* ID */}
                        <td>
                          <div className="bg-gray-300 h-5 w-8 rounded"></div>
                        </td>
                        {/* Name with Image */}
                        <td>
                          <div className="flex items-center">
                            <div className="bg-gray-300 h-6 w-6 rounded-full"></div>
                            <div className="bg-gray-300 h-5 w-24 rounded ml-2"></div>
                          </div>
                        </td>
                        {/* Validators */}
                        <td>
                          <div className="bg-gray-300 h-5 w-8 rounded"></div>
                        </td>
                        {/* 30d performance */}
                        <td>
                          <div className="bg-gray-300 h-5 w-16 rounded"></div>
                        </td>
                        {/* Yearly Fee */}
                        <td>
                          <div className="bg-gray-300 h-5 w-16 rounded"></div>
                        </td>
                        {/* MEV */}
                        <td>
                          <div className="bg-gray-300 h-5 w-8 rounded"></div>
                        </td>
                      </tr>
                    ))
                : currentOperators.map((operator) => (
                    <tr
                      key={operator.id}
                      onClick={() => handleRowSelection(operator)}
                      className="border border-gray cursor-none"
                    >
                      <td>
                        <input
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRowSelection(operator);
                          }}
                          type="checkbox"
                          className="mr-2 custom-checkbox"
                          checked={selectedOperators.some(
                            (op) => op.id === operator.id
                          )}
                          onChange={() => {}}
                        />
                      </td>
                      <td>{operator.id}</td>
                      <td>
                        <span
                          style={{
                            display: "inline-block",
                            verticalAlign: "middle",
                          }}
                        >
                          <Image
                            src={operator.image || icon}
                            alt=""
                            style={{
                              borderRadius: "20px",
                              padding: "3px",
                              border: "1px solid #A6A6A6",
                              background:
                                "linear-gradient(to right, #1d1d1d, #191919)",
                            }}
                            width={24}
                            height={24}
                          />
                        </span>
                        <span
                          style={{
                            display: "inline-block",
                            verticalAlign: "middle",
                            marginLeft: "8px",
                          }}
                        >
                          {operator.name}
                        </span>
                      </td>
                      <td>{operator.validators}</td>
                      <td>{operator.performance}</td>
                      <td>{operator.yearlyFee}</td>
                      <td>{operator.mev}</td>
                    </tr>
                  ))}
            </tbody>
          </table>
          {/* Pagination */}
          <div className="pagination flex items-center gap-2">
            <button
              onClick={prevPage}
              disabled={currentPage === 1}
              className="pagination-button"
            >
              Previous
            </button>
            <span className="pagination-info">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={nextPage}
              disabled={currentPage === totalPages}
              className="pagination-button"
            >
              Next
            </button>
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-between">
        <div className="selected-operators">
          <div className="mb-[6px] flex justify-between items-center">
            <div className="text-lg">Selected Operators</div>
            <div className="text-xl">
              {selectedOperators.length}/
              <span className="text-orange-400">{clusterSize}</span>
            </div>
          </div>

          <div
            className={`selected-operators ${
              selectedOperators.length > 4 ? "scroll" : ""
            }`}
          >
            {selectedOperators.map((operator, index) => (
              <div
                key={operator.id}
                className="relative p-[1px] rounded-lg bg-gradient-to-b from-[#A257EC] to-[#DA619C] mb-2"
              >
                <div className="flex items-center justify-center h-full w-full bg-[#161515] rounded-lg text-white py-3">
                  {operator.name} (Operator {String(index + 1).padStart(2, "0")}
                  )
                </div>
              </div>
            ))}
          </div>

          {Array(Math.max(clusterSize - selectedOperators.length, 0))
            .fill(null)
            .map((_, index) => (
              <div
                key={index}
                className="relative p-[1px] rounded-lg bg-gradient-to-b from-[#A257EC] to-[#DA619C] mb-2"
              >
                <div className="flex items-center justify-center h-full w-full bg-[#161515] rounded-lg text-white py-3">
                  Select Operator{" "}
                  {String(selectedOperators.length + index + 1).padStart(
                    2,
                    "0"
                  )}
                </div>
              </div>
            ))}
        </div>
        {/* Display the total fee */}
        <div className="total-fee">
          <div className="flex justify-between items-center mt-2 mb-1">
            <h4>Operators Yearly Fee:</h4>
            <p>
              <span className="text-orange-400">{totalFee}</span> SSV
            </p>
          </div>
          <button
            onClick={handleKeystoreUpload}
            style={{
              border: "1px solid transparent",
              borderImage: "linear-gradient(to right, #DA619C , #FF844A )",
              borderImageSlice: 1,
              background: "linear-gradient(to right, #DA619C, #FF844A)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
            className="w-full text-white py-[6px] px-4 rounded-[6px] focus:outline-none focus:ring-1 focus:ring-orange-600 focus:ring-opacity-50 font-bold"
          >
            Next
          </button>
        </div>
      </div>
      <style jsx>{`
        .custom-checkbox {
          appearance: none;
          -webkit-appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 4px;
          background: black;
          border: 2px solid transparent;
          background-image: linear-gradient(black, black),
            linear-gradient(90deg, orange, purple);
          background-origin: border-box;
          background-clip: content-box, border-box;
          position: relative;
          transition: background 0.3s ease-in-out;
          cursor: pointer;
        }

        .custom-checkbox:checked {
          background-image: linear-gradient(black, black),
            linear-gradient(90deg, orange, purple);
          background-clip: content-box, border-box;
        }

        .custom-checkbox:checked::before {
          content: "✔";
          color: white;
          position: absolute;
          font-size: 16px;
          line-height: 20px;
          text-align: center;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
        }
      `}</style>
      <Toaster
        toastOptions={{
          style: {
            border: "1px solid transparent",
            borderImage: "linear-gradient(to right, #A257EC , #DA619C )",
            borderImageSlice: 1,
            background: "black",
            color: "white",
          },
        }}
      />
    </div>
  );
}