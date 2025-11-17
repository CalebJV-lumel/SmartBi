import { ChartType, ChartCategory, IChartMetadata } from '../types/charts';

export const CHART_METADATA: Record<ChartType, IChartMetadata> = {
  [ChartType.BAR]: {
    type: ChartType.BAR,
    name: 'Bar Chart',
    description: 'Compare values across categories',
    icon: 'BarChart3',
    category: ChartCategory.BASIC,
  },
  [ChartType.LINE]: {
    type: ChartType.LINE,
    name: 'Line Chart',
    description: 'Show trends over time',
    icon: 'LineChart',
    category: ChartCategory.BASIC,
  },
  [ChartType.PIE]: {
    type: ChartType.PIE,
    name: 'Pie Chart',
    description: 'Display proportional data',
    icon: 'PieChart',
    category: ChartCategory.BASIC,
  },
  [ChartType.DONUT]: {
    type: ChartType.DONUT,
    name: 'Donut Chart',
    description: 'Pie chart with center space',
    icon: 'Circle',
    category: ChartCategory.BASIC,
  },
  [ChartType.AREA]: {
    type: ChartType.AREA,
    name: 'Area Chart',
    description: 'Filled line chart for volume',
    icon: 'TrendingUp',
    category: ChartCategory.BASIC,
  },
  [ChartType.SCATTER]: {
    type: ChartType.SCATTER,
    name: 'Scatter Plot',
    description: 'Show correlation between variables',
    icon: 'Grid3x3',
    category: ChartCategory.STATISTICAL,
  },
  [ChartType.BUBBLE]: {
    type: ChartType.BUBBLE,
    name: 'Bubble Chart',
    description: 'Multi-dimensional scatter plot',
    icon: 'Droplets',
    category: ChartCategory.STATISTICAL,
  },
  [ChartType.HISTOGRAM]: {
    type: ChartType.HISTOGRAM,
    name: 'Histogram',
    description: 'Frequency distribution',
    icon: 'BarChart3',
    category: ChartCategory.STATISTICAL,
  },
  [ChartType.BOX_PLOT]: {
    type: ChartType.BOX_PLOT,
    name: 'Box Plot',
    description: 'Statistical data distribution',
    icon: 'Box',
    category: ChartCategory.STATISTICAL,
  },
  [ChartType.FUNNEL]: {
    type: ChartType.FUNNEL,
    name: 'Funnel Chart',
    description: 'Conversion or process stages',
    icon: 'Filter',
    category: ChartCategory.SPECIALIZED,
  },
  [ChartType.WATERFALL]: {
    type: ChartType.WATERFALL,
    name: 'Waterfall Chart',
    description: 'Sequential value changes',
    icon: 'Layers',
    category: ChartCategory.SPECIALIZED,
  },
  [ChartType.TREEMAP]: {
    type: ChartType.TREEMAP,
    name: 'Treemap',
    description: 'Hierarchical data visualization',
    icon: 'Grid3x3',
    category: ChartCategory.SPECIALIZED,
  },
};

export const CHART_CATEGORIES = [
  { key: ChartCategory.BASIC, label: 'Basic Charts' },
  { key: ChartCategory.STATISTICAL, label: 'Statistical' },
  { key: ChartCategory.SPECIALIZED, label: 'Specialized' },
];
