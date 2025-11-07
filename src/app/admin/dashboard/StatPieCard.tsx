'use client';

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface StatPieCardProps {
  title: string;
  value: number;
  total: number;
  colors: string[];
  subtitle?: string;
}

export default function StatPieCard({ title, value, total, colors, subtitle }: StatPieCardProps) {
  const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
  const remaining = Math.max(0, total - value);
  
  // If value equals total (100%), show full circle
  const data = remaining === 0 && value > 0
    ? [{ name: title, value: 100 }]
    : [
        { name: title, value: value },
        { name: 'Others', value: remaining }
      ];

  return (
    <div className="stat-card" style={{ 
      display: 'flex', 
      flexDirection: 'column',
      padding: '25px',
      position: 'relative',
      minHeight: '320px'
    }}>
      {/* Header */}
      <div style={{ marginBottom: '20px', textAlign: 'center' }}>
        <h3 style={{ 
          fontSize: '1.2rem', 
          fontWeight: '600',
          color: '#1a2e44',
          marginBottom: '8px'
        }}>
          {title}
        </h3>
        {subtitle && (
          <p style={{ 
            fontSize: '0.85rem', 
            color: '#666',
            margin: 0 
          }}>
            {subtitle}
          </p>
        )}
      </div>
      
      {/* Chart */}
      <div style={{ 
        width: '100%', 
        height: '180px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        marginBottom: '15px'
      }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={75}
              paddingAngle={remaining === 0 ? 0 : 3}
              dataKey="value"
              startAngle={90}
              endAngle={-270}
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={colors[index % colors.length]}
                  stroke="#fff"
                  strokeWidth={2}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        
        {/* Center text */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center'
        }}>
          <div style={{ 
            fontSize: '2.5rem', 
            fontWeight: 'bold',
            color: colors[0],
            lineHeight: '1',
            marginBottom: '5px'
          }}>
            {value}
          </div>
          <div style={{ 
            fontSize: '1rem', 
            color: '#888',
            fontWeight: '500'
          }}>
            {percentage}%
          </div>
        </div>
      </div>
      
      {/* Summary Details */}
      <div style={{
        borderTop: '1px solid #eef0f2',
        paddingTop: '15px',
        marginTop: 'auto'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '8px'
        }}>
          <span style={{ 
            fontSize: '0.9rem', 
            color: '#555',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <span style={{
              width: '12px',
              height: '12px',
              borderRadius: '3px',
              backgroundColor: colors[0],
              display: 'inline-block'
            }}></span>
            {title}
          </span>
          <span style={{ 
            fontSize: '0.9rem', 
            fontWeight: '600',
            color: colors[0]
          }}>
            {value} units
          </span>
        </div>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '8px'
        }}>
          <span style={{ 
            fontSize: '0.9rem', 
            color: '#555',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <span style={{
              width: '12px',
              height: '12px',
              borderRadius: '3px',
              backgroundColor: colors[1],
              display: 'inline-block'
            }}></span>
            Others
          </span>
          <span style={{ 
            fontSize: '0.9rem', 
            fontWeight: '600',
            color: colors[1]
          }}>
            {remaining} units
          </span>
        </div>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          paddingTop: '8px',
          borderTop: '1px solid #f0f0f0'
        }}>
          <span style={{ 
            fontSize: '0.9rem', 
            color: '#333',
            fontWeight: '600'
          }}>
            Total Properties
          </span>
          <span style={{ 
            fontSize: '0.9rem', 
            fontWeight: '700',
            color: '#1a2e44'
          }}>
            {total} units
          </span>
        </div>
      </div>
    </div>
  );
}
