import { create } from 'zustand';
import { IDashboardFrame, IVisual } from '../../shared/types/dashboard';

interface IDashboardStore {
  dashboards: IDashboardFrame[];
  visuals: IVisual[];
  selectedDashboardId: string | null;
  
  setDashboards: (dashboards: IDashboardFrame[]) => void;
  addDashboard: (dashboard: IDashboardFrame) => void;
  removeDashboard: (id: string) => void;
  selectDashboard: (id: string | null) => void;
  
  setVisuals: (visuals: IVisual[]) => void;
  addVisual: (visual: IVisual) => void;
  removeVisual: (id: string) => void;
  updateVisual: (id: string, updates: Partial<IVisual>) => void;
  
  getVisualsForDashboard: (dashboardId: string) => IVisual[];
  getDashboardForVisual: (visualId: string) => IDashboardFrame | null;
}

export const useDashboardStore = create<IDashboardStore>((set, get) => ({
  dashboards: [],
  visuals: [],
  selectedDashboardId: null,

  setDashboards: (dashboards) => set({ dashboards }),
  
  addDashboard: (dashboard) => set((state) => ({ 
    dashboards: [...state.dashboards, dashboard] 
  })),
  
  removeDashboard: (id) => set((state) => ({
    dashboards: state.dashboards.filter(d => d.id !== id),
    visuals: state.visuals.filter(v => v.dashboardId !== id),
    selectedDashboardId: state.selectedDashboardId === id ? null : state.selectedDashboardId
  })),
  
  selectDashboard: (id) => set({ selectedDashboardId: id }),
  
  setVisuals: (visuals) => set({ visuals }),
  
  addVisual: (visual) => set((state) => ({ 
    visuals: [...state.visuals, visual] 
  })),
  
  removeVisual: (id) => set((state) => ({
    visuals: state.visuals.filter(v => v.id !== id)
  })),
  
  updateVisual: (id, updates) => set((state) => ({
    visuals: state.visuals.map(v => v.id === id ? { ...v, ...updates } : v)
  })),
  
  getVisualsForDashboard: (dashboardId) => {
    return get().visuals.filter(v => v.dashboardId === dashboardId);
  },
  
  getDashboardForVisual: (visualId) => {
    const visual = get().visuals.find(v => v.id === visualId);
    if (!visual) return null;
    return get().dashboards.find(d => d.id === visual.dashboardId) || null;
  }
}));
