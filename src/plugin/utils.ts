import { VisualConfig } from './types';

/**
 * Utility functions for plugin operations
 */
export class PluginUtils {
  /**
   * Get viewport center coordinates
   */
  static getViewportCenter(): { x: number; y: number } {
    return figma.viewport.center;
  }

  /**
   * Position node at viewport center
   */
  static positionAtCenter(node: SceneNode, size: { width: number; height: number }): void {
    const center = this.getViewportCenter();
    node.x = center.x - size.width / 2;
    node.y = center.y - size.height / 2;
  }

  /**
   * Select and focus on nodes
   */
  static selectAndFocus(nodes: SceneNode[]): void {
    figma.currentPage.selection = nodes;
    figma.viewport.scrollAndZoomIntoView(nodes);
  }

  /**
   * Generate unique name for visual
   */
  static generateVisualName(type: string, index?: number): string {
    const timestamp = new Date().toISOString().slice(11, 19).replace(/:/g, '');
    const suffix = index ? ` ${index}` : '';
    return `${type.toUpperCase()} Chart${suffix} - ${timestamp}`;
  }

  /**
   * Store metadata on node
   */
  static storeMetadata(node: SceneNode, visualType: string, config?: VisualConfig): void {
    node.setPluginData('visualType', visualType);
    node.setPluginData('createdAt', new Date().toISOString());
    node.setPluginData('version', '1.0.0');
    
    if (config) {
      node.setPluginData('config', JSON.stringify(config));
    }
  }

  /**
   * Get metadata from node
   */
  static getMetadata(node: SceneNode): Record<string, any> {
    return {
      visualType: node.getPluginData('visualType'),
      createdAt: node.getPluginData('createdAt'),
      version: node.getPluginData('version'),
      config: node.getPluginData('config') ? JSON.parse(node.getPluginData('config')) : null,
    };
  }

  /**
   * Log with timestamp and context
   */
  static log(level: 'info' | 'warn' | 'error', message: string, data?: any): void {
    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [${level.toUpperCase()}]`;
    
    if (data) {
      console[level](`${prefix} ${message}`, data);
    } else {
      console[level](`${prefix} ${message}`);
    }
  }
}
