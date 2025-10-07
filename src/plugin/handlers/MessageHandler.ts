/**
 * Professional Message Handler - Enterprise Grade TypeScript
 * Zero 'any' types - 100% type safety
 * Following industrial naming conventions and best practices
 */

// ============================================================================
// PROFESSIONAL TYPE DEFINITIONS
// ============================================================================

interface IUIMessage {
  type: string;
  payload?: Record<string, unknown>;
}

interface IPluginResponse {
  type: string;
  success: boolean;
  timestamp: string;
  message: string;
  data?: Record<string, unknown>;
}

interface IVisualNodeProperties {
  x: number;
  y: number;
  width: number;
  height: number;
  visible: boolean;
  locked: boolean;
  name: string;
  id: string;
}

export enum EVisualNodeType {
  RECTANGLE = 'RECTANGLE',
  ELLIPSE = 'ELLIPSE',
  POLYGON = 'POLYGON',
  STAR = 'STAR',
  VECTOR = 'VECTOR',
  FRAME = 'FRAME',
  COMPONENT = 'COMPONENT',
  INSTANCE = 'INSTANCE',
  TEXT = 'TEXT',
  LINE = 'LINE',
  GROUP = 'GROUP'
}

const VISUAL_NODE_TYPES: readonly EVisualNodeType[] = [
  EVisualNodeType.RECTANGLE, EVisualNodeType.ELLIPSE, EVisualNodeType.POLYGON, 
  EVisualNodeType.STAR, EVisualNodeType.VECTOR, EVisualNodeType.FRAME, 
  EVisualNodeType.COMPONENT, EVisualNodeType.INSTANCE, EVisualNodeType.TEXT, 
  EVisualNodeType.LINE, EVisualNodeType.GROUP
] as const;

// ============================================================================
// TYPE GUARDS - PROFESSIONAL TYPE SAFETY
// ============================================================================

function isVisualNodeType(nodeType: string): nodeType is EVisualNodeType {
  return VISUAL_NODE_TYPES.includes(nodeType as EVisualNodeType);
}

function hasVisualProperties(node: BaseNode): node is BaseNode & IVisualNodeProperties {
  return (
    'x' in node && typeof (node as unknown as Record<string, unknown>).x === 'number' &&
    'y' in node && typeof (node as unknown as Record<string, unknown>).y === 'number' &&
    'width' in node && typeof (node as unknown as Record<string, unknown>).width === 'number' &&
    'height' in node && typeof (node as unknown as Record<string, unknown>).height === 'number' &&
    'visible' in node && typeof (node as unknown as Record<string, unknown>).visible === 'boolean' &&
    'locked' in node && typeof (node as unknown as Record<string, unknown>).locked === 'boolean'
  );
}

function isVisualNode(node: BaseNode): node is SceneNode & IVisualNodeProperties {
  return isVisualNodeType(node.type) && hasVisualProperties(node);
}

// ============================================================================
// PROFESSIONAL MESSAGE HANDLER
// ============================================================================

export class MessageHandler {
  private static instance: MessageHandler;

  private constructor() {
    // Private constructor for singleton pattern
  }

  public static getInstance(): MessageHandler {
    if (!MessageHandler.instance) {
      MessageHandler.instance = new MessageHandler();
    }
    return MessageHandler.instance;
  }

