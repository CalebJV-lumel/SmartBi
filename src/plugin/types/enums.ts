/**
 * Enum Definitions for Dashboard Creator Plugin
 * Following industrial naming conventions: E for Enums
 */

// ============================================================================
// ELEMENT ENUMS
// ============================================================================

export enum EFigmaElementType {
  RECTANGLE = 'rectangle',
  ELLIPSE = 'ellipse',
  POLYGON = 'polygon',
  STAR = 'star',
  VECTOR = 'vector',
  TEXT = 'text',
  FRAME = 'frame',
  GROUP = 'group',
  COMPONENT = 'component',
  INSTANCE = 'instance',
  LINE = 'line',
  SLICE = 'slice',
  BOOLEAN_OPERATION = 'boolean-operation',
  IMAGE = 'image',
  VIDEO = 'video',
  EMBED = 'embed',
  LINK = 'link',
  STICKY = 'sticky',
  CONNECTOR = 'connector',
  CODE_BLOCK = 'code-block',
  WIDGET = 'widget',
  TABLE = 'table',
  SECTION = 'section'
}

export enum EVisualType {
  LINE_CHART = 'line-chart',
  BAR_CHART = 'bar-chart',
  PIE_CHART = 'pie-chart',
  AREA_CHART = 'area-chart',
  SCATTER_CHART = 'scatter-chart',
  BUBBLE_CHART = 'bubble-chart',
  HISTOGRAM = 'histogram',
  BOX_PLOT = 'box-plot',
  HEATMAP = 'heatmap',
  TREEMAP = 'treemap',
  SANKEY = 'sankey',
  FUNNEL = 'funnel',
  GAUGE = 'gauge',
  KPI_CARD = 'kpi-card',
  DATA_TABLE = 'data-table',
  PIVOT_TABLE = 'pivot-table',
  MATRIX = 'matrix',
  SCORECARD = 'scorecard',
  TIMELINE = 'timeline',
  GANTT = 'gantt',
  CALENDAR = 'calendar',
  MAP = 'map',
  NETWORK = 'network',
  HIERARCHY = 'hierarchy'
}

// ============================================================================
// EXPORT ENUMS
// ============================================================================

export enum EExportFormat {
  PNG = 'png',
  JPG = 'jpg',
  SVG = 'svg',
  PDF = 'pdf',
  JSON = 'json',
  FIGMA = 'figma',
  SKETCH = 'sketch',
  ADOBE_XD = 'adobe-xd',
  HTML = 'html',
  CSS = 'css',
  REACT = 'react',
  VUE = 'vue',
  ANGULAR = 'angular'
}

export enum EExportQuality {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  ULTRA = 'ultra'
}

export enum ECompressionType {
  NONE = 'none',
  LOSSLESS = 'lossless',
  LOSSY = 'lossy',
  ADAPTIVE = 'adaptive'
}

export enum EColorSpace {
  SRGB = 'sRGB',
  P3 = 'P3',
  REC2020 = 'Rec2020',
  CMYK = 'CMYK'
}

// ============================================================================
// POSITIONING ENUMS
// ============================================================================

export enum EPositionReference {
  VIEWPORT_CENTER = 'viewport-center',
  VIEWPORT_TOP_LEFT = 'viewport-top-left',
  VIEWPORT_TOP_RIGHT = 'viewport-top-right',
  VIEWPORT_BOTTOM_LEFT = 'viewport-bottom-left',
  VIEWPORT_BOTTOM_RIGHT = 'viewport-bottom-right',
  PAGE_CENTER = 'page-center',
  SELECTION_CENTER = 'selection-center',
  CURSOR_POSITION = 'cursor-position',
  CUSTOM = 'custom'
}

export enum EConstraintType {
  MIN = 'MIN',
  CENTER = 'CENTER',
  MAX = 'MAX',
  STRETCH = 'STRETCH',
  SCALE = 'SCALE'
}

// ============================================================================
// STYLING ENUMS
// ============================================================================

export enum EStrokeAlign {
  INSIDE = 'INSIDE',
  OUTSIDE = 'OUTSIDE',
  CENTER = 'CENTER'
}

export enum EEffectType {
  DROP_SHADOW = 'DROP_SHADOW',
  INNER_SHADOW = 'INNER_SHADOW',
  LAYER_BLUR = 'LAYER_BLUR',
  BACKGROUND_BLUR = 'BACKGROUND_BLUR'
}

// ============================================================================
// ERROR ENUMS
// ============================================================================

export enum EErrorCode {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  CREATION_FAILED = 'CREATION_FAILED',
  UPDATE_FAILED = 'UPDATE_FAILED',
  DELETE_FAILED = 'DELETE_FAILED',
  EXPORT_FAILED = 'EXPORT_FAILED',
  PERMISSION_DENIED = 'PERMISSION_DENIED',
  ELEMENT_NOT_FOUND = 'ELEMENT_NOT_FOUND',
  INVALID_CONFIGURATION = 'INVALID_CONFIGURATION',
  NETWORK_ERROR = 'NETWORK_ERROR',
  TIMEOUT_ERROR = 'TIMEOUT_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR'
}

