'use client';

import { useState } from 'react';

export default function CleaningServices() {
  const [activeTab, setActiveTab] = useState<'general' | 'deep'>('general');

  return (
    <section id="services" className="cleaning-services-section">
      <div className="container">
        <h2>Complete Property Management & Cleaning</h2>
        
        {/* --- จุดที่แก้ไข --- */}
        <p style={{ textAlign: 'center', maxWidth: '800px', margin: '-10px auto 50px auto', color: '#555' }}>
          For investors, PHUKET KEYS offers a one-stop solution. We don&apos;t just help you find the perfect property; we manage it for you, including professional cleaning services to keep your asset in pristine condition.
        </p>

        <div className="tabs-container">
          <button
            className={`tab-button ${activeTab === 'general' ? 'active' : ''}`}
            onClick={() => setActiveTab('general')}
          >
            General Cleaning (One-Time)
          </button>
          <button
            className={`tab-button ${activeTab === 'deep' ? 'active' : ''}`}
            onClick={() => setActiveTab('deep')}
          >
            Deep Cleaning
          </button>
        </div>

        <div className="tab-content">
          {activeTab === 'general' && (
            <div className="pricing-table">
              <table>
                <thead>
                  <tr>
                    <th>Property Type</th>
                    <th>Area (sq.m.)</th>
                    <th>Est. Duration</th>
                    <th>Price (THB)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Condo / Studio</td>
                    <td>25-40</td>
                    <td>2-3 Hours</td>
                    <td>800 - 1,200</td>
                  </tr>
                  <tr>
                    <td>1-Story House (Townhouse)</td>
                    <td>60-100</td>
                    <td>3-4 Hours</td>
                    <td>1,500 - 2,000</td>
                  </tr>
                  <tr>
                    <td>2-Story House</td>
                    <td>120-180</td>
                    <td>4-5 Hours</td>
                    <td>2,500 - 3,500</td>
                  </tr>
                  <tr>
                    <td>Office / Shop</td>
                    <td>200+</td>
                    <td>3-4 Hours</td>
                    <td>Starts at 1,500</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'deep' && (
            <div className="pricing-table">
               <table>
                <thead>
                  <tr>
                    <th>Property Type</th>
                    <th>Area (sq.m.)</th>
                    <th>Est. Duration</th>
                    <th>Est. Price (THB)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Condo / Studio</td>
                    <td>25-40</td>
                    <td>3-4 Hours</td>
                    <td>1,800 - 2,500</td>
                  </tr>
                  <tr>
                    <td>1-Story House (Townhouse)</td>
                    <td>60-100</td>
                    <td>4-6 Hours</td>
                    <td>3,000 - 4,500</td>
                  </tr>
                  <tr>
                    <td>2-Story House</td>
                    <td>120-180</td>
                    <td>5-8 Hours</td>
                    <td>5,000 - 7,500</td>
                  </tr>
                  <tr>
                    <td>Large House / 3+ Stories</td>
                    <td>200+</td>
                    <td>6-10 Hours</td>
                    <td>Starts at 8,000+</td>
                  </tr>
                </tbody>
              </table>
              <p className="deep-cleaning-note">
                ✓ Recommended for homes not deep cleaned in the last 6-12 months for a truly thorough clean.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}