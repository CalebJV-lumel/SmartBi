import Highcharts from 'highcharts';
import { BaseChartBuilder } from './BaseChartBuilder';
import { IChartConfig } from '../../../shared/types/charts';

export class FunnelChartBuilder extends BaseChartBuilder {
  build(config: IChartConfig): string {
    const { data, labels = (data as number[])?.map((_, i) => `Stage ${i + 1}`) ?? [], title = 'Funnel Chart', subtitle = '', width = 600, height = 400 } = config;
    const container = this.createContainer(width, height);

    try {
      const funnelData = (data as number[]).map((value, i) => [labels[i], value]);
      Highcharts.chart(container, {
        chart: { type: 'funnel', width, height, backgroundColor: '#ffffff', animation: false, style: { fontFamily: 'Inter, Arial, sans-serif' } },
        title: { text: title, align: 'left', style: { fontSize: '24px', fontWeight: '700', color: '#111827' } },
        subtitle: { text: subtitle, align: 'left', style: { fontSize: '16px', color: '#6b7280' } },
        plotOptions: { series: { animation: false, dataLabels: { enabled: true, format: '{point.name}: {point.y}', style: { fontSize: '11px', fontWeight: '500', color: '#374151', textOutline: 'none' } } } },
        series: [{ type: 'funnel', name: 'Value', data: funnelData, colors: ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#43e97b'] }],
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
