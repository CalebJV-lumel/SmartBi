import type { ExportSettings } from '@figma/plugin-typings/plugin-api-standalone';

export enum ENodeType {
  RECTANGLE = 'RECTANGLE',
  ELLIPSE = 'ELLIPSE',
  TEXT = 'TEXT',
  FRAME = 'FRAME',
  LINE = 'LINE',
}

export enum EUIMessageType {
  CREATE_NODE = 'create-node',
  IMPORT_SVG = 'import-svg',
  UPDATE_NODE = 'update-node',
  DELETE_NODE = 'delete-node',
  GET_NODES = 'get-nodes',
  SELECT_NODE = 'select-node',
  EXPORT_SELECTION = 'export-selection',
  UI_READY = 'ui-ready',
}

export enum EPluginMessageType {
  NODE_CREATED = 'node-created',
  NODE_UPDATED = 'node-updated',
  NODE_DELETED = 'node-deleted',
  NODES_DATA = 'nodes-data',
  SELECTION_CHANGED = 'selection-changed',
  EXPORT_COMPLETE = 'export-complete',
  ERROR = 'error',
}

export enum EExportFormat {
  PNG = 'PNG',
  JPG = 'JPG',
  SVG = 'SVG',
  PDF = 'PDF',
}

export interface IUIMessage<T = unknown> {
  type: EUIMessageType;
  payload?: T;
  requestId?: string;
}

export type { TNodeConfig as ICreateNodePayload } from './nodes';

export interface ICreateVisualPayload {
  config: TNodeConfig;
  dashboardId: string;
  x: number;
  y: number;
  width: number;
  height: number;
  shouldZoom: boolean;
}

import type { TNodeConfig } from './nodes';

export interface IUpdateNodePayload {
  id: string;
  properties: {
    name?: string;
    x?: number;
    y?: number;
    visible?: boolean;
    locked?: boolean;
  };
}

export interface IDeleteNodePayload {
  ids: string[];
}

export interface ISelectNodePayload {
  id: string;
}

export interface IImportSVGPayload {
  svg: string;
  name: string;
  x?: number;
  y?: number;
}

export interface IExportPayload {
  format: EExportFormat;
  settings?: ExportSettings;
}

export type { ExportSettings };

export interface IPluginMessage<T = unknown> {
  type: EPluginMessageType;
  success: boolean;
  data?: T;
  error?: string;
  timestamp: number;
  requestId?: string;
}

export interface INodeData {
  id: string;
  name: string;
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  visible: boolean;
  locked: boolean;
}

export interface INodesDataPayload {
  nodes: INodeData[];
  dashboards?: import('./dashboard').IDashboardFrame[];
  visuals?: import('./dashboard').IVisual[];
}

export interface INodeCreatedPayload {
  id: string;
  name: string;
  type: string;
}

export interface INodeUpdatedPayload {
  id: string;
}

export interface INodeDeletedPayload {
  ids: string[];
}

export interface ISelectionChangedPayload {
  id: string;
  dashboardId?: string;
}

export interface IExportData {
  format: EExportFormat;
  data: Uint8Array;
  filename: string;
}
