/**
 * Type Definitions for Dashboard Creator Plugin
 * Following industrial naming conventions: T for Types
 * Using consistent typing from MessageHandler plugin
 */

// Re-export the plugin's visual node enum for consistency
export { EVisualNodeType } from '../handlers/MessageHandler';

// ============================================================================
// VISUAL TYPES (Dashboard Specific)
// ============================================================================

export type TVisualType = 
  | 'line-chart'
  | 'bar-chart'
  | 'pie-chart'
  | 'area-chart'
  | 'scatter-chart'
  | 'bubble-chart'
  | 'histogram'
  | 'box-plot'
  | 'heatmap'
  | 'treemap'
  | 'sankey'
  | 'funnel'
  | 'gauge'
  | 'kpi-card'
  | 'data-table'
  | 'pivot-table'
  | 'matrix'
  | 'scorecard'
  | 'timeline'
  | 'gantt'
  | 'calendar'
  | 'map'
  | 'network'
  | 'hierarchy';

// ============================================================================
// EXPORT TYPES
// ============================================================================

export type TExportFormat = 
  | 'png'
  | 'jpg'
  | 'svg'
  | 'pdf'
  | 'json'
  | 'figma'
  | 'sketch'
  | 'adobe-xd'
  | 'html'
  | 'css'
  | 'react'
  | 'vue'
  | 'angular';

export type TExportQuality = 
  | 'low'
  | 'medium'
  | 'high'
  | 'ultra';

export type TCompressionType = 
  | 'none'
  | 'lossless'
  | 'lossy'
  | 'adaptive';

export type TColorSpace = 
  | 'sRGB'
  | 'P3'
  | 'Rec2020'
  | 'CMYK';

// ============================================================================
// POSITIONING TYPES
// ============================================================================

export type TPositionReference = 
  | 'viewport-center'
  | 'viewport-top-left'
  | 'viewport-top-right'
  | 'viewport-bottom-left'
  | 'viewport-bottom-right'
  | 'page-center'
  | 'selection-center'
  | 'cursor-position'
  | 'custom';

export type TConstraintType = 
  | 'MIN'
  | 'CENTER'
  | 'MAX'
  | 'STRETCH'
  | 'SCALE';

// ============================================================================
// STYLING TYPES
// ============================================================================

export type TStrokeAlign = 
  | 'INSIDE'
  | 'OUTSIDE'
  | 'CENTER';

export type TEffectType = 
  | 'DROP_SHADOW'
  | 'INNER_SHADOW'
  | 'LAYER_BLUR'
  | 'BACKGROUND_BLUR';

// ============================================================================
// ERROR TYPES
// ============================================================================

export type TErrorCode = 
  | 'VALIDATION_ERROR'
  | 'CREATION_FAILED'
  | 'UPDATE_FAILED'
  | 'DELETE_FAILED'
  | 'EXPORT_FAILED'
  | 'PERMISSION_DENIED'
  | 'ELEMENT_NOT_FOUND'
  | 'INVALID_CONFIGURATION'
  | 'NETWORK_ERROR'
  | 'TIMEOUT_ERROR'
  | 'UNKNOWN_ERROR';

export type TValidationErrorCode = 
  | 'REQUIRED_FIELD'
  | 'INVALID_TYPE'
  | 'OUT_OF_RANGE'
  | 'INVALID_FORMAT'
  | 'CONSTRAINT_VIOLATION'
  | 'DEPENDENCY_MISSING';

// ============================================================================
// LOG TYPES
// ============================================================================

export type TLogLevel = 
  | 'debug'
  | 'info'
  | 'warn'
  | 'error'
  | 'fatal';

export type TLogContext = 
  | 'plugin-init'
  | 'element-creation'
  | 'element-update'
  | 'element-deletion'
  | 'export-operation'
  | 'ui-interaction'
  | 'service-call'
// ============================================================================
// UI TYPES
// ============================================================================

export type TTabType = 
  | 'basic'
  | 'styling'
  | 'position'
  | 'effects'
  | 'settings'
  | 'help';

export type TElementCategory = 
  | 'basic-shapes'
  | 'tables'
  | 'kpis'
  | 'layouts'
  | 'components'
  | 'media'
  | 'interactive'
  | 'custom';

export type TTheme = 
  | 'light'
  | 'dark'
  | 'auto'
  | 'high-contrast';

// ============================================================================
// SERVICE TYPES
// ============================================================================

export type TServiceStatus = 
  | 'initializing'
  | 'ready'
  | 'busy'
  | 'error'
  | 'shutdown';

export type TOperationStatus = 
  | 'pending'
  | 'in-progress'
  | 'completed'
  | 'failed'
  | 'cancelled';

// ============================================================================
// UTILITY TYPES
// ============================================================================

export type TDeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? TDeepPartial<T[P]> : T[P];
};

export type TRequired<T, K extends keyof T> = T & Required<Pick<T, K>>;

export type TOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type TPickByType<T, U> = {
  [K in keyof T]: T[K] extends U ? K : never;
}[keyof T];

export type TOmitByType<T, U> = {
  [K in keyof T]: T[K] extends U ? never : K;
}[keyof T];

// ============================================================================
// FUNCTION TYPES
// ============================================================================

export type TEventHandler<T = any> = (event: T) => void | Promise<void>;

export type TAsyncFunction<TArgs extends any[] = any[], TReturn = any> = 
  (...args: TArgs) => Promise<TReturn>;

export type TValidatorFunction<T> = (value: T) => boolean | string;

export type TTransformerFunction<TInput, TOutput> = (input: TInput) => TOutput;

export type TPredicateFunction<T> = (value: T) => boolean;

// ============================================================================
// CONFIGURATION TYPES
// ============================================================================

export type TConfigurationKey = 
  | 'ui.width'
  | 'ui.height'
  | 'ui.theme'
  | 'defaults.element.size'
  | 'defaults.element.position'
  | 'defaults.export.format'
  | 'defaults.export.quality'
  | 'features.logging'
  | 'features.metadata'
  | 'features.versioning';

export type TConfigurationValue = string | number | boolean | object;

// ============================================================================
// PLUGIN LIFECYCLE TYPES
// ============================================================================

export type TPluginPhase = 
  | 'initialization'
  | 'ui-setup'
  | 'service-registration'
  | 'ready'
  | 'shutdown';

export type TPluginEvent = 
  | 'plugin-loaded'
  | 'ui-ready'
  | 'element-created'
  | 'element-updated'
  | 'element-deleted'
  | 'export-started'
  | 'export-completed'
  | 'error-occurred'
  | 'plugin-unloaded';
