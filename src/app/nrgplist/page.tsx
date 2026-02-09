'use client';

import React, { useEffect, useState } from 'react';
import { Search, Filter, Calendar, Package, Scale, Loader2, Download } from 'lucide-react';

interface Bag {
  _id: string;
  serialNo: number;
  bagNo: string;
  weight: number;
}

interface Nrgp {
  _id: string;
  nrgpNo: string;
  date: string;
  bags: Bag[];
}

export default function NrgpDetailsPage() {
  const [nrgps, setNrgps] = useState<Nrgp[]>([]);
  const [loading, setLoading] = useState(true);
  const [filteredCount, setFilteredCount] = useState(0);

  // Filter states
  const [searchNrgpNo, setSearchNrgpNo] = useState('');
  const [searchBagNo, setSearchBagNo] = useState('');
  const [searchDate, setSearchDate] = useState('');
  const [searchWeight, setSearchWeight] = useState('');

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/nrgp');
        const result = await res.json();
        if (result.success) {
          setNrgps(result.data);
        } else {
          console.error(result.message);
        }
      } catch (err) {
        console.error('Fetch failed:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, []);

  // Filter logic
  const filteredNrgps = nrgps.filter((nrgp) => {
    const matchesNrgpNo = searchNrgpNo
      ? nrgp.nrgpNo.toLowerCase().includes(searchNrgpNo.toLowerCase())
      : true;

    const matchesDate = searchDate
      ? new Date(nrgp.date).toLocaleDateString() ===
        new Date(searchDate).toLocaleDateString()
      : true;

    const matchesBag = searchBagNo
      ? nrgp.bags.some((b) =>
          b.bagNo.toLowerCase().includes(searchBagNo.toLowerCase())
        )
      : true;

    const matchesWeight = searchWeight
      ? nrgp.bags.some((b) => String(b.weight) === searchWeight)
      : true;

    return matchesNrgpNo && matchesDate && matchesBag && matchesWeight;
  });

  // Update filtered count
  useEffect(() => {
    setFilteredCount(filteredNrgps.length);
  }, [filteredNrgps]);

  // Calculate overall totals
  const overallTotals = filteredNrgps.reduce(
    (acc, nrgp) => {
      const totalBags = nrgp.bags.length;
      const totalWeight = nrgp.bags.reduce((sum, bag) => sum + Number(bag.weight || 0), 0);
      return {
        totalBags: acc.totalBags + totalBags,
        totalWeight: acc.totalWeight + totalWeight,
      };
    },
    { totalBags: 0, totalWeight: 0 }
  );

  const handleResetFilters = () => {
    setSearchNrgpNo('');
    setSearchBagNo('');
    setSearchDate('');
    setSearchWeight('');
  };

  const handleExport = () => {
    // Export functionality would go here
    console.log('Exporting data...');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">NRGP Details</h1>
              <p className="text-gray-600 mt-2">View and manage NRGP records with detailed bag information</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleResetFilters}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                <Filter className="w-4 h-4" />
                Reset Filters
              </button>
              <button
                onClick={handleExport}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl text-gray-500 font-medium">Total Records</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{nrgps.length}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Package className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl text-gray-500 font-medium">Filtered Records</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{filteredCount}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <Filter className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl text-gray-500 font-medium">Total Bags</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{overallTotals.totalBags}</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Scale className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Search className="w-5 h-5 text-gray-500" />
            <h2 className="text-lg font-semibold text-gray-900">Search & Filters</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-2xl font-medium text-gray-700 mb-2">
                NRGP Number
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Enter NRGP number..."
                  value={searchNrgpNo}
                  onChange={(e) => setSearchNrgpNo(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
                <Package className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              </div>
            </div>
            <div>
              <label className="block text-2xl font-medium text-gray-700 mb-2">
                Bag Number
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by bag number..."
                  value={searchBagNo}
                  onChange={(e) => setSearchBagNo(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              </div>
            </div>
            <div>
              <label className="block text-2xl font-medium text-gray-700 mb-2">
                Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={searchDate}
                  onChange={(e) => setSearchDate(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
                <Calendar className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              </div>
            </div>
            <div>
              <label className="block text-2xl font-medium text-gray-700 mb-2">
                Weight (kg)
              </label>
              <div className="relative">
                <input
                  type="number"
                  placeholder="Enter weight..."
                  value={searchWeight}
                  onChange={(e) => setSearchWeight(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
                <Scale className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl shadow-sm border border-gray-200">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
            <p className="text-gray-600">Loading NRGP data...</p>
          </div>
        ) : (
          /* NRGP List */
          <div className="space-y-6">
            {/* Overall Summary */}
            {filteredNrgps.length > 0 && (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Overall Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <p className="text-2xl text-gray-500">Total NRGP Records</p>
                    <p className="text-2xl font-bold text-blue-700">{filteredCount}</p>
                  </div>
                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <p className="text-2xl text-gray-500">Total Bags</p>
                    <p className="text-2xl font-bold text-green-700">{overallTotals.totalBags}</p>
                  </div>
                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <p className="text-2xl text-gray-500">Total Weight</p>
                    <p className="text-2xl font-bold text-purple-700">{overallTotals.totalWeight} kg</p>
                  </div>
                </div>
              </div>
            )}

            {/* NRGP Cards */}
            {filteredNrgps.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-200">
                <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No records found</h3>
                <p className="text-gray-500">
                  {nrgps.length === 0
                    ? 'No NRGP records available. Add some records to get started.'
                    : 'No matching records found. Try adjusting your filters.'}
                </p>
              </div>
            ) : (
              filteredNrgps.map((nrgp) => {
                const totalBags = nrgp.bags.length;
                const totalWeight = nrgp.bags.reduce(
                  (sum, bag) => sum + Number(bag.weight || 0),
                  0
                );

                return (
                  <div
                    key={nrgp._id}
                    className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow duration-300"
                  >
                    {/* NRGP Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-white/20 rounded-lg">
                            <Package className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-white">{nrgp.nrgpNo}</h3>
                            <p className="text-blue-100 text-2xl mt-1">
                              {new Date(nrgp.date).toLocaleDateString('en-US', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                              })}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-4">
                          <div className="text-center">
                            <p className="text-blue-100 text-2xl">Total Bags</p>
                            <p className="text-white font-bold text-lg">{totalBags}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-blue-100 text-2xl">Total Weight</p>
                            <p className="text-white font-bold text-lg">{totalWeight} kg</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Bags Table */}
                    <div className="p-6">
                      <div className="overflow-x-auto rounded-xl border border-gray-200">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                Sr. No
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                Bag Number
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                Weight (kg)
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                Status
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {nrgp.bags.map((bag, idx) => (
                              <tr
                                key={bag._id}
                                className="hover:bg-gray-50 transition-colors"
                              >
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-800 font-medium">
                                    {bag.serialNo}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-2xl font-medium text-gray-900">
                                  {bag.bagNo}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-2xl text-gray-700">
                                  <div className="flex items-center gap-2">
                                    <Scale className="w-4 h-4 text-gray-400" />
                                    {bag.weight} kg
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    Active
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                          <tfoot className="bg-gray-50 border-t border-gray-200">
                            <tr>
                              <td className="px-6 py-4 text-2xl font-semibold text-gray-900">
                                Total
                              </td>
                              <td className="px-6 py-4 text-2xl font-semibold text-gray-900">
                                {totalBags} bags
                              </td>
                              <td className="px-6 py-4 text-2xl font-semibold text-gray-900">
                                {totalWeight} kg
                              </td>
                              <td className="px-6 py-4">
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                  Complete
                                </span>
                              </td>
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Footer Stats */}
        {!loading && filteredNrgps.length > 0 && (
          <div className="mt-8 p-6 bg-white rounded-2xl shadow-sm border border-gray-200">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div>
                <p className="text-2xl text-gray-500">
                  Showing <span className="font-semibold">{filteredCount}</span> of{' '}
                  <span className="font-semibold">{nrgps.length}</span> records
                </p>
              </div>
              <div className="flex gap-6">
                <div className="text-center">
                  <p className="text-2xl text-gray-500">Total Bags</p>
                  <p className="text-lg font-bold text-gray-900">{overallTotals.totalBags}</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl text-gray-500">Total Weight</p>
                  <p className="text-lg font-bold text-gray-900">{overallTotals.totalWeight} kg</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl text-gray-500">Avg Weight/NRGP</p>
                  <p className="text-lg font-bold text-gray-900">
                    {filteredCount > 0
                      ? (overallTotals.totalWeight / filteredCount).toFixed(2)
                      : 0}{' '}
                    kg
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}