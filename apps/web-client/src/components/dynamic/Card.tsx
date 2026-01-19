import type { CardSimpleConfig } from './types/Card';
import { generateCardConfig } from './utils/cardConfigGenerator';
import CardMain from './components/CardMain';

const Card = (data: CardSimpleConfig) => {
  const $config = generateCardConfig(data);

  return <CardMain config={$config} />;
};

export default Card;
