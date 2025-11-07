// src/app/admin/dashboard/DashboardClientUI.tsx
'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { getAuthHeaders } from '@/lib/auth'; // ⭐️ Import getAuthHeaders
import toast from 'react-hot-toast';

// Dynamic import for chart (no changes needed)
const PropertyPieChart = dynamic(() => import('./PropertyPieChart'), {
  ssr: false,
  loading: () => <p>Loading chart...</p>
});

const RevenueDonutChart = dynamic(() => import('./RevenueDonutChart'), {
  ssr: false,
  loading: () => <p>Loading chart...</p>
});

const RevenueBarChart = dynamic(() => import('./RevenueBarChart'), {
  ssr: false,
  loading: () => <p>Loading chart...</p>
});

const RentPieCard = dynamic(() => import('./RentPieCard'), {
  ssr: false,
  loading: () => <div className="stat-card"><p>Loading...</p></div>
});

const StatPieCard = dynamic(() => import('./StatPieCard'), {
  ssr: false,
  loading: () => <div className="stat-card"><p>Loading...</p></div>
});

const ExportExcelButton = dynamic(() => import('@/components/ExportExcelButton'), {
  ssr: false,
  loading: () => <div>Loading...</div>
});

// --- Interfaces (Updated) ---
interface DashboardStats {
  total_properties: number;
  for_sale: number;
  for_rent: number;
  available: number;
  reserved: number;
  for_rent_daily: number;
}
interface PropertyType {
  type: string | null;
  count: string;
}
interface SearchStatItem {
  keyword?: string;
  type?: string;
  status?: string;
  search_count: string;
}
interface SearchStatsData {
  topKeywords: SearchStatItem[];
  topTypes: SearchStatItem[];
  statusCounts: SearchStatItem[];
}
// ⭐️ Interface for Revenue Stats
interface RevenueStats {
  total_revenue: string | null;
  sales_revenue: string | null;
  rental_revenue: string | null;
  total_transactions: string | null;
  units_sold: string | null;
  units_rented: string | null;
}
interface MonthlyRevenue {
  month: string;
  sales: number;
  rental: number;
}

