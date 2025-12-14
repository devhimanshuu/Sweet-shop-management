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
import { toast } from "sonner";

interface DeleteSweetDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  sweetName: string;
  sweetId: number;
}

export const DeleteSweetDialog: React.FC<DeleteSweetDialogProps> = ({ open, onClose, onSuccess, sweetName, sweetId }) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);

    try {
      await sweetAPI.delete(sweetId);

      toast.success('Sweet deleted', {
        description: `${sweetName} has been removed`,
      });

      onSuccess();
      onClose();
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error('Delete failed', {
          description: error.response?.data?.error || 'Something went wrong',
        });
      } else {
        toast.error('Delete failed', {
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
          <DialogTitle>Delete {sweetName}</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete {sweetName}? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        
        <DialogFooter className="sm:justify-start">
          <div className="flex w-full gap-2 justify-end">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
                Cancel
            </Button>
            <Button 
                type="button" 
                variant="destructive"
                onClick={handleDelete}
                disabled={loading}
                className="bg-red-600 hover:bg-red-700 text-white"
            >
                {loading ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
