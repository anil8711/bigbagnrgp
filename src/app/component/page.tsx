'use client';

import React, { useState } from 'react';
import {
  FileText,
  Calendar,
  Package,
  Scale,
  Plus,
  Trash2,
  Upload,
  Download,
  Printer,
  Save,
  RefreshCw,
  Info,
  AlertCircle,
  CheckCircle,
  Hash,
  Layers,
  BarChart3,
  Truck,
  Warehouse,
  ClipboardCheck,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronUp,
  Filter,
  Search,
  X,
  Loader2Icon
} from 'lucide-react';

type Bag = {
  bagNo: string;
  weight: string;
};

export default function Nrgp() {
  const [nrgpNo, setNrgpNo] = useState('');
  const [date, setDate] = useState('');
  const [bags, setBags] = useState<Bag[]>(
    Array.from({ length: 30 }, () => ({
      bagNo: '',
      weight: '',
    }))
  );
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showValidation, setShowValidation] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleBagChange = (
    index: number,
    field: 'bagNo' | 'weight',
    value: string
  ) => {
    const updatedBags = [...bags];
    updatedBags[index][field] = value;
    setBags(updatedBags);
  };

  // Calculate totals
  const validBags = bags.filter(bag => bag.bagNo.trim() !== '' && bag.weight.trim() !== '');
  const totalWeight = validBags.reduce((sum, bag) => sum + parseFloat(bag.weight || '0'), 0);
  const avgWeight = validBags.length > 0 ? totalWeight / validBags.length : 0;

  const addMoreBags = () => {
    setBags([...bags, ...Array.from({ length: 10 }, () => ({ bagNo: '', weight: '' }))]);
  };

  const clearAllBags = () => {
    if (window.confirm('Are you sure you want to clear all bag entries?')) {
      setBags(Array.from({ length: 30 }, () => ({ bagNo: '', weight: '' })));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const filteredBags = bags
      .map((bag, i) => ({
        serialNo: i + 1,
        ...bag,
      }))
      .filter((bag) => bag.bagNo.trim() !== '' && bag.weight.trim() !== '');

    if (filteredBags.length === 0) {
      alert('Please enter at least one bag with Bag No and Weight.');
      setIsSubmitting(false);
      return;
    }

    const data = {
      nrgpNo,
      date,
      bags: filteredBags,
    };

    console.log(data);
    
    try {
      const response = await fetch('/api/nrgp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        alert(' NRGP Form Submitted successfully');
        // Reset form
        setNrgpNo('');
        setDate('');
        setBags(Array.from({ length: 30 }, () => ({ bagNo: '', weight: '' })));
      } else {
        const errorData = await response.json();
        alert(` Error: ${errorData.message}`);
      }
    } catch (err) {
      console.error(err);
      alert(' Submission failed. Please check your connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const printForm = () => {
    window.print();
  };

  const exportToCSV = () => {
    const csvContent = [
      ['NRGP No', 'Date', 'Bag No', 'Weight'],
      [nrgpNo, date, '', ''],
      ...bags.map((bag, index) => ['', '', `Bag ${index + 1}: ${bag.bagNo}`, bag.weight])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `NRGP_${nrgpNo || 'DRAFT'}_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-xl">
                <FileText className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">NRGP Form</h1>
                <p className="text-gray-600 mt-2">Create new NRGP records with bag details</p>
              </div>
            </div>
            
            <div className="flex gap-3 flex-wrap">
              <button
                type="button"
                onClick={printForm}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                <Printer className="w-4 h-4" />
                Print
              </button>
              <button
                type="button"
                onClick={exportToCSV}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Export CSV
              </button>
              <button
                type="button"
                onClick={clearAllBags}
                className="px-4 py-2 border border-red-300 rounded-lg text-red-700 hover:bg-red-50 transition-colors flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Clear All
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl text-gray-500 font-medium">Valid Bags</p>
                  <p className="text-2xl font-bold text-green-600 mt-1">{validBags.length}</p>
                </div>
                <div className="p-2 bg-green-100 rounded-lg">
                  <Package className="w-5 h-5 text-green-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl text-gray-500 font-medium">Total Weight</p>
                  <p className="text-2xl font-bold text-blue-600 mt-1">{totalWeight.toFixed(2)} kg</p>
                </div>
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Scale className="w-5 h-5 text-blue-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl text-gray-500 font-medium">Avg Weight</p>
                  <p className="text-2xl font-bold text-purple-600 mt-1">{avgWeight.toFixed(2)} kg</p>
                </div>
                <div className="p-2 bg-purple-100 rounded-lg">
                  <BarChart3 className="w-5 h-5 text-purple-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl text-gray-500 font-medium">Status</p>
                  <p className="text-lg font-bold text-gray-900 mt-1">
                    {validBags.length > 0 ? 'Ready to Submit' : 'Draft'}
                  </p>
                </div>
                <div className="p-2 bg-yellow-100 rounded-lg">
                  {validBags.length > 0 ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-yellow-600" />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 bg-white rounded-2xl shadow-lg border border-gray-200 p-6"
        >
          {/* Header Fields Card */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900">NRGP Information</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-2xl font-medium text-gray-700 mb-2">
                  <div className="flex items-center gap-2">
                    <Hash className="w-4 h-4" />
                    NRGP Number
                  </div>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={nrgpNo}
                    onChange={(e) => setNrgpNo(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="Enter NRGP number..."
                    required
                  />
                  <Hash className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                </div>
                {nrgpNo && (
                  <div className="mt-2 flex items-center gap-1 text-2xl text-green-600">
                    <CheckCircle className="w-4 h-4" />
                    Valid format
                  </div>
                )}
              </div>
              
              <div>
                <label className="block text-2xl font-medium text-gray-700 mb-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Date
                  </div>
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    required
                  />
                  <Calendar className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Bag List Section */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-gray-700" />
                <h2 className="text-lg font-semibold text-gray-900">Bag Details</h2>
                <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-700 text-2xl font-medium rounded-full">
                  {bags.length} slots
                </span>
              </div>
              
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="px-3 py-2 text-2xl border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
                >
                  {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  {showAdvanced ? 'Hide Options' : 'More Options'}
                </button>
                <button
                  type="button"
                  onClick={addMoreBags}
                  className="px-3 py-2 text-2xl border border-blue-300 rounded-lg text-blue-700 hover:bg-blue-50 transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add 10 More
                </button>
              </div>
            </div>

            {showAdvanced && (
              <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-gray-500" />
                    <span className="text-2xl font-medium text-gray-700">Advanced Options</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 text-2xl text-gray-600">
                      <input
                        type="checkbox"
                        checked={showValidation}
                        onChange={(e) => setShowValidation(e.target.checked)}
                        className="rounded border-gray-300"
                      />
                      Show Validation
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Bag Table */}
            <div className="overflow-x-auto rounded-xl border border-gray-200">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-6 py-3 text-left text-2xl font-semibold text-gray-700 uppercase tracking-wider">
                      <div className="flex items-center gap-2">
                        <Hash className="w-4 h-4" />
                        Sr No
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-2xl font-semibold text-gray-700 uppercase tracking-wider">
                      <div className="flex items-center gap-2">
                        <Package className="w-4 h-4" />
                        Bag No
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-2xl font-semibold text-gray-700 uppercase tracking-wider">
                      <div className="flex items-center gap-2">
                        <Scale className="w-4 h-4" />
                        Weight (kg)
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-2xl font-semibold text-gray-700 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {bags.map((bag, index) => {
                    const isValid = bag.bagNo.trim() !== '' && bag.weight.trim() !== '';
                    const isEmpty = bag.bagNo.trim() === '' && bag.weight.trim() === '';
                    
                    return (
                      <tr 
                        key={index} 
                        className={`transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} ${
                          isValid ? 'hover:bg-green-50' : 'hover:bg-gray-100'
                        }`}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-800 font-medium">
                              {index + 1}
                            </span>
                            {isValid && (
                              <CheckCircle className="w-4 h-4 text-green-500" />
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="relative">
                            <input
                              type="text"
                              value={bag.bagNo}
                              onChange={(e) => handleBagChange(index, 'bagNo', e.target.value)}
                              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                                isValid ? 'border-green-300 bg-green-50' : 'border-gray-300'
                              }`}
                              placeholder="Enter bag number..."
                            />
                            {showValidation && !isEmpty && !isValid && (
                              <div className="absolute right-3 top-2.5">
                                <AlertCircle className="w-4 h-4 text-yellow-500" />
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="relative">
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              value={bag.weight}
                              onChange={(e) => handleBagChange(index, 'weight', e.target.value)}
                              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                                isValid ? 'border-green-300 bg-green-50' : 'border-gray-300'
                              }`}
                              placeholder="0.00"
                            />
                            <span className="absolute right-3 top-2.5 text-gray-500 text-2xl">
                              kg
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-2xl font-medium ${
                            isValid 
                              ? 'bg-green-100 text-green-800' 
                              : isEmpty 
                                ? 'bg-gray-100 text-gray-800' 
                                : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {isValid ? (
                              <>
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Valid
                              </>
                            ) : isEmpty ? (
                              'Empty'
                            ) : (
                              <>
                                <AlertCircle className="w-3 h-3 mr-1" />
                                Incomplete
                              </>
                            )}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot className="bg-blue-50 border-t-2 border-blue-200">
                  <tr>
                    <td className="px-6 py-4 font-semibold text-gray-900">
                      <div className="flex items-center gap-2">
                        <BarChart3 className="w-4 h-4" />
                        Summary
                      </div>
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-900">
                      Valid Bags: {validBags.length}
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-900">
                      Total Weight: {totalWeight.toFixed(2)} kg
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-2xl font-medium bg-blue-100 text-blue-800">
                        <ClipboardCheck className="w-3 h-3 mr-1" />
                        Ready
                      </span>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Quick Actions */}
            <div className="mt-4 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={addMoreBags}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add More Bags
              </button>
              <button
                type="button"
                onClick={clearAllBags}
                className="px-4 py-2 border border-red-300 rounded-lg text-red-700 hover:bg-red-50 transition-colors flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Clear All Bags
              </button>
              <button
                type="button"
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
                onClick={() => {
                  // Auto-fill sample data
                  const sampleBags = bags.map((bag, index) => ({
                    bagNo: index < 10 ? `BAG-${String(index + 1).padStart(3, '0')}` : '',
                    weight: index < 10 ? (Math.random() * 50 + 20).toFixed(2) : ''
                  }));
                  setBags(sampleBags);
                  if (!nrgpNo) setNrgpNo(`NRGP-${new Date().getTime().toString().slice(-6)}`);
                  if (!date) setDate(new Date().toISOString().split('T')[0]);
                }}
              >
                <RefreshCw className="w-4 h-4" />
                Fill Sample Data
              </button>
            </div>
          </div>

          {/* Submit Section */}
          <div className="pt-6 border-t border-gray-200">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-2 text-2xl text-gray-600">
                <Info className="w-4 h-4" />
                <span>
                  {validBags.length > 0 
                    ? `Ready to submit ${validBags.length} bags with total weight of ${totalWeight.toFixed(2)} kg`
                    : 'Please enter at least one bag to submit'}
                </span>
              </div>
              
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setNrgpNo('');
                    setDate('');
                    setBags(Array.from({ length: 30 }, () => ({ bagNo: '', weight: '' })));
                  }}
                  className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Reset Form
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || validBags.length === 0}
                  className={`px-8 py-3 rounded-lg font-semibold flex items-center gap-2 transition-all ${
                    isSubmitting || validBags.length === 0
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2Icon className="w-5 h-5 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      Submit NRGP
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>

        {/* Footer Info */}
        {/* <div className="mt-8 p-6 bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Info className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Tips</h4>
                <p className="text-2xl text-gray-600">
                  Enter bag numbers and weights accurately. Use decimal points for weight values.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <ClipboardCheck className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Validation</h4>
                <p className="text-2xl text-gray-600">
                  Empty rows are ignored. Only complete bag entries will be submitted.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Printer className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Print & Export</h4>
                <p className="text-2xl text-gray-600">
                  Use print button for physical copies or export for digital records.
                </p>
              </div>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
}