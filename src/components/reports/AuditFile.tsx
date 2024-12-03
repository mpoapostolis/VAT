import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, FileSpreadsheet, FileCheck } from 'lucide-react';
import { AnimatedPage } from '@/components/AnimatedPage';
import { Button } from '@/components/ui/button';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { Select } from '@/components/ui/select';

const auditTypes = [
  { value: 'fta', label: 'FTA Audit File' },
  { value: 'detailed', label: 'Detailed Transaction Report' },
  { value: 'summary', label: 'Summary Report' },
];

export function AuditFile() {
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    // Simulate file generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsGenerating(false);
  };

  return (
    <AnimatedPage>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/reports')}
              className="text-gray-500 hover:text-gray-700"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Audit File Generation</h1>
              <p className="text-sm text-gray-500 mt-1">Generate audit files and reports</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200/60 shadow-lg shadow-gray-200/20 p-6">
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Report Type
                </label>
                <Select
                  options={auditTypes}
                  placeholder="Select report type"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date Range
                </label>
                <DateRangePicker />
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <div className="flex justify-end space-x-4">
                <Button variant="outline" onClick={() => navigate('/reports')}>
                  Cancel
                </Button>
                <Button
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="min-w-[150px]"
                >
                  {isGenerating ? (
                    <>
                      <FileCheck className="h-4 w-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4 mr-2" />
                      Generate File
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200/60 shadow-lg shadow-gray-200/20 p-6">
          <h2 className="text-lg font-medium mb-4">Recent Audit Files</h2>
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 text-sm font-medium text-gray-500">File Name</th>
                <th className="text-left py-3 text-sm font-medium text-gray-500">Type</th>
                <th className="text-left py-3 text-sm font-medium text-gray-500">Generated On</th>
                <th className="text-right py-3 text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-100">
                <td className="py-4">FAF_2024_Q1.xlsx</td>
                <td className="py-4">FTA Audit File</td>
                <td className="py-4">Mar 31, 2024</td>
                <td className="py-4">
                  <div className="flex justify-end space-x-2">
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </AnimatedPage>
  );
}