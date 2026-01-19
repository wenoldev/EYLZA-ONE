export const DEVICE_CONFIG = {
  mobile: { width: 375, height: 667, label: "Mobile", icon: "Smartphone" },
  tablet: { width: 768, height: 1024, label: "Tablet", icon: "Tablet" },
  desktop: { width: 1440, height: 900, label: "Desktop", icon: "Monitor" },
} as const

export function getDeviceWidth(device: string): number {
  return (DEVICE_CONFIG as any)[device]?.width || 1440
}

export function getDeviceHeight(device: string): number {
  return (DEVICE_CONFIG as any)[device]?.height || 900
}

export function getIframeStyle(device: string, orientation: string) {
  const config = (DEVICE_CONFIG as any)[device]
  if (!config) return { width: "100%", height: "100%" }

  const width = orientation === "landscape" ? config.height : config.width
  const height = orientation === "landscape" ? config.width : config.height

  return {
    width: `${width}px`,
    height: `${height}px`,
    maxWidth: "100%",
  }
}
