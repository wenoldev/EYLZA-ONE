import React, { useState, useEffect } from 'react';
import Slider from './Slider';
import type { SliderConfig } from '../../types/Slider';
import Loader from '../theme-support/Loader';
import { getSliderItems } from '../../libs/fetchStoreProducts';

const SliderAPI: React.FC<Omit<SliderConfig, 'items'>> = (config) => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const data = await getSliderItems();
        setItems(data);
      } catch (error) {
        console.error('Failed to fetch slider items:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  if (loading) {
    return <Loader />;
  }

  return <Slider {...config} items={items} />;
};

export default SliderAPI;
