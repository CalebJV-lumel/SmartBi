import Highcharts from 'highcharts';
import { IChartBuilder } from './IChartBuilder';
import { IChartConfig } from '../../../shared/types/charts';

let modulesLoaded = false;

if (!modulesLoaded) {
  try {
    const more = require('highcharts/highcharts-more');
    const funnel = require('highcharts/modules/funnel');
    const treemap = require('highcharts/modules/treemap');
    
    if (typeof more === 'function') more(Highcharts);
    if (typeof funnel === 'function') funnel(Highcharts);
    if (typeof treemap === 'function') treemap(Highcharts);
    
    modulesLoaded = true;
  } catch (e) {
    console.warn('Highcharts modules loading error:', e);
  }
}

export abstract class BaseChartBuilder implements IChartBuilder {
  protected createContainer(width: number, height: number): HTMLDivElement {
    const container = document.createElement('div');
    container.style.width = `${width}px`;
    container.style.height = `${height}px`;
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    container.style.top = '0';
    container.style.visibility = 'hidden';
    document.body.appendChild(container);
    return container;
  }

  protected cleanupContainer(container: HTMLDivElement): void {
    if (container.parentNode) {
      document.body.removeChild(container);
    }
  }

  protected extractSVG(container: HTMLDivElement): string {
    const svgElement = container.querySelector('svg');
    if (!svgElement) {
      throw new Error('No SVG element found in chart container');
    }

    const clonedSvg = svgElement.cloneNode(true) as SVGElement;
    clonedSvg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    clonedSvg.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');

    const allElements = clonedSvg.querySelectorAll('*');
    allElements.forEach((element) => {
      const computedStyle = window.getComputedStyle(element as Element);
      const inlineStyle: string[] = [];
      const stylesToCopy = [
        'fill',
        'stroke',
        'stroke-width',
        'font-family',
        'font-size',
        'font-weight',
        'text-anchor',
        'height',
      ];
      stylesToCopy.forEach((prop) => {
        const value = computedStyle.getPropertyValue(prop);
        if (value && value !== 'none' && value !== 'normal') {
          inlineStyle.push(`${prop}:${value}`);
        }
      });
      if (inlineStyle.length > 0) {
        element.setAttribute('style', inlineStyle.join(';'));
      }
    });

    const serializer = new XMLSerializer();
    return serializer.serializeToString(clonedSvg);
  }

  protected getDefaultConfig(config: IChartConfig) {
    return {
      width: config.width || 600,
      height: config.height || 400,
      title: config.title || 'Chart',
      subtitle: config.subtitle || '',
    };
  }

  abstract build(config: IChartConfig): string;
}
