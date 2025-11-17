import Highcharts from 'highcharts';
import { BaseChartBuilder } from './BaseChartBuilder';
import { IChartConfig } from '../../../shared/types/charts';

export class ScatterChartBuilder extends BaseChartBuilder {
  build(config: IChartConfig): string {
    const { data, title = 'Scatter Chart', subtitle = '', width = 600, height = 400 } = config;
    const container = this.createContainer(width, height);

    try {
      Highcharts.chart(container, {
        chart: { type: 'scatter', width, height, backgroundColor: '#ffffff', animation: false, style: { fontFamily: 'Inter, Arial, sans-serif' } },
        title: { text: title, align: 'left', style: { fontSize: '24px', fontWeight: '700', color: '#111827' } },
        subtitle: { text: subtitle, align: 'left', style: { fontSize: '16px', color: '#6b7280' } },
        legend: { itemStyle: { fontSize: '14px', fontWeight: '500', color: '#374151' } },        xAxis: { gridLineColor: '#e5e7eb', title: { text: 'X Axis', style: { fontSize: '14px', color: '#4b5563' } }, labels: { style: { fontSize: '14px', color: '#4b5563' } } },
        yAxis: { gridLineColor: '#e5e7eb', title: { text: 'Y Axis', style: { fontSize: '14px', color: '#4b5563' } }, labels: { style: { fontSize: '14px', color: '#4b5563' } } },
        plotOptions: { series: { animation: false }, scatter: { marker: { radius: 5 }, dataLabels: { enabled: true, style: { fontSize: '10px', fontWeight: '500', color: '#374151', textOutline: 'none' } } } },
        series: [{ type: 'scatter', name: 'Data', data: data as number[][], color: '#667eea' }],
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
