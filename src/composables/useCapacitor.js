import { Capacitor } from '@capacitor/core'

export function useCapacitor() {
  const isNative = Capacitor.isNativePlatform()
  const platform = Capacitor.getPlatform() // 'ios', 'android', or 'web'
  const isIos = platform === 'ios'
  const isAndroid = platform === 'android'

  return { isNative, platform, isIos, isAndroid }
}
