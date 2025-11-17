import { IChartConfig } from '../../../shared/types/charts';

export interface IChartBuilder {
  build(config: IChartConfig): string;
}
