import Highcharts from 'highcharts';
import { BaseChartBuilder } from './BaseChartBuilder';
import { IChartConfig } from '../../../shared/types/charts';

export class PieChartBuilder extends BaseChartBuilder {
  build(config: IChartConfig): string {
    const { data, labels = (data as number[])?.map((_, i) => `Category ${i + 1}`) ?? [], title = 'Pie Chart', subtitle = '', width = 600, height = 400 } = config;
    const container = this.createContainer(width, height);

    try {
      const pieData = (data as number[]).map((value, i) => ({ name: labels[i], y: value }));
      Highcharts.chart(container, {
        chart: { type: 'pie', width, height, backgroundColor: '#ffffff', animation: false, style: { fontFamily: 'Inter, Arial, sans-serif' } },
        title: { text: title, align: 'left', style: { fontSize: '24px', fontWeight: '700', color: '#111827' } },
        subtitle: { text: subtitle, align: 'left', style: { fontSize: '16px', color: '#6b7280' } },
        plotOptions: { series: { animation: false }, pie: { dataLabels: { enabled: true, format: '{point.name}: {point.percentage:.1f}%', style: { fontSize: '11px', fontWeight: '500', color: '#374151', textOutline: 'none' } } } },
        series: [{ type: 'pie', name: 'Value', data: pieData, colors: ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#43e97b'] }],
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
