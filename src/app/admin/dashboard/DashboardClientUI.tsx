// src/app/admin/dashboard/DashboardClientUI.tsx
'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { getAuthHeaders } from '@/lib/auth'; // ⭐️ Import getAuthHeaders

// Dynamic import for chart (no changes needed)
const PropertyPieChart = dynamic(() => import('./PropertyPieChart'), {
  ssr: false,
  loading: () => <p>Loading chart...</p>
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

export default function DashboardClientUI() {
  // --- States (Updated) ---
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [propertyTypes, setPropertyTypes] = useState<PropertyType[]>([]);
  const [searchStats, setSearchStats] = useState<SearchStatsData | null>(null);
  const [revenueStats, setRevenueStats] = useState<RevenueStats | null>(null); // ⭐️ New state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- Fetch Data (Updated) ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const headers = getAuthHeaders(); // Use updated getAuthHeaders

        // Fetch all 4 endpoints
        const [statsRes, typesRes, searchStatsRes, revenueStatsRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/stats`, { headers }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/properties-by-type`, { headers }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/search-stats`, { headers }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/revenue-stats`, { headers }) // ⭐️ Fetch revenue
        ]);

        // Check all responses
        if (!statsRes.ok) throw new Error('Failed to fetch dashboard stats.');
        if (!typesRes.ok) throw new Error('Failed to fetch property types.');
        if (!searchStatsRes.ok) throw new Error('Failed to fetch search stats.');
        if (!revenueStatsRes.ok) throw new Error('Failed to fetch revenue stats.'); // ⭐️ Check revenue response

        // Parse all JSON
        const statsData: DashboardStats = await statsRes.json();
        const typesData: PropertyType[] = await typesRes.json();
        const searchStatsData: SearchStatsData = await searchStatsRes.json();
        const revenueStatsData: RevenueStats = await revenueStatsRes.json(); // ⭐️ Parse revenue data

        // Set all states
        setStats(statsData);
        setPropertyTypes(typesData);
        setSearchStats(searchStatsData);
        setRevenueStats(revenueStatsData); // ⭐️ Set revenue state

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

  // --- Loading / Error States (No changes) ---
  if (loading) return <div className="loading-spinner">Loading Dashboard Data...</div>;
  if (error) return <div className="error-message">Error loading data: {error}</div>;

  // --- Calculate Total Rent (No changes) ---
  const totalRent = (stats ? Number(stats.for_rent) : 0) + (stats ? Number(stats.for_rent_daily) : 0);

  // --- JSX (Return - Updated) ---
  return (
    <div>
      {/* --- Stat Cards Section (Updated) --- */}
      <div className="stat-cards-container">
        {/* Property Stats */}
        <div className="stat-card"><h3>Total Units</h3><p>{stats?.total_properties ?? 0}</p></div>
        <div className="stat-card"><h3>Available</h3><p>{stats?.available ?? 0}</p></div>
        <div className="stat-card"><h3>Reserved</h3><p>{stats?.reserved ?? 0}</p></div>
        <div className="stat-card"><h3>For Sale</h3><p>{stats?.for_sale ?? 0}</p></div>
        <div className="stat-card"><h3>Total Rent</h3><p>{totalRent}</p></div>
        <div className="stat-card"><h3>Daily Rent</h3><p>{stats?.for_rent_daily ?? 0}</p></div>

        {/* ⭐️ Revenue Stats ⭐️ */}
        <div className="stat-card revenue">
          <h3>Total Revenue</h3>
          <p>{formatCurrency(revenueStats?.total_revenue)}</p>
        </div>
        <div className="stat-card revenue">
          <h3>Sales Revenue</h3>
          <p>{formatCurrency(revenueStats?.sales_revenue)}</p>
        </div>
        <div className="stat-card revenue">
          <h3>Rental Revenue</h3>
          <p>{formatCurrency(revenueStats?.rental_revenue)}</p>
        </div>
         <div className="stat-card revenue">
          <h3>Units Sold</h3>
          <p>{revenueStats?.units_sold ?? 0}</p>
        </div>
         <div className="stat-card revenue">
          <h3>Units Rented</h3>
          <p>{revenueStats?.units_rented ?? 0}</p>
        </div>
         <div className="stat-card revenue">
          <h3>Total Transactions</h3>
          <p>{revenueStats?.total_transactions ?? 0}</p>
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