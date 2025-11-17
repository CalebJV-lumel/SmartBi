import { ChartType, IChartConfig } from '../../shared/types/charts';

export class ChartDataService {
  static getDefaultConfig(type: ChartType): IChartConfig {
    const configs: Record<ChartType, IChartConfig> = {
      [ChartType.BAR]: {
        data: [45, 78, 92, 65, 88],
        labels: ['Q1', 'Q2', 'Q3', 'Q4', 'Q5'],
        title: 'Quarterly Revenue',
        subtitle: 'Sales performance',
        width: 600,
        height: 400,
      },
      [ChartType.LINE]: {
        data: [45, 78, 92, 65, 88],
        labels: ['Q1', 'Q2', 'Q3', 'Q4', 'Q5'],
        title: 'Revenue Trend',
        subtitle: 'Growth over time',
        width: 600,
        height: 400,
      },
      [ChartType.PIE]: {
        data: [45, 78, 92, 65, 88],
        labels: ['Product A', 'Product B', 'Product C', 'Product D', 'Product E'],
        title: 'Market Share',
        subtitle: 'By product',
        width: 600,
        height: 400,
      },
      [ChartType.DONUT]: {
        data: [45, 78, 92, 65, 88],
        labels: ['Product A', 'Product B', 'Product C', 'Product D', 'Product E'],
        title: 'Sales Distribution',
        subtitle: 'By category',
        width: 600,
        height: 400,
      },
      [ChartType.AREA]: {
        data: [45, 78, 92, 65, 88],
        labels: ['Q1', 'Q2', 'Q3', 'Q4', 'Q5'],
        title: 'Growth Area',
        subtitle: 'Cumulative growth',
        width: 600,
        height: 400,
      },
      [ChartType.SCATTER]: {
        data: [[10, 20], [30, 40], [50, 60], [70, 80], [90, 100]],
        title: 'Correlation Analysis',
        subtitle: 'X vs Y',
        width: 600,
        height: 400,
      },
      [ChartType.BUBBLE]: {
        data: [[10, 20, 30], [30, 40, 50], [50, 60, 70], [70, 80, 90]],
        title: 'Bubble Analysis',
        subtitle: 'Multi-dimensional data',
        width: 600,
        height: 400,
      },
      [ChartType.HISTOGRAM]: {
        data: [5, 12, 18, 25, 20, 15, 8],
        labels: ['0-10', '10-20', '20-30', '30-40', '40-50', '50-60', '60-70'],
        title: 'Distribution',
        subtitle: 'Frequency analysis',
        width: 600,
        height: 400,
      },
      [ChartType.BOX_PLOT]: {
        data: [[5, 10, 15, 20, 25], [8, 12, 18, 22, 28], [6, 11, 16, 21, 26]],
        labels: ['Group A', 'Group B', 'Group C'],
        title: 'Statistical Analysis',
        subtitle: 'Distribution comparison',
        width: 600,
        height: 400,
      },
      [ChartType.FUNNEL]: {
        data: [1000, 800, 600, 400, 200],
        labels: ['Awareness', 'Interest', 'Consideration', 'Intent', 'Purchase'],
        title: 'Sales Funnel',
        subtitle: 'Conversion stages',
        width: 600,
        height: 400,
      },
      [ChartType.WATERFALL]: {
        data: [100, 50, -30, 40, -20, 60],
        labels: ['Start', 'Revenue', 'Costs', 'Profit', 'Tax', 'Net'],
        title: 'Financial Waterfall',
        subtitle: 'Cash flow analysis',
        width: 600,
        height: 400,
      },
      [ChartType.TREEMAP]: {
        data: [100, 80, 60, 40, 20],
        labels: ['Region A', 'Region B', 'Region C', 'Region D', 'Region E'],
        title: 'Regional Performance',
        subtitle: 'Market size',
        width: 600,
        height: 400,
      },
    };

    return configs[type];
  }
}
