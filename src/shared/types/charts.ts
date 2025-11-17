export enum ChartType {
  BAR = 'bar',
  LINE = 'line',
  PIE = 'pie',
  DONUT = 'donut',
  AREA = 'area',
  SCATTER = 'scatter',
  BUBBLE = 'bubble',
  HISTOGRAM = 'histogram',
  BOX_PLOT = 'boxplot',
  FUNNEL = 'funnel',
  WATERFALL = 'waterfall',
  TREEMAP = 'treemap',
}

export interface IChartConfig {
  data: number[] | number[][];
  labels?: string[];
  title?: string;
  subtitle?: string;
  width?: number;
  height?: number;
  series?: any[];
}

export interface IChartMetadata {
  type: ChartType;
  name: string;
  description: string;
  icon: string;
  category: ChartCategory;
}

export enum ChartCategory {
  BASIC = 'basic',
  STATISTICAL = 'statistical',
  SPECIALIZED = 'specialized',
}
