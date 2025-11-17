import { ICreateNodePayload, INodeData, IUpdateNodePayload } from '../../shared/types/messages';
import { PLUGIN_CONFIG } from '../../shared/constants';
import { NodeFactory } from './NodeFactory';

type TLayoutNode = SceneNode & { x: number; y: number; width: number; height: number };

export class NodeManager {
  private readonly PLUGIN_DATA_KEY = PLUGIN_CONFIG.PLUGIN_ID;
  private static instance: NodeManager;
  private nodeMap = new Map<string, SceneNode>();

  private constructor() {}

  static getInstance(): NodeManager {
    if (!NodeManager.instance) {
      NodeManager.instance = new NodeManager();
    }
    return NodeManager.instance;
  }

  async createNode(config: ICreateNodePayload, parentId?: string): Promise<SceneNode> {
    const node = await NodeFactory.create(config);
    node.setPluginData(this.PLUGIN_DATA_KEY, 'true');
    node.setPluginData('createdAt', new Date().toISOString());

    const targetParentId = parentId || config.parentId;
    if (targetParentId) {
      const parent = await figma.getNodeByIdAsync(targetParentId);
      if (parent && 'appendChild' in parent) {
        (parent as FrameNode).appendChild(node);
      } else {
        figma.currentPage.appendChild(node);
      }
    } else {
      figma.currentPage.appendChild(node);
    }

    if (config.name) this.nodeMap.set(config.name, node);
    return node;
  }

  async updateNode(payload: IUpdateNodePayload): Promise<SceneNode> {
    const node = figma.getNodeById(payload.id) as SceneNode | null;
    if (!node) throw new Error('Node not found');

    const { properties } = payload;
    if (properties.name !== undefined) node.name = properties.name;
    if (properties.x !== undefined && 'x' in node) node.x = properties.x;
    if (properties.y !== undefined && 'y' in node) node.y = properties.y;
    if (properties.visible !== undefined) node.visible = properties.visible;
    if (properties.locked !== undefined) node.locked = properties.locked;

    return node;
  }

  async deleteNodes(nodeIds: string[]): Promise<void> {
    const nodes = await Promise.all(
      nodeIds.map((id) => figma.getNodeByIdAsync(id))
    );
    nodes.forEach((node) => {
      if (node) node.remove();
    });
  }

  async getNodes(): Promise<INodeData[]> {
    const nodes = figma.currentPage.findAll((node) => {
      if (!('x' in node && 'y' in node && 'width' in node && 'height' in node)) return false;
      return node.getPluginData(this.PLUGIN_DATA_KEY) === 'true';
    }) as TLayoutNode[];

    return nodes.map((node) => this.nodeToData(node));
  }

  async selectNode(id: string): Promise<void> {
    const node = (await figma.getNodeByIdAsync(id)) as SceneNode | null;
    if (!node) throw new Error('Node not found');

    figma.currentPage.selection = [node];
    figma.viewport.scrollAndZoomIntoView([node]);
  }

  private nodeToData(node: TLayoutNode): INodeData {
    return {
      id: node.id,
      name: node.name,
      type: node.type,
      x: node.x,
      y: node.y,
      width: node.width,
      height: node.height,
      visible: node.visible,
      locked: node.locked,
    };
  }
}
