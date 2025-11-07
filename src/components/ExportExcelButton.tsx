'use client';

import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { getAuthHeaders } from '@/lib/auth';
import toast from 'react-hot-toast';

interface ExportExcelButtonProps {
  className?: string;
}

export default function ExportExcelButton({ className }: ExportExcelButtonProps) {
  const [loading, setLoading] = useState(false);
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString());
  const [selectedMonth, setSelectedMonth] = useState<string>('');

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - i);
  const months = [
    { value: '1', label: 'January' },
    { value: '2', label: 'February' },
    { value: '3', label: 'March' },
    { value: '4', label: 'April' },
    { value: '5', label: 'May' },
    { value: '6', label: 'June' },
    { value: '7', label: 'July' },
    { value: '8', label: 'August' },
    { value: '9', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' }
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleExport = async () => {
    try {
      setLoading(true);
      const headers = getAuthHeaders();

      // สร้าง query params
      const params = new URLSearchParams();
      if (selectedYear) params.append('year', selectedYear);
      if (selectedMonth) params.append('month', selectedMonth);

      // ดึงข้อมูลจาก API
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/export-summary?${params.toString()}`,
        { headers }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch export data');
      }

      const data = await response.json();

      // สร้าง workbook
      const workbook = XLSX.utils.book_new();

      // Sheet 1: Summary Statistics
      const summaryData = [
        ['Summary Overview'],
        ['Year:', selectedYear || 'All'],
        ['Month:', selectedMonth ? months.find(m => m.value === selectedMonth)?.label : 'All'],
        [''],
        ['Property Statistics'],
        ['Item', 'Count'],
        ['Total Properties', data.stats.total_properties],
        ['Available', data.stats.available_count],
        ['Reserved', data.stats.reserved_count],
        ['Sold', data.stats.sold_count],
        ['Rented', data.stats.rented_count],
      ];
      const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
      XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary');

      // Sheet 2: Monthly Revenue
      if (data.monthlyRevenue && data.monthlyRevenue.length > 0) {
        const monthlyRevenueData = [
          ['Monthly Revenue'],
          [''],
          ['Period', 'Sales Revenue', 'Rental Revenue', 'Total Revenue', 'Units Sold', 'Units Rented']
        ];

        data.monthlyRevenue.forEach((item: any) => {
          monthlyRevenueData.push([
            item.period.trim(),
            parseFloat(item.sales_revenue || 0),
            parseFloat(item.rental_revenue || 0),
            parseFloat(item.total_revenue || 0),
            parseInt(item.units_sold || 0),
            parseInt(item.units_rented || 0)
          ]);
        });

        const monthlyRevenueSheet = XLSX.utils.aoa_to_sheet(monthlyRevenueData);
        
        // จัด format สำหรับคอลัมน์เงิน
        const range = XLSX.utils.decode_range(monthlyRevenueSheet['!ref'] || 'A1');
        for (let R = 3; R <= range.e.r; ++R) {
          for (let C = 1; C <= 3; ++C) {
            const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
            if (monthlyRevenueSheet[cellAddress]) {
              monthlyRevenueSheet[cellAddress].z = '#,##0';
            }
          }
        }

        XLSX.utils.book_append_sheet(workbook, monthlyRevenueSheet, 'Monthly Revenue');
      }

      // Sheet 3: Properties List
      if (data.properties && data.properties.length > 0) {
        const propertiesData = [
          ['Property List'],
          [''],
          ['ID', 'Title', 'Price', 'Status', 'Type', 'Bedrooms', 'Bathrooms', 'Area (sqm)', 'Description', 'Created Date']
        ];

        data.properties.forEach((prop: any) => {
          propertiesData.push([
            prop.id,
            prop.title,
            parseFloat(prop.price || 0),
            prop.status,
            prop.type,
            prop.bedrooms || 0,
            prop.bathrooms || 0,
            parseFloat(prop.area_sqm || 0),
            prop.description || '',
            formatDate(prop.created_at)
          ]);
        });

        const propertiesSheet = XLSX.utils.aoa_to_sheet(propertiesData);
        
        // จัด format คอลัมน์ราคา
        const range = XLSX.utils.decode_range(propertiesSheet['!ref'] || 'A1');
        for (let R = 3; R <= range.e.r; ++R) {
          const cellAddress = XLSX.utils.encode_cell({ r: R, c: 2 });
          if (propertiesSheet[cellAddress]) {
            propertiesSheet[cellAddress].z = '#,##0';
          }
        }

        XLSX.utils.book_append_sheet(workbook, propertiesSheet, 'Properties');
      }

      // Sheet 4: Transactions
      if (data.transactions && data.transactions.length > 0) {
        const transactionsData = [
          ['Transaction List'],
          [''],
          ['ID', 'Property', 'Type', 'Price', 'Date', 'User ID', 'Username', 'Email']
        ];

        data.transactions.forEach((txn: any) => {
          transactionsData.push([
            txn.id,
            txn.property_title || 'N/A',
            txn.transaction_type,
            parseFloat(txn.final_price || 0),
            formatDate(txn.transaction_date),
            txn.user_id || 'N/A',
            txn.customer_username || 'N/A',
            txn.customer_email || 'N/A'
          ]);
        });

        const transactionsSheet = XLSX.utils.aoa_to_sheet(transactionsData);
        
        // จัด format คอลัมน์ราคา
        const range = XLSX.utils.decode_range(transactionsSheet['!ref'] || 'A1');
        for (let R = 3; R <= range.e.r; ++R) {
          const cellAddress = XLSX.utils.encode_cell({ r: R, c: 3 });
          if (transactionsSheet[cellAddress]) {
            transactionsSheet[cellAddress].z = '#,##0';
          }
        }

        XLSX.utils.book_append_sheet(workbook, transactionsSheet, 'Transactions');
      }

      // สร้างชื่อไฟล์
      const fileName = `PhuketKeys_Report_${selectedYear}${selectedMonth ? `_${months.find(m => m.value === selectedMonth)?.label}` : ''}_${new Date().getTime()}.xlsx`;

      // Export file
      XLSX.writeFile(workbook, fileName);

      toast.success('Export successful!');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={className} style={{ display: 'flex', gap: '15px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
      {/* Year Selector */}
      <div>
        <label style={{ 
          display: 'block', 
          marginBottom: '8px', 
          fontSize: '0.9rem', 
          fontWeight: '600',
          color: '#333' 
        }}>
          Select Year:
        </label>
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          style={{
            padding: '10px 15px',
            borderRadius: '8px',
            border: '1px solid #ddd',
            fontSize: '0.95rem',
            minWidth: '120px',
            cursor: 'pointer',
            backgroundColor: '#fff'
          }}
        >
          <option value="">All</option>
          {years.map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      </div>

      {/* Month Selector */}
      <div>
        <label style={{ 
          display: 'block', 
          marginBottom: '8px', 
          fontSize: '0.9rem', 
          fontWeight: '600',
          color: '#333' 
        }}>
          Select Month:
        </label>
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          style={{
            padding: '10px 15px',
            borderRadius: '8px',
            border: '1px solid #ddd',
            fontSize: '0.95rem',
            minWidth: '150px',
            cursor: 'pointer',
            backgroundColor: '#fff'
          }}
          disabled={!selectedYear}
        >
          <option value="">All</option>
          {months.map(month => (
            <option key={month.value} value={month.value}>{month.label}</option>
          ))}
        </select>
      </div>

      {/* Export Button */}
      <button
        onClick={handleExport}
        disabled={loading}
        style={{
          padding: '10px 25px',
          backgroundColor: loading ? '#ccc' : '#10b981',
          color: '#fff',
          border: 'none',
          borderRadius: '8px',
          fontSize: '0.95rem',
          fontWeight: '600',
          cursor: loading ? 'not-allowed' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          transition: 'background-color 0.3s',
          minHeight: '42px'
        }}
        onMouseEnter={(e) => {
          if (!loading) e.currentTarget.style.backgroundColor = '#059669';
        }}
        onMouseLeave={(e) => {
          if (!loading) e.currentTarget.style.backgroundColor = '#10b981';
        }}
      >
        {loading ? (
          <>
            <span>⏳</span>
            <span>Exporting...</span>
          </>
        ) : (
          <>
            <span>Export to Excel</span>
          </>
        )}
      </button>
    </div>
  );
}
