/// <reference types="@figma/plugin-typings" />

import { EExportFormat } from '../../shared/types/messages';

export class ExportService {
  private static instance: ExportService;

  private constructor() {}

  static getInstance(): ExportService {
    if (!ExportService.instance) {
      ExportService.instance = new ExportService();
    }
    return ExportService.instance;
  }

  async exportNode(nodeId: string, format: EExportFormat): Promise<Uint8Array> {
    const node = figma.getNodeById(nodeId) as SceneNode | null;
    if (!node) throw new Error('Node not found');

    const settings: ExportSettings = {
      format: format as ExportSettingsImage['format'],
      constraint: { type: 'SCALE', value: 2 }
    };

    return await node.exportAsync(settings);
  }

  async exportSelection(format: EExportFormat): Promise<Uint8Array[]> {
    const selection = figma.currentPage.selection;
    if (selection.length === 0) throw new Error('No selection');

    const exports = await Promise.all(
      selection.map(node => this.exportNode(node.id, format))
    );

    return exports;
  }
}
