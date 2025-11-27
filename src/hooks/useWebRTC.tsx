import { create } from 'zustand';
import { useDiscoveryActions } from './useDiscovery';
import { useEffect, useRef } from 'react';
import { toast } from 'sonner';
interface WebRTCState {
  isStreaming: boolean;
  isReceiving: boolean;
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  targetDeviceId: string | null;
  stats: {
    elapsed: number;
    fps: number;
    bitrate: number;
  };
  actions: {
    startLocalPreview: () => Promise<MediaStream | null>;
    stopLocalPreview: () => void;
    startSharingTo: (deviceId: string) => void;
    stopSharing: () => void;
    setRemoteStream: (stream: MediaStream | null) => void;
  };
}
const useWebRTCStore = create<WebRTCState>((set, get) => ({
  isStreaming: false,
  isReceiving: false,
  localStream: null,
  remoteStream: null,
  targetDeviceId: null,
  stats: { elapsed: 0, fps: 0, bitrate: 0 },
  actions: {
    startLocalPreview: async () => {
      try {
        const stream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: true,
        });
        set({ localStream: stream });
        return stream;
      } catch (error) {
        console.error("Error getting display media:", error);
        toast.error("Could not access screen.", {
          description: "Please grant permission to share your screen.",
        });
        return null;
      }
    },
    stopLocalPreview: () => {
      const { localStream } = get();
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
        set({ localStream: null });
      }
    },
    startSharingTo: (deviceId) => {
      const { localStream } = get();
      if (!localStream) {
        toast.error("No screen selected", { description: "Please select a screen to share first." });
        return;
      }
      useDiscoveryActions.getState().setDeviceStatus(deviceId, 'occupied');
      set({ isStreaming: true, targetDeviceId: deviceId, stats: { elapsed: 0, fps: 30, bitrate: 4200 } });
    },
    stopSharing: () => {
      const { targetDeviceId } = get();
      if (targetDeviceId) {
        useDiscoveryActions.getState().setDeviceStatus(targetDeviceId, 'available');
      }
      get().actions.stopLocalPreview();
      set({ isStreaming: false, targetDeviceId: null, stats: { elapsed: 0, fps: 0, bitrate: 0 } });
    },
    setRemoteStream: (stream) => {
        set({ remoteStream: stream, isReceiving: !!stream });
    }
  },
}));
export const useWebRTC = () => {
    const state = useWebRTCStore();
    return { ...state, ...state.actions };
};
export const useWebRTCActions = () => useWebRTCStore(state => state.actions);
export const useStreamingTimer = () => {
    const isStreaming = useWebRTCStore(state => state.isStreaming);
    const setStats = useWebRTCStore(state => state.actions.setStats);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    useEffect(() => {
        if (isStreaming) {
            timerRef.current = setInterval(() => {
                useWebRTCStore.setState(state => ({
                    stats: {
                        ...state.stats,
                        elapsed: state.stats.elapsed + 1,
                    }
                }));
            }, 1000);
        } else {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
            useWebRTCStore.setState(state => ({ stats: { ...state.stats, elapsed: 0 } }));
        }
        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, [isStreaming]);
};