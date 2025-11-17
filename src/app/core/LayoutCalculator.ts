import { IPosition, IDimensions, ILayoutRect, ILayoutCalculation } from '../../shared/types/layout';
import { IDashboardFrame, IVisual } from '../../shared/types/dashboard';

export class LayoutCalculator {
  private static instance: LayoutCalculator;
  private readonly SPACING = 10;

  private constructor() {}

  static getInstance(): LayoutCalculator {
    if (!LayoutCalculator.instance) {
      LayoutCalculator.instance = new LayoutCalculator();
    }
    return LayoutCalculator.instance;
  }

  calculateVisualLayout(
    dashboard: IDashboardFrame,
    visuals: IVisual[],
    viewportBounds?: ILayoutRect
  ): ILayoutCalculation {
    const dimensions = this.calculateDimensions(dashboard.width, dashboard.height);
    const position = this.findNextPosition(dashboard, visuals, dimensions);
    const shouldZoom = viewportBounds ? !this.isDashboardInViewport(dashboard, viewportBounds) : false;

    return { position, dimensions, shouldZoom };
  }

  private calculateDimensions(dashboardWidth: number, dashboardHeight: number): IDimensions {
    const cols = dashboardWidth >= 1200 ? 3 : dashboardWidth >= 800 ? 2 : 1;
    const width = Math.floor((dashboardWidth - this.SPACING * (cols + 1)) / cols);
    const height = Math.floor(dashboardHeight * 0.4);
    return { width, height };
  }

  private findNextPosition(
    dashboard: IDashboardFrame,
    visuals: IVisual[],
    dimensions: IDimensions
  ): IPosition {
    const occupied: ILayoutRect[] = visuals.map(v => ({
      x: v.x,
      y: v.y,
      width: v.width,
      height: v.height
    }));

    for (let y = 0; y <= dashboard.height - dimensions.height; y += dimensions.height + this.SPACING) {
      for (let x = 0; x <= dashboard.width - dimensions.width; x += dimensions.width + this.SPACING) {
        if (!this.isOverlapping(x, y, dimensions.width, dimensions.height, occupied)) {
          return { x, y };
        }
      }
    }

    return { x: this.SPACING, y: this.SPACING };
  }

  private isOverlapping(x: number, y: number, width: number, height: number, occupied: ILayoutRect[]): boolean {
    for (const rect of occupied) {
      if (
        x < rect.x + rect.width &&
        x + width > rect.x &&
        y < rect.y + rect.height &&
        y + height > rect.y
      ) {
        return true;
      }
    }
    return false;
  }

  private isDashboardInViewport(dashboard: IDashboardFrame, viewport: ILayoutRect): boolean {
    return (
      dashboard.x >= viewport.x &&
      dashboard.y >= viewport.y &&
      dashboard.x + dashboard.width <= viewport.x + viewport.width &&
      dashboard.y + dashboard.height <= viewport.y + viewport.height
    );
  }
}
