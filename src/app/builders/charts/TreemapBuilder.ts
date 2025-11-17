import Highcharts from 'highcharts';
import { BaseChartBuilder } from './BaseChartBuilder';
import { IChartConfig } from '../../../shared/types/charts';

export class TreemapBuilder extends BaseChartBuilder {
  build(config: IChartConfig): string {
    const { data, labels = (data as number[])?.map((_, i) => `Item ${i + 1}`) ?? [], title = 'Treemap', subtitle = '', width = 600, height = 400 } = config;
    const container = this.createContainer(width, height);

    try {
      const treemapData = (data as number[]).map((value, i) => ({ name: labels[i], value, colorValue: value }));
      Highcharts.chart(container, {
        chart: { type: 'treemap', width, height, backgroundColor: '#ffffff', animation: false, style: { fontFamily: 'Inter, Arial, sans-serif' } },
        title: { text: title, align: 'left', style: { fontSize: '24px', fontWeight: '700', color: '#111827' } },
        subtitle: { text: subtitle, align: 'left', style: { fontSize: '16px', color: '#6b7280' } },
        plotOptions: { series: { animation: false, dataLabels: { enabled: true, style: { fontSize: '11px', fontWeight: '500', color: '#374151', textOutline: 'none' } } } },
        series: [{ type: 'treemap', name: 'Value', data: treemapData, layoutAlgorithm: 'squarified' }],
        colorAxis: { minColor: '#e0e7ff', maxColor: '#667eea' },
        credits: { enabled: false },
      });

      const svg = this.extractSVG(container);
      this.cleanupContainer(container);
      return svg;
    } catch (error) {
      this.cleanupContainer(container);
      throw error;
    }
  }
}
