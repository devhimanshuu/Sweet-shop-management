import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { sweetAPI } from '../../services/api';
import type { Sweet } from '../../types';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { toast } from "sonner";

interface UpdateSweetDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  sweet: Sweet;
}

export const UpdateSweetDialog: React.FC<UpdateSweetDialogProps> = ({ open, onClose, onSuccess, sweet }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    quantity: '',
    description: '',
    image_url: ''
  });
  const [loading, setLoading] = useState(false);

  const categories = ['Chocolate', 'Gummy', 'Hard Candy', 'Caramel'];

  useEffect(() => {
    if (sweet) {
      setFormData({
        name: sweet.name,
        category: sweet.category,
        price: sweet.price.toString(),
        quantity: sweet.quantity.toString(),
        description: sweet.description || '',
        image_url: sweet.image_url || ''
      });
    }
  }, [sweet]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await sweetAPI.update(sweet.id, {
        ...formData,
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity)
      });

      toast.success('Sweet updated successfully! 🎉', {
        description: `${formData.name} has been updated`,
      });

      onSuccess();
      onClose();
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error('Failed to update sweet', {
          description: error.response?.data?.error || 'Something went wrong',
        });
      } else {
        toast.error('Failed to update sweet', {
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
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Sweet</DialogTitle>
          <DialogDescription>
            Update the details for {sweet.name}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Name *</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-category">Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
                required
              >
                <SelectTrigger id="edit-category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-price">Price *</Label>
                <Input
                  id="edit-price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-quantity">Quantity *</Label>
                <Input
                  id="edit-quantity"
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Input
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-image_url">Image URL</Label>
              <Input
                id="edit-image_url"
                type="url"
                placeholder="https://example.com/image.jpg"
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-linear-to-r from-pink-500 to-purple-600"
              disabled={loading}
            >
              {loading ? 'Updating...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
