export type EylzaRuntimeMode = 'client' | 'editor' | 'unknown';

type CartAttributes = Record<string, string>;

export type EylzaBridge = {
  addToCart?: (product: any, quantity?: number, attributes?: CartAttributes) => void;
  useProductStore?: () => any;
};

const getGlobalObject = (): any => {
  if (typeof globalThis !== 'undefined') return globalThis as any;
  return {};
};

export const getRuntimeMode = (): EylzaRuntimeMode => {
  const runtime = getGlobalObject().__EYLZA_RUNTIME__;
  return runtime === 'client' || runtime === 'editor' ? runtime : 'unknown';
};

export const isEditorRuntime = () => getRuntimeMode() === 'editor';

export const getBridge = (): EylzaBridge => {
  return getGlobalObject().__EYLZA_BRIDGE__ || {};
};
