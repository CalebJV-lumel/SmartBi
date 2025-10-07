import { PluginUtils } from '../utils';

/**
 * Service for handling export operations
 */
export class ExportService {
  private static instance: ExportService;

  private constructor() {}

  /**
   * Get singleton instance
   */
  static getInstance(): ExportService {
    if (!ExportService.instance) {
      ExportService.instance = new ExportService();
    }
    return ExportService.instance;
  }

  /**
   * Export dashboard in specified format
   */
  async exportDashboard(format: string): Promise<{ success: boolean; message: string; data?: Uint8Array | string | Record<string, unknown> }> {
    try {
      PluginUtils.log('info', `Exporting dashboard as ${format}`);

      const selection = figma.currentPage.selection;
      
      if (selection.length === 0) {
        return {
          success: false,
          message: 'No elements selected for export'
        };
      }

      switch (format.toLowerCase()) {
        case 'png':
          return await this.exportAsPNG(selection);
        case 'pdf':
          return await this.exportAsPDF(selection);
        case 'svg':
          return await this.exportAsSVG(selection);
        case 'json':
          return await this.exportAsJSON(selection);
        default:
          return {
            success: false,
            message: `Unsupported export format: ${format}`
          };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Export failed';
      PluginUtils.log('error', 'Export operation failed', { error: errorMessage });
      
      return {
        success: false,
        message: errorMessage
      };
    }
  }

  /**
   * Export as PNG
   */
  private async exportAsPNG(nodes: readonly SceneNode[]): Promise<{ success: boolean; message: string; data?: Uint8Array }> {
    try {
      const exportSettings: ExportSettings = {
        format: 'PNG',
        constraint: { type: 'SCALE', value: 2 }
      };

      const results = await Promise.all(
        nodes.map(async (node) => {
          const bytes = await node.exportAsync(exportSettings);
          return {
            name: node.name,
            bytes: bytes,
            format: 'PNG'
          };
        })
      );

      return {
        success: true,
        message: `Exported ${results.length} elements as PNG`,
        data: results[0]?.bytes || new Uint8Array()
      };
    } catch (error) {
      return {
        success: false,
        message: 'PNG export failed'
      };
    }
  }

  /**
   * Export as PDF (placeholder - requires additional implementation)
   */
  private async exportAsPDF(nodes: readonly SceneNode[]): Promise<{ success: boolean; message: string }> {
    // PDF export would require additional libraries or services
    return {
      success: false,
      message: 'PDF export not yet implemented'
    };
  }

  /**
   * Export as SVG
   */
  private async exportAsSVG(nodes: readonly SceneNode[]): Promise<{ success: boolean; message: string; data?: string }> {
    try {
      const exportSettings: ExportSettings = {
        format: 'SVG'
      };

      const results = await Promise.all(
        nodes.map(async (node) => {
          const svg = await node.exportAsync(exportSettings);
          return {
            name: node.name,
            svg: svg,
            format: 'SVG'
          };
        })
      );

      return {
        success: true,
        message: `Exported ${results.length} elements as SVG`,
        data: new TextDecoder().decode(results[0]?.svg) || ''
      };
    } catch (error) {
      return {
        success: false,
        message: 'SVG export failed'
      };
    }
  }

  /**
   * Export as JSON (metadata and configuration)
   */
  private async exportAsJSON(nodes: readonly SceneNode[]): Promise<{ success: boolean; message: string; data?: Record<string, unknown> }> {
    try {
      const results = nodes.map((node) => {
        const metadata = PluginUtils.getMetadata(node);
        return {
          id: node.id,
          name: node.name,
          type: node.type,
          x: node.x,
          y: node.y,
          width: node.width,
          height: node.height,
          metadata: metadata,
          pluginData: {
            visualType: metadata.visualType,
            createdAt: metadata.createdAt,
            version: metadata.version,
            config: metadata.config
          }
        };
      });

      return {
        success: true,
        message: `Exported ${results.length} elements as JSON`,
        data: {
          exportedAt: new Date().toISOString(),
          elements: results,
          version: '1.0.0'
        }
      };
    } catch (error) {
      return {
        success: false,
        message: 'JSON export failed'
      };
    }
  }
}
