"use client";
import React, { useState } from "react";
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

// Mock data
const operators: Operator[] = [
  {
    id: 690,
    name: "Blockscape-ZeroG",
    validators: 0,
    performance: "0%",
    yearlyFee: "25 SSV",
    mev: 0,
  },
  {
    id: 574,
    name: "Operator 574",
    validators: 0,
    performance: "0%",
    yearlyFee: "20 SSV",
    mev: 0,
  },
  {
    id: 939,
    name: "Operator 939",
    validators: 0,
    performance: "0%",
    yearlyFee: "20 SSV",
    mev: 0,
  },
  {
    id: 172,
    name: "Operator 172",
    validators: 0,
    performance: "0%",
    yearlyFee: "15 SSV",
    mev: 0,
  },
];

export default function OperatorSelectionTable() {
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

  const handleRowSelection = (operator: Operator) => {
    setSelectedOperators((prev) => {
      if (prev.find((op) => op.id === operator.id)) {
        return prev.filter((op) => op.id !== operator.id);
      } else if (prev.length < clusterSize) {
        return [...prev, operator];
      }
      return prev;
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
      return sortConfig.direction === "ascending" ? "🔼" : "🔽";
    }
    return "🔼"; // Default unsorted state
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
      <div className="selected-operators">
        <h3>
          Selected Operators {selectedOperators.length}/{clusterSize}
        </h3>
        {selectedOperators.map((operator, index) => (
          <div key={operator.id} className="selected-operator">
            {operator.name} (Operator {String(index + 1).padStart(2, "0")})
          </div>
        ))}
        {Array(clusterSize - selectedOperators.length)
          .fill(null)
          .map((_, index) => (
            <div key={index} className="empty-operator">
              Select Operator{" "}
              {String(selectedOperators.length + index + 1).padStart(2, "0")}
            </div>
          ))}
      </div>
    </div>
  );
}