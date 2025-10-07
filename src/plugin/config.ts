import { PluginConfig, VisualConfig } from './types';

/**
 * Plugin configuration constants
 */
export const PLUGIN_CONFIG: PluginConfig = {
  ui: {
    width: 500,
    height: 600,
    themeColors: true,
    title: 'Dashboard Creator - Professional Visual Builder'
  },
};

/**
 * Visual type configurations
 */
export const VISUAL_CONFIGS: Record<string, VisualConfig> = {
  line: {
    type: 'line',
    size: { width: 400, height: 300 },
    color: { r: 0.2, g: 0.6, b: 1 },
    name: 'Line Chart',
  },
  bar: {
    type: 'bar',
    size: { width: 350, height: 400 },
    color: { r: 0.3, g: 0.8, b: 0.4 },
    name: 'Bar Chart',
  },
  pie: {
    type: 'pie',
    size: { width: 300, height: 300 },
    color: { r: 1, g: 0.6, b: 0.2 },
    name: 'Pie Chart',
  },
  table: {
    type: 'table',
    size: { width: 500, height: 350 },
    color: { r: 0.5, g: 0.5, b: 0.8 },
    name: 'Data Table',
  },
  kpi: {
    type: 'kpi',
    size: { width: 200, height: 150 },
    color: { r: 0.9, g: 0.3, b: 0.3 },
    name: 'KPI Card',
  },
  gauge: {
    type: 'gauge',
    size: { width: 250, height: 250 },
    color: { r: 0.6, g: 0.4, b: 0.9 },
    name: 'Gauge Chart',
  },
};

/**
 * Default visual configuration
 */
export const DEFAULT_VISUAL_CONFIG: VisualConfig = {
  type: 'default',
  size: { width: 400, height: 300 },
  color: { r: 0.5, g: 0.5, b: 0.5 },
  name: 'Default Visual',
};
