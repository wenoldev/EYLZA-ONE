import React, { useState, useEffect } from 'react';
import Slider from './Slider';
import type { SliderConfig } from '../../types/Slider';
import Loader from '../theme-support/Loader';
// Note: getSliderItems should ideally be passed as a prop or moved to a common package
// For now, we'll assume the consumer provides the data or we move the util later.

const SliderAPI: React.FC<Omit<SliderConfig, 'items'>> = (config) => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // @ts-ignore - getSliderItems is not defined here yet
    if (typeof getSliderItems === 'function') {
      // @ts-ignore
      getSliderItems().then(data => {
        setItems(data);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return <Loader />;
  }

  return <Slider {...config} items={items} />;
};

export default SliderAPI;
