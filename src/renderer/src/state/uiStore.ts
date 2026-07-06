import { create } from 'zustand';

export type PanelId =
  | 'colors'
  | 'background'
  | 'logos'
  | 'components'
  | 'catalog'
  | 'pool'
  | 'editor'
  | 'export'
  | 'wiki';

export interface Toast {
  id: number;
  kind: 'info' | 'success' | 'error';
  message: string;
}

interface UiStore {
  activePanel: PanelId;
  collapsed: boolean;
  toasts: Toast[];
  setPanel: (panel: PanelId) => void;
  toggleCollapsed: () => void;
  pushToast: (message: string, kind?: Toast['kind']) => void;
  dismissToast: (id: number) => void;
}

let toastId = 0;

export const useUiStore = create<UiStore>((set) => ({
  activePanel: 'colors',
  collapsed: false,
  toasts: [],
  setPanel: (activePanel) => set({ activePanel }),
  toggleCollapsed: () => set((s) => ({ collapsed: !s.collapsed })),
  pushToast: (message, kind = 'info') =>
    set((s) => {
      const id = ++toastId;
      setTimeout(() => {
        useUiStore.setState((cur) => ({ toasts: cur.toasts.filter((t) => t.id !== id) }));
      }, 4200);
      return { toasts: [...s.toasts.slice(-3), { id, kind, message }] };
    }),
  dismissToast: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }))
}));
