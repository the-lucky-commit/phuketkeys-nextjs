// src/app/CleaningServices.tsx
'use client';

import { useState } from 'react';
import styles from './CleaningServices.module.css'; // Correct import

export default function CleaningServices() {
  const [activeTab, setActiveTab] = useState<'general' | 'deep'>('general');

  return (
    // Use styles.cleaningServicesSection
    <section id="services" className={styles.cleaningServicesSection}>
      {/* Assuming "container" is a global class */}
      <div className="container">
        <h2>Complete Property Management & Cleaning</h2>

        <p style={{ textAlign: 'center', maxWidth: '800px', margin: '-10px auto 50px auto', color: '#555' }}>
          For investors, PHUKET KEYS offers a one-stop solution. We don&apos;t just help you find the perfect property; we manage it for you, including professional cleaning services to keep your asset in pristine condition.
        </p>

        {/* Use styles.tabsContainer */}
        <div className={styles.tabsContainer}>
          <button
            // Use styles.tabButton and styles.active
            className={`${styles.tabButton} ${activeTab === 'general' ? styles.active : ''}`}
            onClick={() => setActiveTab('general')}
          >
            {/* Add <span> according to CSS */}
            <span>General Cleaning (One-Time)</span>
          </button>
          <button
            // Use styles.tabButton and styles.active
            className={`${styles.tabButton} ${activeTab === 'deep' ? styles.active : ''}`}
            onClick={() => setActiveTab('deep')}
          >
             {/* Add <span> according to CSS */}
            <span>Deep Cleaning</span>
          </button>
        </div>

        {/* Optional: Add styles.tabContent if defined in CSS */}
        <div /* className={styles.tabContent} */ >
          {activeTab === 'general' && (
            // Use styles.pricingTable
            <div className={styles.pricingTable}>
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
             // Use styles.pricingTable
            <div className={styles.pricingTable}>
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
               {/* Use styles.deepCleaningNote */}
              <div className={styles.deepCleaningNote}>
                 <p>
                  <strong>Note:</strong> Deep cleaning prices are estimates. Final cost depends on property condition. Recommended for first-time cleans or properties not deep cleaned recently.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}