export default function DashboardClientUI() {
  // --- States (Updated) ---
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [propertyTypes, setPropertyTypes] = useState<PropertyType[]>([]);
  const [searchStats, setSearchStats] = useState<SearchStatsData | null>(null);
  const [revenueStats, setRevenueStats] = useState<RevenueStats | null>(null); // ⭐️ New state
  const [monthlyRevenue, setMonthlyRevenue] = useState<MonthlyRevenue[]>([]); // ⭐️ Monthly revenue state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- Fetch Data (Updated) ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const headers = getAuthHeaders(); // Use updated getAuthHeaders

        // Fetch all 5 endpoints
        const [statsRes, typesRes, searchStatsRes, revenueStatsRes, monthlyRevenueRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/stats`, { headers }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/properties-by-type`, { headers }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/search-stats`, { headers }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/revenue-stats`, { headers }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/monthly-revenue`, { headers }) // ⭐️ Fetch monthly revenue
        ]);

        // Check all responses
        if (!statsRes.ok) throw new Error('Failed to fetch dashboard stats.');
        if (!typesRes.ok) throw new Error('Failed to fetch property types.');
        if (!searchStatsRes.ok) throw new Error('Failed to fetch search stats.');
        if (!revenueStatsRes.ok) throw new Error('Failed to fetch revenue stats.');
        if (!monthlyRevenueRes.ok) throw new Error('Failed to fetch monthly revenue.'); // ⭐️ Check monthly revenue response

        // Parse all JSON
        const statsData: DashboardStats = await statsRes.json();
        const typesData: PropertyType[] = await typesRes.json();
        const searchStatsData: SearchStatsData = await searchStatsRes.json();
        const revenueStatsData: RevenueStats = await revenueStatsRes.json();
        const monthlyRevenueData: MonthlyRevenue[] = await monthlyRevenueRes.json(); // ⭐️ Parse monthly revenue data

        // Set all states
        setStats(statsData);
        setPropertyTypes(typesData);
        setSearchStats(searchStatsData);
        setRevenueStats(revenueStatsData);
        setMonthlyRevenue(monthlyRevenueData); // ⭐️ Set monthly revenue state

      } catch (err: any) {
        setError(err.message);
        console.error("Fetch Data Error:", err);
        toast.error(`Error loading dashboard data: ${err.message}`); // Display error to user
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []); // Run once on mount

  // --- Helper function for formatting currency ---
  const formatCurrency = (value: string | number | null): string => {
    if (value === null || value === undefined) return '฿ 0';
    const numberValue = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(numberValue)) return '฿ 0';
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
      maximumFractionDigits: 0,
    }).format(numberValue);
  };

  // --- Prepare Chart Data (No changes) ---
  const chartData = propertyTypes.map(item => ({
    name: item.type || 'Uncategorized',
    value: parseInt(item.count, 10),
  }));

  // --- Prepare Revenue Donut Chart Data ---
  const revenueDonutData = [
    {
      name: 'Sales Revenue',
      value: revenueStats?.sales_revenue ? parseFloat(revenueStats.sales_revenue) : 0,
    },
    {
      name: 'Rental Revenue',
      value: revenueStats?.rental_revenue ? parseFloat(revenueStats.rental_revenue) : 0,
    },
  ];

  // --- Loading / Error States ---
  if (loading) return (
    <div style={{ 
      textAlign: 'center', 
      padding: '50px 20px',
      fontSize: '1.1rem',
      color: '#6c757d'
    }}>
      Loading Dashboard Data...
    </div>
  );
  if (error) return <div className="error-message">Error loading data: {error}</div>;

  // --- Calculate Total Rent (No changes) ---
  const totalRent = (stats ? Number(stats.for_rent) : 0) + (stats ? Number(stats.for_rent_daily) : 0);

  // --- JSX (Return - Updated) ---
  return (
    <div>
      {/* Export Excel Section */}
      <div style={{ 
        marginBottom: '30px', 
        padding: '20px', 
        backgroundColor: '#fff', 
        borderRadius: '12px',
        border: '1px solid #eef0f2',
        boxShadow: '0 4px 12px rgba(0, 0, 0, .05)'
      }}>
        <h2 style={{ marginBottom: '15px', fontSize: '1.3rem', color: '#1a2e44' }}>
          📥 Export Data to Excel
        </h2>
        <p style={{ marginBottom: '20px', color: '#666', fontSize: '0.95rem' }}>
          Export all summary data including properties, transactions, and revenue by month/year
        </p>
        <ExportExcelButton />
      </div>

      {/* --- Stat Cards Section (Updated) --- */}
      <div className="stat-cards-container">
        {/* Property Stats with Pie Charts */}
        <StatPieCard 
          title="Total Units" 
          subtitle="All Properties in System"
          value={stats?.total_properties ?? 0} 
          total={stats?.total_properties ?? 0}
          colors={['#1a2e44', '#e5e7eb']} // Navy tone
        />
        <StatPieCard 
          title="Available" 
          subtitle="Ready for Sale or Rent"
          value={stats?.available ?? 0} 
          total={stats?.total_properties ?? 0}
          colors={['#10b981', '#d1fae5']} // Green tone
        />
        <StatPieCard 
          title="Reserved" 
          subtitle="Properties Under Reservation"
          value={stats?.reserved ?? 0} 
          total={stats?.total_properties ?? 0}
          colors={['#f59e0b', '#fef3c7']} // Amber tone
        />
        <StatPieCard 
          title="For Sale" 
          subtitle="Properties Listed for Sale"
          value={stats?.for_sale ?? 0} 
          total={stats?.total_properties ?? 0}
          colors={['#8b5cf6', '#ede9fe']} // Purple tone
        />
        
        {/* Rent Pie Charts with different color tones */}
        <RentPieCard 
          title="Total Rent" 
          subtitle="Monthly & Daily Rental Properties"
          value={totalRent} 
          total={stats?.total_properties ?? 0}
          colors={['#3b82f6', '#dbeafe']} // Blue tone
        />
        <RentPieCard 
          title="Daily Rent" 
          subtitle="Short-term Rental Properties"
          value={stats?.for_rent_daily ?? 0} 
          total={stats?.total_properties ?? 0}
          colors={['#06b6d4', '#cffafe']} // Cyan tone
        />
      </div>

      {/* --- Revenue Donut Chart Section --- */}
      <div className="chart-container" style={{ marginTop: '40px', marginBottom: '40px' }}>
        <h2>Revenue Breakdown</h2>
        
        {/* Summary Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginTop: '20px', marginBottom: '30px' }}>
          <div className="stat-card revenue">
            <h3>Total Revenue</h3>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2a5934', marginTop: '10px' }}>
              {formatCurrency(revenueStats?.total_revenue)}
            </p>
          </div>
          <div className="stat-card revenue">
            <h3>Sales Revenue</h3>
            <p style={{ fontSize: '1.5rem', fontWeight: '600', color: '#2a5934', marginTop: '10px' }}>
              {formatCurrency(revenueStats?.sales_revenue)}
            </p>
          </div>
          <div className="stat-card revenue">
            <h3>Rental Revenue</h3>
            <p style={{ fontSize: '1.5rem', fontWeight: '600', color: '#6a9f7e', marginTop: '10px' }}>
              {formatCurrency(revenueStats?.rental_revenue)}
            </p>
          </div>
        </div>

        {/* Monthly Revenue Bar Chart */}
        <div style={{ marginTop: '30px' }}>
          <h3 style={{ marginBottom: '20px', color: '#333' }}>Monthly Revenue Trends</h3>
          <RevenueBarChart data={monthlyRevenue} />
        </div>

        {/* Transaction Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginTop: '30px' }}>
          <div className="stat-card">
            <h3>Total Transactions</h3>
            <p style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#1a2e44', marginTop: '10px' }}>
              {revenueStats?.total_transactions ?? 0}
            </p>
          </div>
          <div className="stat-card">
            <h3>Units Sold</h3>
            <p style={{ fontSize: '1.5rem', fontWeight: '600', color: '#2a5934', marginTop: '10px' }}>
              {revenueStats?.units_sold ?? 0}
            </p>
          </div>
          <div className="stat-card">
            <h3>Units Rented</h3>
            <p style={{ fontSize: '1.5rem', fontWeight: '600', color: '#6a9f7e', marginTop: '10px' }}>
              {revenueStats?.units_rented ?? 0}
            </p>
          </div>
        </div>
      </div>

      {/* --- Pie Chart Section (No changes) --- */}
      <div className="chart-container" style={{ marginTop: '40px', marginBottom: '40px' }}>
        <h2>Properties by Type</h2>
        <PropertyPieChart data={chartData} />
      </div>

      {/* --- Search Stats Section (No changes) --- */}
      <div className="search-stats-container">
        <h2>Search Statistics</h2>
        <div className="stats-grid">
          {/* Top Keywords */}
          <div className="stat-list-card">
            <h3>Top Keywords</h3>
            {searchStats?.topKeywords && searchStats.topKeywords.length > 0 ? (
              <ol>
                {searchStats.topKeywords.map((item, index) => (
                  <li key={`kw-${index}`}> {/* Add unique keys */}
                    {item.keyword} <span>({item.search_count} searches)</span>
                  </li>
                ))}
              </ol>
            ) : (
              <p>No keyword data yet.</p>
            )}
          </div>
          {/* Top Property Types */}
          <div className="stat-list-card">
            <h3>Top Property Types</h3>
            {searchStats?.topTypes && searchStats.topTypes.length > 0 ? (
              <ol>
                {searchStats.topTypes.map((item, index) => (
                  <li key={`type-${index}`}> {/* Add unique keys */}
                    {item.type} <span>({item.search_count} searches)</span>
                  </li>
                ))}
              </ol>
            ) : (
              <p>No type data yet.</p>
            )}
          </div>
          {/* Status Counts */}
          <div className="stat-list-card">
            <h3>Searches by Status</h3>
            {searchStats?.statusCounts && searchStats.statusCounts.length > 0 ? (
              <ul>
                {searchStats.statusCounts.map((item, index) => (
                  <li key={`status-${index}`}> {/* Add unique keys */}
                    {item.status} <span>({item.search_count} searches)</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No status data yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}