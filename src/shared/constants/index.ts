/**
 * Shared Constants
 */

export const PLUGIN_CONFIG = {
  NAME: 'SmartBi Dashboard Creator',
  VERSION: '1.0.0',
  PLUGIN_ID: 'smartbi-plugin',
  UI: {
    WIDTH: 400,
    HEIGHT: 600,
    MIN_WIDTH: 400,
    MIN_HEIGHT: 500
  }
} as const;

export const NODE_DEFAULTS = {
  WIDTH: 200,
  HEIGHT: 200,
  SPACING: 20
} as const;

export const COLORS = {
  PRIMARY: '#0066ff',
  SUCCESS: '#00c853',
  ERROR: '#ff3d00',
  WARNING: '#ffa000'
} as const;
