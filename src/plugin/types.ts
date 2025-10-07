/// <reference types="@figma/plugin-typings" />

// Message types for UI to Plugin communication
export interface UIMessage {
  type: string;
  [key: string]: any;
}

export interface CreateRectanglesMessage extends UIMessage {
  type: 'create-rectangles';
  count: number;
}

export interface InsertVisualMessage extends UIMessage {
  type: 'insert-visual';
  visualType: string;
}

export interface ExportDashboardMessage extends UIMessage {
  type: 'export-dashboard';
  format: string;
}

export interface CancelMessage extends UIMessage {
  type: 'cancel';
}

// Message types for Plugin to UI communication
export interface PluginResponse {
  type: string;
  success?: boolean;
  visualType?: string;
  message?: string;
  data?: any;
}

export interface VisualInsertedResponse extends PluginResponse {
  type: 'visual-inserted';
  success: boolean;
  visualType: string;
}

// Visual configuration types
export interface VisualConfig {
  type: string;
  size: { width: number; height: number };
  color: RGB;
  name: string;
}

// Plugin configuration
export interface PluginConfig {
  ui: {
    width: number;
    height: number;
    themeColors: boolean;
    title?: string;
  };
}
