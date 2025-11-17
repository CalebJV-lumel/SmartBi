import Highcharts from 'highcharts';
import { BaseChartBuilder } from './BaseChartBuilder';
import { IChartConfig } from '../../../shared/types/charts';

export class BarChartBuilder extends BaseChartBuilder {
  build(config: IChartConfig): string {
    const {
      data,
      labels = (data as number[])?.map((_, i) => `Category ${i + 1}`) ?? [],
      title = 'Bar Chart',
      subtitle = '',
      width = 600,
      height = 400,
    } = config;
    const container = this.createContainer(width, height);

    try {
      Highcharts.chart(container, {
        chart: {
          type: 'column',
          width,
          height,
          backgroundColor: '#ffffff',
          animation: false,
          style: { fontFamily: 'Inter, Arial, sans-serif' },
        },
        title: { text: title, align: 'left', style: { fontSize: '24px', fontWeight: '700', color: '#111827' } },
        subtitle: { text: subtitle, align: 'left', style: { fontSize: '16px', color: '#6b7280' } },
        legend: { itemStyle: { fontSize: '14px', fontWeight: '500', color: '#374151' } },
        xAxis: { categories: labels, lineColor: '#d1d5db', tickColor: '#d1d5db', labels: { style: { fontSize: '14px', color: '#4b5563' } } },
        yAxis: { min: 0, gridLineColor: '#e5e7eb', title: { text: 'Values', style: { fontSize: '14px', color: '#4b5563', fontWeight: '600' } }, labels: { style: { fontSize: '14px', color: '#4b5563' } } },
        plotOptions: {
          column: {
            pointPadding: 0.2,
            borderWidth: 0,
            borderRadius: 4,
            dataLabels: {
              enabled: true,
              style: { fontSize: '11px', fontWeight: '500', color: '#374151', textOutline: 'none' },
            },
          },
          series: { animation: false },
        },
        series: [{ type: 'column', name: 'Value', data: data as number[], color: '#667eea' }],
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