export enum EValidationErrorCode {
  REQUIRED_FIELD = 'REQUIRED_FIELD',
  INVALID_TYPE = 'INVALID_TYPE',
  OUT_OF_RANGE = 'OUT_OF_RANGE',
  INVALID_FORMAT = 'INVALID_FORMAT',
  CONSTRAINT_VIOLATION = 'CONSTRAINT_VIOLATION',
  DEPENDENCY_MISSING = 'DEPENDENCY_MISSING'
}

// ============================================================================
// LOG ENUMS
// ============================================================================

export enum ELogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
  FATAL = 'fatal'
}

export enum ELogContext {
  PLUGIN_INIT = 'plugin-init',
  ELEMENT_CREATION = 'element-creation',
  ELEMENT_UPDATE = 'element-update',
  ELEMENT_DELETION = 'element-deletion',
  EXPORT_OPERATION = 'export-operation',
  UI_INTERACTION = 'ui-interaction',
  SERVICE_CALL = 'service-call',
  ERROR_HANDLING = 'error-handling'
}

// ============================================================================
// UI ENUMS
// ============================================================================

export enum ETabType {
  LIBRARY = 'library',
  EDITOR = 'editor',
  EXPORT = 'export',
  SETTINGS = 'settings',
  HELP = 'help'
}

export enum EElementCategory {
  BASIC_SHAPES = 'basic-shapes',
  CHARTS = 'charts',
  TABLES = 'tables',
  KPIS = 'kpis',
  LAYOUTS = 'layouts',
  COMPONENTS = 'components',
  MEDIA = 'media',
  INTERACTIVE = 'interactive',
  CUSTOM = 'custom'
}

export enum ETheme {
  LIGHT = 'light',
  DARK = 'dark',
  AUTO = 'auto',
  HIGH_CONTRAST = 'high-contrast'
}

// ============================================================================
// SERVICE ENUMS
// ============================================================================

export enum EServiceStatus {
  INITIALIZING = 'initializing',
  READY = 'ready',
  BUSY = 'busy',
  ERROR = 'error',
  SHUTDOWN = 'shutdown'
}

export enum EOperationStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in-progress',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled'
}

// ============================================================================
// MESSAGE ENUMS
// ============================================================================

export enum EMessageType {
  // Element Operations
  CREATE_ELEMENT = 'create-element',
  CREATE_MULTIPLE_ELEMENTS = 'create-multiple-elements',
  UPDATE_ELEMENT = 'update-element',
  DELETE_ELEMENT = 'delete-element',
  
  // Export Operations
  EXPORT_DASHBOARD = 'export-dashboard',
  EXPORT_ELEMENTS = 'export-elements',
  
  // UI Operations
  UI_READY = 'ui-ready',
  PLUGIN_READY = 'plugin-ready',
  CANCEL = 'cancel',
  
  // Response Types
  ELEMENT_CREATED = 'element-created',
  MULTIPLE_ELEMENTS_CREATED = 'multiple-elements-created',
  ELEMENT_UPDATED = 'element-updated',
  ELEMENT_DELETED = 'element-deleted',
  EXPORT_COMPLETED = 'export-completed',
  ERROR_OCCURRED = 'error-occurred'
}

// ============================================================================
// PLUGIN LIFECYCLE ENUMS
// ============================================================================

export enum EPluginPhase {
  INITIALIZATION = 'initialization',
  UI_SETUP = 'ui-setup',
  SERVICE_REGISTRATION = 'service-registration',
  READY = 'ready',
  SHUTDOWN = 'shutdown'
}

export enum EPluginEvent {
  PLUGIN_LOADED = 'plugin-loaded',
  UI_READY = 'ui-ready',
  ELEMENT_CREATED = 'element-created',
  ELEMENT_UPDATED = 'element-updated',
  ELEMENT_DELETED = 'element-deleted',
  EXPORT_STARTED = 'export-started',
  EXPORT_COMPLETED = 'export-completed',
  ERROR_OCCURRED = 'error-occurred',
  PLUGIN_UNLOADED = 'plugin-unloaded'
}

// ============================================================================
// CONFIGURATION ENUMS
// ============================================================================

export enum EConfigurationSection {
  UI = 'ui',
  DEFAULTS = 'defaults',
  FEATURES = 'features',
  SERVICES = 'services',
  LOGGING = 'logging'
}

export enum EFeatureFlag {
  ENABLE_LOGGING = 'enableLogging',
  ENABLE_METADATA = 'enableMetadata',
  ENABLE_VERSIONING = 'enableVersioning',
  ENABLE_UNDO = 'enableUndo',
  ENABLE_COLLABORATION = 'enableCollaboration',
  ENABLE_ANALYTICS = 'enableAnalytics'
}
