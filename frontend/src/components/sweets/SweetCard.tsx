import React, { useState } from 'react';
import { RestockDialog } from './RestockDialog';
import { DeleteSweetDialog } from './DeleteSweetDialog';
import axios from 'axios';
import type { Sweet } from '../../types/index';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { useAuth } from '../../context/AuthContext';
import { sweetAPI } from '../../services/api';
import { toast } from "sonner"

interface SweetCardProps {
  sweet: Sweet;
  onUpdate: () => void;
}

export const SweetCard: React.FC<SweetCardProps> = ({ sweet, onUpdate }) => {
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isRestockOpen, setIsRestockOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const { isAdmin } = useAuth();

  const handlePurchase = async () => {
    if (quantity <= 0 || quantity > sweet.quantity) {
      toast.error('Invalid quantity', {
        description: `Please enter a quantity between 1 and ${sweet.quantity}`,
      });
      return;
    }

    setLoading(true);
    try {
      await sweetAPI.purchase(sweet.id, quantity);
      toast.success('Purchase successful! 🎉', {
        description: `Purchased ${quantity} ${sweet.name}`,
      });
      setQuantity(1);
      onUpdate();
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error('Purchase failed', {
          description: error.response?.data?.error || 'Something went wrong',
        });
      } else {
        toast.error('Purchase failed', {
          description: 'Something went wrong',
        });
      }
    } finally {
      setLoading(false);
    }
  };





  return (
    <Card className="hover:shadow-xl transition-all duration-300 overflow-hidden border-2 hover:border-purple-300 transform hover:-translate-y-1">
      <div className="h-48 sm:h-56 overflow-hidden bg-linear-to-br from-pink-100 to-purple-100 relative group">
        {sweet.image_url && !imageError ? (
          <img 
            src={sweet.image_url} 
            alt={sweet.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-6xl sm:text-7xl transition-transform duration-300 group-hover:scale-110">
            🍬
          </div>
        )}
        {sweet.quantity === 0 && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <Badge variant="destructive" className="text-lg px-4 py-2">
              Out of Stock
            </Badge>
          </div>
        )}
      </div>
      
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <CardTitle className="text-lg sm:text-xl font-bold line-clamp-2">{sweet.name}</CardTitle>
          <Badge variant="secondary" className="shrink-0">{sweet.category}</Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <p className="text-sm text-gray-600 line-clamp-2 min-h-10">{sweet.description || 'No description available'}</p>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pt-2 border-t">
          <span className="text-2xl sm:text-3xl font-bold bg-linear-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
            ${Number(sweet.price).toFixed(2)}
          </span>
          <Badge 
            variant={sweet.quantity > 10 ? "default" : sweet.quantity > 0 ? "secondary" : "destructive"}
            className={`shrink-0 ${sweet.quantity > 10 ? "bg-green-500 hover:bg-green-600" : sweet.quantity > 0 ? "bg-yellow-500 hover:bg-yellow-600" : ""}`}
          >
            {sweet.quantity > 0 ? `${sweet.quantity} in stock` : 'Out of stock'}
          </Badge>
        </div>
      </CardContent>

      <CardFooter className="flex flex-col space-y-2 pt-4">
        {sweet.quantity > 0 ? (
          <div className="w-full space-y-2">
            <div className="flex gap-2">
              <Input
                type="number"
                min="1"
                max={sweet.quantity}
                value={quantity}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  if (val >= 1 && val <= sweet.quantity) {
                    setQuantity(val);
                  }
                }}
                className="w-20 sm:w-24 transition-all focus:ring-2 focus:ring-purple-500"
              />
              <Button 
                onClick={handlePurchase}
                className="flex-1 bg-linear-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center">
                    <span className="animate-spin mr-2">⏳</span>
                    Processing...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <span className="mr-2">🛒</span>
                    Purchase
                  </span>
                )}
              </Button>
            </div>
          </div>
        ) : (
          <Button disabled className="w-full opacity-50 cursor-not-allowed">
            Out of Stock
          </Button>
        )}
        
        {isAdmin && (
          <div className="w-full flex flex-col sm:flex-row gap-2 pt-2 border-t">
            <Button 
              onClick={() => setIsRestockOpen(true)}
              variant="outline"
              className="flex-1 transition-all duration-200 hover:bg-green-50 hover:border-green-300"
            >
              📦 Restock
            </Button>
            <Button 
              onClick={() => setIsDeleteOpen(true)}
              variant="destructive"
              className="flex-1 transition-all duration-200 hover:bg-red-600"
            >
              🗑️ Delete
            </Button>
          </div>
        )}
      </CardFooter>

      <RestockDialog 
        open={isRestockOpen} 
        onClose={() => setIsRestockOpen(false)} 
        onSuccess={onUpdate}
        sweetName={sweet.name}
        sweetId={sweet.id}
      />
      <DeleteSweetDialog
        open={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onSuccess={onUpdate}
        sweetName={sweet.name}
        sweetId={sweet.id}
      />
    </Card>
  );
};