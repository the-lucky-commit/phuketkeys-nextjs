'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import styles from './profile.module.css';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface UserProfile {
  id: number;
  username: string;
  email: string;
  full_name?: string;
  phone?: string;
  role: string;
  created_at: string;
}

interface FavoriteProperty {
  id: number;
  property_id: number;
  property_title: string;
  property_price: number;
  property_image: string;
  added_at: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'info' | 'favorites' | 'settings'>('info');
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [favorites, setFavorites] = useState<FavoriteProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  
  // Form states
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const checkAuth = useCallback(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/customer-login');
    }
  }, [router]);

  const getAuthHeaders = useCallback(() => {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
  }, []);

  const fetchProfile = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/users/profile`, {
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        setProfile(data);
        setUsername(data.username || '');
        setEmail(data.email || '');
        setFullName(data.full_name || '');
        setPhone(data.phone || '');
      } else {
        alert('Failed to load profile');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  }, [getAuthHeaders]);

  const fetchFavorites = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/users/favorites`, {
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        console.log('Favorites data:', data); // Debug
        setFavorites(data);
      } else {
        console.error('Failed to fetch favorites, status:', res.status);
      }
    } catch (error) {
      console.error('Error fetching favorites:', error);
    }
  }, [getAuthHeaders]);

  useEffect(() => {
    checkAuth();
    fetchProfile();
    fetchFavorites();
  }, [checkAuth, fetchProfile, fetchFavorites]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE_URL}/api/users/profile`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ 
          username, 
          email, 
          full_name: fullName, 
          phone 
        }),
      });

      if (res.ok) {
        alert('Profile updated successfully!');
        setIsEditing(false);
        fetchProfile();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile');
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      alert('New passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      alert('New password must be at least 6 characters');
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/users/change-password`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ 
          current_password: currentPassword, 
          new_password: newPassword 
        }),
      });

      if (res.ok) {
        alert('Password changed successfully!');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to change password');
      }
    } catch (error) {
      console.error('Error changing password:', error);
      alert('Error changing password');
    }
  };

  const handleRemoveFavorite = async (propertyId: number) => {
    if (!confirm('Remove this property from favorites?')) return;

    try {
      const res = await fetch(`${API_BASE_URL}/api/users/favorites/${propertyId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      if (res.ok) {
        alert('Removed from favorites');
        fetchFavorites();
      } else {
        alert('Failed to remove from favorites');
      }
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className={styles.container}>
          <div className={styles.loading}>Loading profile...</div>
        </div>
      </>
    );
  }

  if (!profile) {
    return (
      <>
        <Navbar />
        <div className={styles.container}>
          <div className={styles.error}>Failed to load profile</div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className={styles.container}>
        <div className={styles.profileCard}>
        <div className={styles.header}>
          <div className={styles.avatar}>
            <i className="fas fa-user-circle"></i>
          </div>
          <div className={styles.userInfo}>
            <h1>{profile.full_name || profile.username}</h1>
            <p className={styles.email}>{profile.email}</p>
            <span className={styles.badge}>{profile.role}</span>
          </div>
        </div>

        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${activeTab === 'info' ? styles.active : ''}`}
            onClick={() => setActiveTab('info')}
          >
            <i className="fas fa-user"></i> Personal Info
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'favorites' ? styles.active : ''}`}
            onClick={() => setActiveTab('favorites')}
          >
            <i className="fas fa-heart"></i> Favorites ({favorites.length})
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'settings' ? styles.active : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <i className="fas fa-cog"></i> Settings
          </button>
        </div>

        <div className={styles.content}>
          {activeTab === 'info' && (
            <div className={styles.infoTab}>
              {!isEditing ? (
                <div className={styles.infoDisplay}>
                  <div className={styles.infoRow}>
                    <label>Username:</label>
                    <span>{profile.username || 'N/A'}</span>
                  </div>
                  <div className={styles.infoRow}>
                    <label>Email:</label>
                    <span>{profile.email || 'N/A'}</span>
                  </div>
                  <div className={styles.infoRow}>
                    <label>Full Name:</label>
                    <span>{profile.full_name || 'Not set'}</span>
                  </div>
                  <div className={styles.infoRow}>
                    <label>Phone:</label>
                    <span>{profile.phone || 'Not set'}</span>
                  </div>
                  <div className={styles.infoRow}>
                    <label>Member Since:</label>
                    <span>{new Date(profile.created_at).toLocaleDateString()}</span>
                  </div>
                  <button 
                    className={styles.editButton}
                    onClick={() => setIsEditing(true)}
                  >
                    <i className="fas fa-edit"></i> Edit Profile
                  </button>
                </div>
              ) : (
                <form onSubmit={handleUpdateProfile} className={styles.editForm}>
                  <div className={styles.formGroup}>
                    <label>Username</label>
                    <input 
                      type="text" 
                      value={username || ''} 
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Enter your username"
                      required
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Email</label>
                    <input 
                      type="email" 
                      value={email || ''} 
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Full Name</label>
                    <input
                      type="text"
                      value={fullName || ''}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Phone</label>
                    <input
                      type="tel"
                      value={phone || ''}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Enter your phone number"
                    />
                  </div>
                  <div className={styles.formActions}>
                    <button type="submit" className={styles.saveButton}>
                      <i className="fas fa-save"></i> Save Changes
                    </button>
                    <button
                      type="button"
                      className={styles.cancelButton}
                      onClick={() => {
                        setIsEditing(false);
                        setUsername(profile.username || '');
                        setEmail(profile.email || '');
                        setFullName(profile.full_name || '');
                        setPhone(profile.phone || '');
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {activeTab === 'favorites' && (
            <div className={styles.favoritesTab}>
              {favorites.length === 0 ? (
                <div className={styles.emptyState}>
                  <i className="fas fa-heart-broken"></i>
                  <p>No favorites yet</p>
                  <a href="/properties" className={styles.browseButton}>
                    Browse Properties
                  </a>
                </div>
              ) : (
                <div className={styles.favoritesGrid}>
                  {favorites.map((fav) => (
                    <div key={fav.id} className={styles.favoriteCard}>
                      <Image 
                        src={fav.property_image || '/img/default-property.jpg'} 
                        alt={fav.property_title}
                        className={styles.propertyImage}
                        width={300}
                        height={200}
                      />
                      <div className={styles.favoriteInfo}>
                        <h3>{fav.property_title}</h3>
                        <p className={styles.price}>฿{fav.property_price.toLocaleString()}</p>
                        <small>Added: {new Date(fav.added_at).toLocaleDateString()}</small>
                      </div>
                      <div className={styles.favoriteActions}>
                        <a 
                          href={`/property/${fav.property_id}`}
                          className={styles.viewButton}
                        >
                          View
                        </a>
                        <button
                          onClick={() => handleRemoveFavorite(fav.property_id)}
                          className={styles.removeButton}
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'settings' && (
            <div className={styles.settingsTab}>
              <h2>Change Password</h2>
              <form onSubmit={handleChangePassword} className={styles.passwordForm}>
                <div className={styles.formGroup}>
                  <label>Current Password</label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Confirm New Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                </div>
                <button type="submit" className={styles.changePasswordButton}>
                  <i className="fas fa-key"></i> Change Password
                </button>
              </form>

              <div className={styles.dangerZone}>
                <h3>Danger Zone</h3>
                <button 
                  className={styles.logoutButton}
                  onClick={() => {
                    localStorage.removeItem('token');
                    router.push('/customer-login');
                  }}
                >
                  <i className="fas fa-sign-out-alt"></i> Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
    </>
  );
}
