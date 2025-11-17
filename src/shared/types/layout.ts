export interface IPosition {
  x: number;
  y: number;
}

export interface IDimensions {
  width: number;
  height: number;
}

export interface ILayoutRect extends IPosition, IDimensions {}

export interface ILayoutCalculation {
  position: IPosition;
  dimensions: IDimensions;
  shouldZoom: boolean;
}
