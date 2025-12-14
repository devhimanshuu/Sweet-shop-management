import React, { useState } from 'react';
import axios from 'axios';
import { sweetAPI } from '../../services/api';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { toast } from "sonner";

interface RestockDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  sweetName: string;
  sweetId: number;
}

export const RestockDialog: React.FC<RestockDialogProps> = ({ open, onClose, onSuccess, sweetName, sweetId }) => {
  const [quantity, setQuantity] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quantity || isNaN(Number(quantity)) || Number(quantity) <= 0) {
        toast.error('Invalid quantity', {
            description: "Please enter a valid positive number"
        });
        return;
    }
    
    setLoading(true);

    try {
      await sweetAPI.restock(sweetId, Number(quantity));

      toast.success('Restock successful! 🎉', {
        description: `Added ${quantity} items to ${sweetName}`,
      });

      onSuccess(); // This should trigger the refresh in the parent
      setQuantity('');
      onClose();
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error('Restock failed', {
          description: error.response?.data?.error || 'Something went wrong',
        });
      } else {
        toast.error('Restock failed', {
          description: 'Something went wrong',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(val) => {
        if (!val) onClose();
    }}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Restock {sweetName}</DialogTitle>
          <DialogDescription>
            Enter the quantity of items to add to the inventory for {sweetName}.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="quantity" className="text-right">
                Quantity
              </Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="0"
                className="col-span-3"
                autoFocus
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
                type="submit" 
                disabled={loading}
                className="bg-linear-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white"
            >
              {loading ? 'Restocking...' : 'Restock'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
