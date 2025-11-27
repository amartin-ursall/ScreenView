import { create } from 'zustand';
import { useEffect } from 'react';
export type DeviceStatus = 'available' | 'occupied' | 'unavailable';
export interface Device {
  id: string;
  name: string;
  ip: string;
  status: DeviceStatus;
  isLocal?: boolean;
}
interface DiscoveryState {
  devices: Device[];
  localDevice: Device | null;
  isDiscovering: boolean;
  actions: {
    startDiscovery: () => void;
    stopDiscovery: () => void;
    setDeviceStatus: (id: string, status: DeviceStatus) => void;
    resetDevices: () => void;
  };
}
const mockDevices: Device[] = [
  { id: 'local-device', name: 'My MacBook Pro', ip: '192.168.1.101', status: 'available', isLocal: true },
  { id: 'device-2', name: 'PC-Oficina', ip: '192.168.1.30', status: 'available' },
  { id: 'device-3', name: 'ASUS-GAMING', ip: '192.168.1.42', status: 'occupied' },
  { id: 'device-4', name: 'PORTATIL-DE-LAURA', ip: '192.168.1.55', status: 'available' },
  { id: 'device-5', name: 'Living Room PC', ip: '192.168.1.23', status: 'unavailable' },
];
const useDiscoveryStore = create<DiscoveryState>((set, get) => ({
  devices: [],
  localDevice: null,
  isDiscovering: false,
  actions: {
    startDiscovery: () => {
      set({ isDiscovering: true, devices: [] });
      // Simulate network discovery
      setTimeout(() => {
        const local = mockDevices.find(d => d.isLocal) || null;
        const remote = mockDevices.filter(d => !d.isLocal);
        set({ devices: [...(local ? [local] : []), ...remote], localDevice: local, isDiscovering: false });
      }, 1500);
    },
    stopDiscovery: () => set({ isDiscovering: false }),
    setDeviceStatus: (id, status) => {
      set(state => ({
        devices: state.devices.map(device =>
          device.id === id ? { ...device, status } : device
        ),
      }));
    },
    resetDevices: () => {
        const local = mockDevices.find(d => d.isLocal) || null;
        const remote = mockDevices.filter(d => !d.isLocal);
        set({ devices: [...(local ? [local] : []), ...remote], localDevice: local, isDiscovering: false });
    }
  },
}));
export const useDiscovery = () => {
  const { devices, localDevice, isDiscovering } = useDiscoveryStore();
  const actions = useDiscoveryStore(state => state.actions);
  useEffect(() => {
    actions.startDiscovery();
  }, [actions]);
  return { devices, localDevice, isDiscovering, ...actions };
};
export const useDiscoveryActions = () => useDiscoveryStore(state => state.actions);