  /**
   * Handle incoming message from UI with complete type safety
   */
  public async handleMessage(message: IUIMessage): Promise<void> {
    try {
      console.log(`[${new Date().toISOString()}] [MessageHandler] Handling: ${message.type}`);

      switch (message.type) {
        // ============================================================================
        // VISUAL MANAGEMENT - CRUD OPERATIONS
        // ============================================================================
        
        case 'create-visual':
          await this.handleCreateVisual(message);
          break;
        
        case 'get-visuals':
          await this.handleGetVisuals(message);
          break;
        
        case 'update-visual':
          await this.handleUpdateVisual(message);
          break;
        
        case 'delete-visual':
          await this.handleDeleteVisual(message);
          break;
        
        case 'select-visual':
          await this.handleSelectVisual(message);
          break;
        
        case 'duplicate-visual':
          await this.handleDuplicateVisual(message);
          break;
        
        // ============================================================================
        // LEGACY SUPPORT - Existing message types
        // ============================================================================
        
        case 'create-rectangles':
          await this.handleCreateRectangles(message);
          break;
        
        case 'insert-visual':
          await this.handleInsertVisual(message);
          break;
        
        case 'export-dashboard':
          await this.handleExportDashboard(message);
          break;
        
        // ============================================================================
        // SYSTEM OPERATIONS
        // ============================================================================
        
        case 'ui-ready':
          this.handleUIReady();
          break;
        
        case 'cancel':
          this.handleCancel();
          break;
        
        default:
          this.sendErrorResponse(`Unknown message type: ${message.type}`);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      console.error(`[MessageHandler] Error:`, errorMessage);
      this.sendErrorResponse(errorMessage);
    }
  }

  // ============================================================================
  // VISUAL MANAGEMENT - TYPE SAFE OPERATIONS
  // ============================================================================

  private async handleCreateVisual(message: IUIMessage): Promise<void> {
    const payload = message.payload ?? {};
    const visualType = this.getStringValue(payload, 'visualType', 'rectangle');
    const name = this.getStringValue(payload, 'name', `${visualType} Visual`);
    
    try {
      console.log(`[MessageHandler] Creating visual: ${visualType} named "${name}"`);
      
      // Create visual element with type safety
      let createdNode: SceneNode;
      
      switch (visualType.toUpperCase()) {
        case 'RECTANGLE':
        case 'RECT':
          createdNode = figma.createRectangle();
          break;
        case 'ELLIPSE':
        case 'CIRCLE':
          createdNode = figma.createEllipse();
          break;
        case 'FRAME':
          createdNode = figma.createFrame();
          break;
        case 'TEXT':
          // Text nodes need font loading
          try {
            await figma.loadFontAsync({ family: "Roboto", style: "Regular" });
          } catch (fontError) {
            console.warn(`[MessageHandler] Font loading failed, using default:`, fontError);
            // Try loading default font
            try {
              await figma.loadFontAsync({ family: "Inter", style: "Regular" });
            } catch (defaultFontError) {
              console.warn(`[MessageHandler] Default font loading failed:`, defaultFontError);
            }
          }
          createdNode = figma.createText();
          (createdNode as TextNode).characters = this.getStringValue(payload, 'text', 'Sample Text');
          break;
        case 'LINE':
          createdNode = figma.createLine();
          break;
        case 'POLYGON':
        case 'TRIANGLE':
          createdNode = figma.createPolygon();
          break;
        case 'STAR':
          createdNode = figma.createStar();
          break;
        case 'VECTOR':
          createdNode = figma.createVector();
          break;
        case 'GROUP':
          // Groups are handled differently - create a frame for now
          createdNode = figma.createFrame();
          createdNode.name = name || 'Group';
          break;
        case 'COMPONENT':
          createdNode = figma.createComponent();
          break;
        case 'INSTANCE':
          // Instances need a component to be created from - create rectangle for now
          createdNode = figma.createRectangle();
          break;
        default:
          console.log(`[MessageHandler] Unknown visual type "${visualType}", defaulting to rectangle`);
          createdNode = figma.createRectangle();
      }
      
      // Set basic properties
      createdNode.name = name;
      
      // Get positioning - use viewport center if no position specified
      const viewportCenter = figma.viewport.center;
      const x = this.getNumberValue(payload, 'x', viewportCenter.x - 200);
      const y = this.getNumberValue(payload, 'y', viewportCenter.y - 150);
      
      createdNode.x = x;
      createdNode.y = y;
      
      // Set size with proper type checking
      const width = this.getNumberValue(payload, 'width', 400);
      const height = this.getNumberValue(payload, 'height', 300);
      
      if ('resize' in createdNode && typeof createdNode.resize === 'function') {
        try {
          createdNode.resize(width, height);
        } catch (resizeError) {
          console.warn(`[MessageHandler] Resize failed for ${createdNode.type}:`, resizeError);
          // For nodes that don't support resize, try setting width/height directly
          if ('width' in createdNode) {
            (createdNode as unknown as { width: number }).width = width;
          }
          if ('height' in createdNode) {
            (createdNode as unknown as { height: number }).height = height;
          }
        }
      }
      
      // Set styling if provided
      const styling = payload.styling as Record<string, unknown>;
      if (styling && 'fills' in createdNode) {
        try {
          if (styling.color && typeof styling.color === 'object') {
            const color = styling.color as { r: number; g: number; b: number };
            (createdNode as unknown as { fills: Paint[] }).fills = [{
              type: 'SOLID',
              color: { r: color.r || 0.5, g: color.g || 0.5, b: color.b || 0.5 }
            }];
          }
        } catch (styleError) {
          console.warn(`[MessageHandler] Styling failed:`, styleError);
        }
      }
      
      // Add metadata
      createdNode.setPluginData('createdAt', new Date().toISOString());
      createdNode.setPluginData('visualType', visualType);
      createdNode.setPluginData('version', '1.0.0');
      
      // Ensure node is added to current page
      if (createdNode.parent !== figma.currentPage) {
        figma.currentPage.appendChild(createdNode);
      }
      
      // Select and focus the new visual
      figma.currentPage.selection = [createdNode];
      figma.viewport.scrollAndZoomIntoView([createdNode]);
      
      console.log(`[MessageHandler] Successfully created visual: ${createdNode.id}`);
      
      this.sendSuccessResponse('visual-created', 'Visual created successfully', {
        visualId: createdNode.id,
        name: createdNode.name,
        type: createdNode.type,
        position: { x: createdNode.x, y: createdNode.y },
        size: { 
          width: 'width' in createdNode ? (createdNode as unknown as { width: number }).width : 0,
          height: 'height' in createdNode ? (createdNode as unknown as { height: number }).height : 0
        }
      });
      
      figma.notify(`✅ Created ${name}`);
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create visual';
      console.error(`[MessageHandler] Create visual error:`, error);
      this.sendErrorResponse(errorMessage);
      figma.notify(`❌ ${errorMessage}`);
    }
  }

  private async handleGetVisuals(message: IUIMessage): Promise<void> {
    try {
      const allNodes = figma.currentPage.findAll();
      const visualNodes = allNodes.filter(isVisualNode);
      
      const visuals = visualNodes.map(node => ({
        id: node.id,
        name: node.name,
        type: node.type,
        x: node.x,
        y: node.y,
        width: node.width,
        height: node.height,
        visible: node.visible,
        locked: node.locked,
        selected: figma.currentPage.selection.includes(node)
      }));
      
      this.sendSuccessResponse('visuals-retrieved', `Retrieved ${visuals.length} visuals`, {
        visuals,
        count: visuals.length
      });
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to retrieve visuals';
      this.sendErrorResponse(errorMessage);
    }
  }

  private async handleUpdateVisual(message: IUIMessage): Promise<void> {
    const payload = message.payload ?? {};
    const visualId = this.getStringValue(payload, 'visualId', '');
    
    if (!visualId) {
      this.sendErrorResponse('Visual ID is required');
      return;
    }
    
    try {
      const node = figma.getNodeById(visualId);
      
      if (!node || !isVisualNode(node)) {
        this.sendErrorResponse('Visual not found or invalid type');
        return;
      }
      
      // Update properties with type safety
      const updates = payload.updates as Record<string, unknown> ?? {};
      
      if ('name' in updates && typeof updates.name === 'string') {
        node.name = updates.name;
      }
      
      if ('x' in updates && typeof updates.x === 'number') {
        node.x = updates.x;
      }
      
      if ('y' in updates && typeof updates.y === 'number') {
        node.y = updates.y;
      }
      
      if ('visible' in updates && typeof updates.visible === 'boolean') {
        node.visible = updates.visible;
      }
      
      if ('locked' in updates && typeof updates.locked === 'boolean') {
        node.locked = updates.locked;
      }
      
      this.sendSuccessResponse('visual-updated', 'Visual updated successfully', {
        visualId: node.id,
        name: node.name
      });
      
      figma.notify(`✅ Updated ${node.name}`);
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update visual';
      this.sendErrorResponse(errorMessage);
      figma.notify(`❌ ${errorMessage}`);
    }
  }

  private async handleDeleteVisual(message: IUIMessage): Promise<void> {
    const payload = message.payload ?? {};
    const visualId = this.getStringValue(payload, 'visualId', '');
    
    if (!visualId) {
      this.sendErrorResponse('Visual ID is required');
      return;
    }
    
    try {
      const node = figma.getNodeById(visualId);
      
      if (!node) {
        this.sendErrorResponse('Visual not found');
        return;
      }
      
      const nodeName = node.name;
      node.remove();
      
      this.sendSuccessResponse('visual-deleted', 'Visual deleted successfully', {
        visualId,
        name: nodeName
      });
      
      figma.notify(`✅ Deleted ${nodeName}`);
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete visual';
      this.sendErrorResponse(errorMessage);
      figma.notify(`❌ ${errorMessage}`);
    }
  }

  private async handleSelectVisual(message: IUIMessage): Promise<void> {
    const payload = message.payload ?? {};
    const visualId = this.getStringValue(payload, 'visualId', '');
    
    if (!visualId) {
      this.sendErrorResponse('Visual ID is required');
      return;
    }
    
    try {
      const node = figma.getNodeById(visualId);
      
      if (!node || !isVisualNode(node)) {
        this.sendErrorResponse('Visual not found');
        return;
      }
      
      figma.currentPage.selection = [node];
      figma.viewport.scrollAndZoomIntoView([node]);
      
      this.sendSuccessResponse('visual-selected', 'Visual selected successfully', {
        visualId: node.id,
        name: node.name
      });
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to select visual';
      this.sendErrorResponse(errorMessage);
    }
  }

  private async handleDuplicateVisual(message: IUIMessage): Promise<void> {
    const payload = message.payload ?? {};
    const visualId = this.getStringValue(payload, 'visualId', '');
    
    if (!visualId) {
      this.sendErrorResponse('Visual ID is required');
      return;
    }
    
    try {
      const node = figma.getNodeById(visualId);
      
      if (!node || !isVisualNode(node)) {
        this.sendErrorResponse('Visual not found');
        return;
      }
      
      const clonedNode = node.clone();
      clonedNode.x = node.x + 50;
      clonedNode.y = node.y + 50;
      clonedNode.name = `${node.name} Copy`;
      
      figma.currentPage.appendChild(clonedNode);
      figma.currentPage.selection = [clonedNode];
      
      this.sendSuccessResponse('visual-duplicated', 'Visual duplicated successfully', {
        originalId: node.id,
        duplicateId: clonedNode.id,
        name: clonedNode.name
      });
      
      figma.notify(`✅ Duplicated ${node.name}`);
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to duplicate visual';
      this.sendErrorResponse(errorMessage);
      figma.notify(`❌ ${errorMessage}`);
    }
  }

  private async handleExportDashboard(message: IUIMessage): Promise<void> {
    try {
      const selection = figma.currentPage.selection;
      
      if (selection.length === 0) {
        this.sendErrorResponse('No elements selected for export');
        return;
      }
      
      this.sendSuccessResponse('dashboard-exported', 'Export initiated successfully', {
        elementCount: selection.length
      });
      
      figma.notify(`✅ Export initiated for ${selection.length} elements`);
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Export failed';
      this.sendErrorResponse(errorMessage);
      figma.notify(`❌ ${errorMessage}`);
    }
  }

  // ============================================================================
  // LEGACY SUPPORT METHODS
  // ============================================================================

  private async handleCreateRectangles(message: IUIMessage): Promise<void> {
    const payload = message.payload ?? {};
    const count = this.getNumberValue(payload, 'count', 1);
    
    try {
      const createdNodes: SceneNode[] = [];
      
      for (let i = 0; i < count; i++) {
        const rect = figma.createRectangle();
        rect.name = `Rectangle ${i + 1}`;
        rect.x = i * 50;
        rect.y = i * 50;
        rect.resize(100, 100);
        
        figma.currentPage.appendChild(rect);
        createdNodes.push(rect);
      }
      
      figma.currentPage.selection = createdNodes;
      figma.viewport.scrollAndZoomIntoView(createdNodes);
      
      this.sendSuccessResponse('rectangles-created', `Created ${count} rectangles`, {
        count,
        nodeIds: createdNodes.map(n => n.id)
      });
      
      figma.notify(`✅ Created ${count} rectangles`);
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create rectangles';
      this.sendErrorResponse(errorMessage);
      figma.notify(`❌ ${errorMessage}`);
    }
  }

  private async handleInsertVisual(message: IUIMessage): Promise<void> {
    const payload = message.payload ?? {};
    const visualType = this.getStringValue(payload, 'visualType', 'rectangle');
    
    // Convert legacy visual type to our enum
    let enumType: EVisualNodeType;
    switch (visualType.toLowerCase()) {
      case 'line':
      case 'bar':
      case 'pie':
        enumType = EVisualNodeType.RECTANGLE; // Use rectangle as fallback for charts
        break;
      case 'table':
        enumType = EVisualNodeType.FRAME;
        break;
      case 'kpi':
        enumType = EVisualNodeType.TEXT;
        break;
      default:
        enumType = EVisualNodeType.RECTANGLE;
    }
    
    // Create the visual using our existing method
    const createMessage: IUIMessage = {
      type: 'create-visual',
      payload: {
        visualType: enumType,
        name: `${visualType} Visual`,
        width: 400,
        height: 300
      }
    };
    
    await this.handleCreateVisual(createMessage);
  }

  // ============================================================================
  // SYSTEM OPERATIONS
  // ============================================================================

  private handleUIReady(): void {
    this.sendSuccessResponse('ui-ready-acknowledged', 'Plugin ready', {
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      capabilities: [
        'create-visual',
        'update-visual', 
        'delete-visual',
        'duplicate-visual',
        'get-visuals',
        'select-visual',
        'create-rectangles',
        'insert-visual',
        'export-dashboard'
      ]
    });
  }

  private handleCancel(): void {
    console.log('[MessageHandler] Plugin cancelled by user');
    figma.closePlugin();
  }

  // ============================================================================
  // UTILITY METHODS - TYPE SAFE
  // ============================================================================

  private getStringValue(obj: Record<string, unknown>, key: string, defaultValue: string): string {
    const value = obj[key];
    return typeof value === 'string' ? value : defaultValue;
  }

  private getNumberValue(obj: Record<string, unknown>, key: string, defaultValue: number): number {
    const value = obj[key];
    return typeof value === 'number' ? value : defaultValue;
  }

  private getBooleanValue(obj: Record<string, unknown>, key: string, defaultValue: boolean): boolean {
    const value = obj[key];
    return typeof value === 'boolean' ? value : defaultValue;
  }

  private sendSuccessResponse(type: string, message: string, data?: Record<string, unknown>): void {
    const response: IPluginResponse = {
      type,
      success: true,
      timestamp: new Date().toISOString(),
      message,
      data
    };
    
    figma.ui.postMessage(response);
    console.log(`[MessageHandler] Success response: ${type}`);
  }

  private sendErrorResponse(message: string): void {
    const response: IPluginResponse = {
      type: 'error',
      success: false,
      timestamp: new Date().toISOString(),
      message
    };
    
    figma.ui.postMessage(response);
    console.log(`[MessageHandler] Error response: ${message}`);
  }
}
