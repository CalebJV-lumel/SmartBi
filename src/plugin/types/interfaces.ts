/// <reference types="@figma/plugin-typings" />

import { 
  EVisualNodeType, 
  TExportFormat, 
  TPositionReference, 
  TStrokeAlign,
  TElementCategory,
  TErrorCode,
  TExportQuality,
  TCompressionType,
  TColorSpace,
  TValidationErrorCode,
  TEffectType,
  TConstraintType
} from './types';

/**
 * Core Interfaces for Dashboard Creator Plugin
{{ ... }}
 * Following industrial naming conventions: I for Interfaces, T for Types, E for Enums
 */

// ============================================================================
// MESSAGE INTERFACES
// ============================================================================

export interface IUIMessage {
  type: string;
  payload?: Record<string, any>;
  timestamp?: string;
  requestId?: string;
}

export interface ICreateElementMessage extends IUIMessage {
  type: 'create-element';
  payload: {
    elementType: EVisualNodeType;
    config: IElementConfig;
    position?: IPosition;
  };
}

export interface ICreateMultipleElementsMessage extends IUIMessage {
  type: 'create-multiple-elements';
  payload: {
    elements: Array<{
      elementType: EVisualNodeType;
      config: IElementConfig;
      position?: IPosition;
    }>;
  };
}

export interface IExportDashboardMessage extends IUIMessage {
  type: 'export-dashboard';
  payload: {
    format: TExportFormat;
    options: IExportOptions;
  };
}

export interface IUpdateElementMessage extends IUIMessage {
  type: 'update-element';
  payload: {
    elementId: string;
    updates: Partial<IElementConfig>;
  };
}

export interface IDeleteElementMessage extends IUIMessage {
  type: 'delete-element';
  payload: {
    elementIds: string[];
  };
}

export interface ICancelMessage extends IUIMessage {
  type: 'cancel';
}

// ============================================================================
// RESPONSE INTERFACES
// ============================================================================

export interface IPluginResponse {
  type: string;
  success: boolean;
  message?: string;
  data?: Record<string, unknown> | string | number | boolean | null | Uint8Array;
  timestamp: string;
  requestId?: string;
}

export interface IElementCreatedResponse extends IPluginResponse {
  type: 'element-created';
  data: {
    elementId: string;
    elementType: EVisualNodeType;
    metadata: IElementMetadata;
  };
}

export interface IMultipleElementsCreatedResponse extends IPluginResponse {
  type: 'multiple-elements-created';
  data: {
    elements: Array<{
      elementId: string;
      elementType: EVisualNodeType;
      metadata: IElementMetadata;
    }>;
  };
}

export interface IExportCompletedResponse extends IPluginResponse {
  type: 'export-completed';
  data: {
    format: TExportFormat;
    exportData: Uint8Array | string | Record<string, unknown>;
    metadata: IExportMetadata;
  };
}

// ============================================================================
// CONFIGURATION INTERFACES
// ============================================================================

export interface IPluginConfig {
  ui: IUIConfig;
  defaults: IDefaultConfig;
  features: IFeatureConfig;
}

export interface IUIConfig {
  width: number;
  height: number;
  themeColors: boolean;
  resizable?: boolean;
  title?: string;
}

export interface IDefaultConfig {
  elements: Record<EVisualNodeType, IElementConfig>;
  export: IExportOptions;
  positioning: IPositioningConfig;
}

export interface IFeatureConfig {
  enableLogging: boolean;
  enableMetadata: boolean;
  enableVersioning: boolean;
  enableUndo: boolean;
}

// ============================================================================
// ELEMENT INTERFACES
// ============================================================================

export interface IElementConfig {
  name?: string;
  size: ISize;
  position?: IPosition;
  styling: IStyling;
  metadata?: Record<string, any>;
  constraints?: IConstraints;
  effects?: IEffect[];
  blendMode?: BlendMode;
  opacity?: number;
  visible?: boolean;
  locked?: boolean;
}

export interface ISize {
  width: number;
  height: number;
  maintainAspectRatio?: boolean;
}

export interface IPosition {
  x: number;
  y: number;
  relativeTo?: TPositionReference;
}

export interface IStyling {
  fills?: Paint[];
  strokes?: Paint[];
  strokeWeight?: number;
  strokeAlign?: TStrokeAlign;
  cornerRadius?: number | number[];
  effects?: Effect[];
}

export interface IConstraints {
  horizontal: TConstraintType;
  vertical: TConstraintType;
}

export interface IEffect {
  type: TEffectType;
  visible: boolean;
  radius?: number;
  color?: RGBA;
  offset?: IVector;
  spread?: number;
  blendMode?: BlendMode;
}

