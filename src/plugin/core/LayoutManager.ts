export class LayoutManager {
  private static instance: LayoutManager;

  private constructor() {}

  static getInstance(): LayoutManager {
    if (!LayoutManager.instance) {
      LayoutManager.instance = new LayoutManager();
    }
    return LayoutManager.instance;
  }

  applyLayout(node: SceneNode, x: number, y: number, width: number, height: number): void {
    if ('resize' in node) {
      node.resize(width, height);
    }
    if ('x' in node && 'y' in node) {
      node.x = x;
      node.y = y;
    }
  }

  async smartZoom(dashboardId: string, shouldZoom: boolean): Promise<void> {
    if (!shouldZoom) return;
    
    const dashboard = await figma.getNodeByIdAsync(dashboardId);
    if (dashboard) {
      figma.viewport.scrollAndZoomIntoView([dashboard]);
    }
  }
}
