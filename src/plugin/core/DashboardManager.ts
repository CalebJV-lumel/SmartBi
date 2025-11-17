import { IDashboardFrame, IVisual } from '../../shared/types/dashboard';
import { PLUGIN_CONFIG } from '../../shared/constants';

export class DashboardManager {
  private static instance: DashboardManager;
  private readonly PLUGIN_DATA_KEY = PLUGIN_CONFIG.PLUGIN_ID;
  private readonly DASHBOARD_KEY = 'dashboard';
  private readonly VISUAL_KEY = 'visual';

  private constructor() {}

  static getInstance(): DashboardManager {
    if (!DashboardManager.instance) {
      DashboardManager.instance = new DashboardManager();
    }
    return DashboardManager.instance;
  }

  async getDashboards(): Promise<IDashboardFrame[]> {
    const frames = figma.currentPage.findAll(
      (node) =>
        node.type === 'FRAME' &&
        node.getPluginData(this.PLUGIN_DATA_KEY) === 'true' &&
        node.getPluginData(this.DASHBOARD_KEY) === 'true'
    ) as FrameNode[];

    return frames.map((frame) => ({
      id: frame.id,
      name: frame.name,
      width: frame.width,
      height: frame.height,
      x: frame.x,
      y: frame.y,
      visualIds: frame.children.map((child) => child.id),
    }));
  }

  async getVisuals(): Promise<IVisual[]> {
    const dashboards = await this.getDashboards();
    const visuals: IVisual[] = [];

    for (const dashboard of dashboards) {
      const frame = await figma.getNodeByIdAsync(dashboard.id) as FrameNode | null;
      if (!frame) continue;

      frame.children.forEach((child) => {
        if (child.getPluginData(this.PLUGIN_DATA_KEY) === 'true') {
          if ('x' in child && 'y' in child && 'width' in child && 'height' in child) {
            visuals.push({
              id: child.id,
              name: child.name,
              type: child.type,
              dashboardId: dashboard.id,
              x: child.x,
              y: child.y,
              width: child.width,
              height: child.height,
            });
          }
        }
      });
    }

    return visuals;
  }

  async markAsDashboard(nodeId: string): Promise<void> {
    const node = await figma.getNodeByIdAsync(nodeId);
    if (node && node.type === 'FRAME') {
      node.setPluginData(this.DASHBOARD_KEY, 'true');
    }
  }

  async markAsVisual(nodeId: string): Promise<void> {
    const node = await figma.getNodeByIdAsync(nodeId);
    if (node) {
      node.setPluginData(this.VISUAL_KEY, 'true');
    }
  }

  async findDashboardForNode(nodeId: string): Promise<string | null> {
    const node = await figma.getNodeByIdAsync(nodeId);
    if (!node) return null;

    let parent = node.parent;
    while (parent) {
      if (
        parent.type === 'FRAME' &&
        parent.getPluginData(this.PLUGIN_DATA_KEY) === 'true' &&
        parent.getPluginData(this.DASHBOARD_KEY) === 'true'
      ) {
        return parent.id;
      }
      parent = parent.parent;
    }
    return null;
  }

  async getVisualsInDashboard(dashboardId: string): Promise<string[]> {
    const frame = await figma.getNodeByIdAsync(dashboardId) as FrameNode | null;
    if (!frame || frame.type !== 'FRAME') return [];

    return frame.children
      .filter((child) => child.getPluginData(this.PLUGIN_DATA_KEY) === 'true')
      .map((child) => child.id);
  }
}
