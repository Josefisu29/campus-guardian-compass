
import { useState } from 'react';
import { useToast } from './use-toast';

interface StoredImage {
  id: string;
  name: string;
  data: string; // base64 encoded
  type: string;
  size: number;
  uploadedAt: string;
  userId?: string;
}

export const useImageStorage = () => {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const uploadImage = async (file: File, category: 'location' | 'profile', userId?: string): Promise<string> => {
    setUploading(true);
    
    try {
      // Validate file
      if (!file.type.startsWith('image/')) {
        throw new Error('Please select an image file');
      }
      
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        throw new Error('Image must be less than 5MB');
      }

      // Convert to base64
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      // Create image object
      const imageId = `${category}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const storedImage: StoredImage = {
        id: imageId,
        name: file.name,
        data: base64,
        type: file.type,
        size: file.size,
        uploadedAt: new Date().toISOString(),
        userId: category === 'profile' ? userId : undefined
      };

      // Store in localStorage
      const storageKey = `images_${category}`;
      const existingImages = JSON.parse(localStorage.getItem(storageKey) || '[]');
      existingImages.push(storedImage);
      localStorage.setItem(storageKey, JSON.stringify(existingImages));

      toast({
        title: "Success",
        description: "Image uploaded successfully!",
      });

      return imageId;
    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to upload image",
        variant: "destructive",
      });
      throw error;
    } finally {
      setUploading(false);
    }
  };

  const getImage = (imageId: string, category: 'location' | 'profile'): StoredImage | null => {
    try {
      const storageKey = `images_${category}`;
      const images: StoredImage[] = JSON.parse(localStorage.getItem(storageKey) || '[]');
      return images.find(img => img.id === imageId) || null;
    } catch (error) {
      console.error('Error getting image:', error);
      return null;
    }
  };

  const deleteImage = (imageId: string, category: 'location' | 'profile'): boolean => {
    try {
      const storageKey = `images_${category}`;
      const images: StoredImage[] = JSON.parse(localStorage.getItem(storageKey) || '[]');
      const filteredImages = images.filter(img => img.id !== imageId);
      localStorage.setItem(storageKey, JSON.stringify(filteredImages));
      
      toast({
        title: "Success",
        description: "Image deleted successfully!",
      });
      
      return true;
    } catch (error: any) {
      console.error('Delete error:', error);
      toast({
        title: "Delete Failed",
        description: "Failed to delete image",
        variant: "destructive",
      });
      return false;
    }
  };

  const listImages = (category: 'location' | 'profile', userId?: string): StoredImage[] => {
    try {
      const storageKey = `images_${category}`;
      const images: StoredImage[] = JSON.parse(localStorage.getItem(storageKey) || '[]');
      
      if (category === 'profile' && userId) {
        return images.filter(img => img.userId === userId);
      }
      
      return images;
    } catch (error) {
      console.error('Error listing images:', error);
      return [];
    }
  };

  return {
    uploadImage,
    getImage,
    deleteImage,
    listImages,
    uploading
  };
};
