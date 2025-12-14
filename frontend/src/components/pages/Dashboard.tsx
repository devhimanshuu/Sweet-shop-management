import React, { useState, useEffect } from 'react';
import type { Sweet, SearchParams } from '../../types';
import { sweetAPI } from '../../services/api';
import { Navbar } from '../layouts/Navbar';
import { SweetCard } from '../sweets/SweetCard';
import { SearchBar } from '../sweets/SearchBar';
import { Button } from '../ui/button';
import { useAuth } from '../../context/AuthContext';
import { AddSweetDialog } from "../sweets/AddSweetDialog";

export const Dashboard: React.FC = () => {
  const [sweets, setSweets] = useState<Sweet[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const { isAdmin } = useAuth();

  const fetchSweets = async (params?: SearchParams) => {
    setLoading(true);
    try {
      const response = params && Object.keys(params).length > 0
        ? await sweetAPI.search(params)
        : await sweetAPI.getAll();
      setSweets(response.data);
    } catch (error) {
      console.error('Failed to fetch sweets:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSweets();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
            Sweet Inventory
          </h1>
          {isAdmin && (
            <Button 
              onClick={() => setShowAddDialog(true)}
              className="w-full sm:w-auto bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <span className="mr-2">+</span> Add Sweet
            </Button>
          )}
        </div>

        <div className="mb-6">
          <SearchBar onSearch={fetchSweets} />
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            <p className="mt-4 text-gray-600">Loading sweets...</p>
          </div>
        ) : sweets.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🍭</div>
            <p className="text-gray-600 text-lg font-medium">No sweets found</p>
            <p className="text-gray-500 text-sm mt-2">Try adjusting your search filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 mt-6">
            {sweets.map((sweet) => (
              <SweetCard key={sweet.id} sweet={sweet} onUpdate={() => fetchSweets()} />
            ))}
          </div>
        )}
      </div>

      {showAddDialog && (
        <AddSweetDialog 
          open={showAddDialog} 
          onClose={() => setShowAddDialog(false)}
          onSuccess={() => {
            setShowAddDialog(false);
            fetchSweets();
          }}
        />
      )}
    </div>
  );
};