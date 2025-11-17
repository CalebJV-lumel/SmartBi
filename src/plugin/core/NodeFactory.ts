import { TNodeConfig, IFrameNodeConfig, IRectangleNodeConfig, ITextNodeConfig, ILineNodeConfig, IEllipseNodeConfig } from '../../shared/types/nodes';
import { ENodeType } from '../../shared/types/messages';

export class NodeFactory {
  static async create(config: TNodeConfig): Promise<SceneNode> {
    switch (config.type) {
      case ENodeType.FRAME:
        return this.createFrame(config);
      case ENodeType.RECTANGLE:
        return this.createRectangle(config);
      case ENodeType.TEXT:
        return this.createText(config);
      case ENodeType.LINE:
        return this.createLine(config);
      case ENodeType.ELLIPSE:
        return this.createEllipse(config);
      default:
        throw new Error(`Unsupported node type: ${(config as any).type}`);
    }
  }

  private static createFrame(config: IFrameNodeConfig) {
    const frame = figma.createFrame();
    Object.entries(config).forEach(([key, value]) => {
      if (key === 'type' || key === 'parentId' || value === undefined) return;
      if (key === 'width' || key === 'height') return;
      (frame as any)[key] = value;
    });
    if (config.width && config.height) frame.resize(config.width, config.height);
    return frame;
  }

  private static createRectangle(config: IRectangleNodeConfig) {
    const rect = figma.createRectangle();
    Object.entries(config).forEach(([key, value]) => {
      if (key === 'type' || key === 'parentId' || value === undefined) return;
      if (key === 'width' || key === 'height') return;
      (rect as any)[key] = value;
    });
    if (config.width && config.height) rect.resize(config.width, config.height);
    return rect;
  }

  private static async createText(config: ITextNodeConfig) {
    const fontName = config.fontName || { family: 'Inter', style: 'Regular' };
    await figma.loadFontAsync(fontName as FontName);
    const text = figma.createText();
    Object.entries(config).forEach(([key, value]) => {
      if (key === 'type' || key === 'parentId' || value === undefined) return;
      if (key === 'width' || key === 'height' || key === 'fontName') return;
      (text as any)[key] = value;
    });
    text.fontName = fontName as FontName;
    if (config.width && config.textAutoResize === 'NONE') text.resize(config.width, text.height);
    return text;
  }

  private static createLine(config: ILineNodeConfig) {
    const line = figma.createLine();
    Object.entries(config).forEach(([key, value]) => {
      if (key === 'type' || key === 'parentId' || value === undefined) return;
      (line as any)[key] = value;
    });
    return line;
  }

  private static createEllipse(config: IEllipseNodeConfig) {
    const ellipse = figma.createEllipse();
    Object.entries(config).forEach(([key, value]) => {
      if (key === 'type' || key === 'parentId' || value === undefined) return;
      if (key === 'width' || key === 'height') return;
      (ellipse as any)[key] = value;
    });
    if (config.width && config.height) ellipse.resize(config.width, config.height);
    return ellipse;
  }
}