export interface IVector {
  x: number;
  y: number;
}

// ============================================================================
// METADATA INTERFACES
// ============================================================================

export interface IElementMetadata {
  id: string;
  type: EVisualNodeType;
  createdAt: string;
  updatedAt: string;
  version: string;
  creator: string;
  tags: string[];
  customData: Record<string, any>;
}

export interface IExportMetadata {
  exportedAt: string;
  format: TExportFormat;
  version: string;
  elementCount: number;
  fileSize?: number;
  settings: IExportOptions;
}

// ============================================================================
// SERVICE INTERFACES
// ============================================================================

export interface IElementService {
  createElement(elementType: EVisualNodeType, config: IElementConfig): Promise<IServiceResult<SceneNode>>;
  createMultipleElements(elements: Array<{ elementType: EVisualNodeType; config: IElementConfig }>): Promise<IServiceResult<SceneNode[]>>;
  updateElement(elementId: string, updates: Partial<IElementConfig>): Promise<IServiceResult<SceneNode>>;
  deleteElement(elementId: string): Promise<IServiceResult<void>>;
  getElementById(elementId: string): Promise<IServiceResult<SceneNode>>;
  getElementsByType(elementType: EVisualNodeType): Promise<IServiceResult<SceneNode[]>>;
}

export interface IExportService {
  exportElements(elementIds: string[], format: TExportFormat, options: IExportOptions): Promise<IServiceResult<any>>;
  exportPage(format: TExportFormat, options: IExportOptions): Promise<IServiceResult<any>>;
  getSupportedFormats(): TExportFormat[];
}

export interface IMetadataService {
  storeMetadata(elementId: string, metadata: IElementMetadata): Promise<IServiceResult<void>>;
  getMetadata(elementId: string): Promise<IServiceResult<IElementMetadata>>;
  updateMetadata(elementId: string, updates: Partial<IElementMetadata>): Promise<IServiceResult<IElementMetadata>>;
  deleteMetadata(elementId: string): Promise<IServiceResult<void>>;
  searchByMetadata(query: Record<string, any>): Promise<IServiceResult<IElementMetadata[]>>;
}

export interface IUtilityService {
  generateId(): string;
  getCurrentTimestamp(): string;
  validateConfig(config: IElementConfig): IValidationResult;
  sanitizeInput(input: unknown): Record<string, unknown>;
  calculateBounds(elements: SceneNode[]): IRect;
}

// ============================================================================
// RESULT INTERFACES
// ============================================================================

export interface IServiceResult<T> {
  success: boolean;
  data?: T;
  error?: IServiceError;
  metadata?: Record<string, any>;
}

export interface IServiceError {
  code: TErrorCode;
  message: string;
  details?: Record<string, any>;
  stack?: string;
}

export interface IValidationResult {
  isValid: boolean;
  errors: IValidationError[];
  warnings: IValidationWarning[];
}

export interface IValidationError {
  field: string;
  message: string;
  code: TValidationErrorCode;
}

export interface IValidationWarning {
  field: string;
  message: string;
  suggestion?: string;
}

// ============================================================================
// COMPONENT INTERFACES
// ============================================================================

export interface IBaseComponentProps {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  testId?: string;
}

export interface IVisualLibraryProps extends IBaseComponentProps {
  onElementSelect: (elementType: EVisualNodeType) => void;
  selectedElement?: EVisualNodeType;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  categories?: TElementCategory[];
  isLoading?: boolean;
}

export interface IPropertyEditorProps extends IBaseComponentProps {
  selectedElement?: EVisualNodeType | null;
  elementConfig: IElementConfig;
  onConfigChange: (config: IElementConfig) => void;
  isReadOnly?: boolean;
  validationErrors?: IValidationError[];
}

export interface IExportPanelProps extends IBaseComponentProps {
  onExport: (format: TExportFormat, options: Record<string, unknown>) => void;
  isExporting?: boolean;
  exportFormats?: TExportFormat[];
  selectedElements?: string[];
  supportedFormats?: TExportFormat[];
  exportProgress?: number;
}

// ============================================================================
// UTILITY INTERFACES
// ============================================================================

export interface IRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface IExportOptions {
  quality: TExportQuality;
  scale: number;
  format: TExportFormat;
  includeMetadata: boolean;
  compression?: TCompressionType;
  colorSpace?: TColorSpace;
  background?: Paint;
}

export interface IPositioningConfig {
  defaultPosition: IPosition;
  snapToGrid: boolean;
  gridSize: number;
  smartGuides: boolean;
  autoAlign: boolean;
}
