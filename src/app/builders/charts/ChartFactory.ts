import { ChartType, IChartConfig } from '../../../shared/types/charts';
import { BarChartBuilder } from './BarChartBuilder';
import { LineChartBuilder } from './LineChartBuilder';
import { PieChartBuilder } from './PieChartBuilder';
import { DonutChartBuilder } from './DonutChartBuilder';
import { AreaChartBuilder } from './AreaChartBuilder';
import { ScatterChartBuilder } from './ScatterChartBuilder';
import { BubbleChartBuilder } from './BubbleChartBuilder';
import { HistogramBuilder } from './HistogramBuilder';
import { BoxPlotBuilder } from './BoxPlotBuilder';
import { FunnelChartBuilder } from './FunnelChartBuilder';
import { WaterfallChartBuilder } from './WaterfallChartBuilder';
import { TreemapBuilder } from './TreemapBuilder';
import { IChartBuilder } from './IChartBuilder';

export class ChartFactory {
  private static builders: Map<ChartType, IChartBuilder> = new Map([
    [ChartType.BAR, new BarChartBuilder()],
    [ChartType.LINE, new LineChartBuilder()],
    [ChartType.PIE, new PieChartBuilder()],
    [ChartType.DONUT, new DonutChartBuilder()],
    [ChartType.AREA, new AreaChartBuilder()],
    [ChartType.SCATTER, new ScatterChartBuilder()],
    [ChartType.BUBBLE, new BubbleChartBuilder()],
    [ChartType.HISTOGRAM, new HistogramBuilder()],
    [ChartType.BOX_PLOT, new BoxPlotBuilder()],
    [ChartType.FUNNEL, new FunnelChartBuilder()],
    [ChartType.WATERFALL, new WaterfallChartBuilder()],
    [ChartType.TREEMAP, new TreemapBuilder()],
  ]);

  static createChart(type: ChartType, config: IChartConfig): string {
    const builder = this.builders.get(type);
    if (!builder) {
      throw new Error(`Chart builder not found for type: ${type}`);
    }
    return builder.build(config);
  }
}
