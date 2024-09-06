"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import UpArrow2 from "../assets/UpArrow2-New.png";
import DownArrow2 from "../assets/DownArrow2.png";
import UpDownArrow from "../assets/UpDownArrow.png";
import Filter from "../assets/Filter.png";
import "../css/OperatorSelectionTable.css";

// Define the type for an operator
interface Operator {
  id: number;
  name: string;
  validators: number;
  performance: string;
  yearlyFee: string;
  mev: number;
}

export default function OperatorSelectionTable() {
  const [operators, setOperators] = useState<Operator[]>([]);
  const [selectedOperators, setSelectedOperators] = useState<Operator[]>([]);
  const [clusterSize, setClusterSize] = useState<number>(4);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Operator;
    direction: "ascending" | "descending" | null;
  }>({
    key: "id",
    direction: null,
  });

  const router = useRouter();

  const [totalFee, setTotalFee] = useState<number>(0); // State for total fee

  // Fetch data from the API
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
        
        // Ensure the response contains the operators array
        if (data.operators && Array.isArray(data.operators)) {
          const transformedOperators = data.operators.map((op: any) => ({
            id: op.id,
            name: op.name,
            validators: 0, // Assuming validators are not provided, set to 0
            performance: `${op.performance['30d'].toFixed(2)}%`, // Assuming '30d' performance is required
            yearlyFee: `${(parseInt(op.fee) / 1e9).toFixed(2)} SSV`, // Convert fee to SSV and format
            mev: 0, // Assuming MEV is not provided, set to 0
          }));
          
          setOperators(transformedOperators);
        } else {
          console.error("Invalid response structure:", data);
        }
      } catch (error) {
        console.error("Failed to fetch operators:", error);
      }
    };

    fetchOperators();
  }, []); // Empty dependency array ensures this runs once on mount

  // Function to calculate the total fee
  const calculateTotalFee = (selectedOps: Operator[]) => {
    const total = selectedOps.reduce(
      (sum, op) => sum + parseInt(op.yearlyFee.split(" ")[0]),
      0
    );
    setTotalFee(total);
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

  return (
    <div className="operator-selection-container">
      <div className="table-container">
        <h2>Pick the cluster of network operators to run your validator</h2>
        <div className="cluster-size-selector">
          {[4, 7, 10, 13].map((size) => (
            <button
              key={size}
              className={clusterSize === size ? "active" : ""}
              onClick={() => setClusterSize(size)}
            >
              {size}
            </button>
          ))}
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
          <button className="filter-button">
            <span className="filter-icon">⚙️</span> Filters
          </button>
        </div>
        <table>
          <thead>
            <tr>
              <th className="cursor-pointer" onClick={() => handleSort("id")}>
                ID {renderSortIcon("id")}
              </th>
              <th className="cursor-pointer" onClick={() => handleSort("name")}>
                Name {renderSortIcon("name")}
              </th>
              <th
                className="cursor-pointer"
                onClick={() => handleSort("validators")}
              >
                Validators {renderSortIcon("validators")}
              </th>
              <th
                className="cursor-pointer"
                onClick={() => handleSort("performance")}
              >
                30d performance {renderSortIcon("performance")}
              </th>
              <th
                className="cursor-pointer"
                onClick={() => handleSort("yearlyFee")}
              >
                Yearly Fee {renderSortIcon("yearlyFee")}
              </th>
              <th className="cursor-pointer" onClick={() => handleSort("mev")}>
                MEV {renderSortIcon("mev")}
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedOperators.map((operator) => (
              <tr
                key={operator.id}
                onClick={() => handleRowSelection(operator)}
              >
                <td>{operator.id}</td>
                <td>{operator.name}</td>
                <td>{operator.validators}</td>
                <td>{operator.performance}</td>
                <td>{operator.yearlyFee}</td>
                <td>{operator.mev}</td>
              </tr>
            ))}
          </tbody>
        </table>
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

          {selectedOperators.map((operator, index) => (
            <div
              key={operator.id}
              className="relative p-[1px] rounded-lg bg-gradient-to-b from-[#A257EC] to-[#DA619C] mb-2"
            >
              <div className="flex items-center justify-center h-full w-full bg-[#161515] rounded-lg text-white py-3">
                {operator.name} (Operator {String(index + 1).padStart(2, "0")})
              </div>
            </div>
          ))}

          {Array(clusterSize - selectedOperators.length)
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
            onClick={() => router.push("/next-page")} // Replace with your actual navigation logic
            className="w-full bg-blue-600 text-white py-[6px] px-4 rounded-[6px] hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}