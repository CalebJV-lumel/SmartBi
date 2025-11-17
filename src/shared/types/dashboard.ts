export interface IDashboardFrame {
  id: string;
  name: string;
  width: number;
  height: number;
  x: number;
  y: number;
  visualIds: string[];
}

export interface IVisual {
  id: string;
  name: string;
  type: string;
  dashboardId: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface IDashboardConfig {
  width: number;
  height: number;
}

export const DEFAULT_DASHBOARD_CONFIG: IDashboardConfig = {
  width: 1200,
  height: 768,
};
