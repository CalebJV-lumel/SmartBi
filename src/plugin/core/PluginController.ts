import { MessageChannel } from './MessageChannel';
import { NodeManager } from './NodeManager';
import { DashboardManager } from './DashboardManager';
import { LayoutManager } from './LayoutManager';
import {
  INodeCreatedPayload,
  INodeUpdatedPayload,
  INodeDeletedPayload,
  INodesDataPayload,
  ISelectionChangedPayload,
  ICreateVisualPayload,
  EPluginMessageType,
  EUIMessageType,
  IImportSVGPayload,
  ICreateNodePayload,
} from '../../shared/types/messages';
import { PLUGIN_CONFIG } from '../../shared/constants';

export class PluginController {
  private static instance: PluginController;
  private messageChannel: MessageChannel;
  private nodeManager: NodeManager;
  private dashboardManager: DashboardManager;
  private layoutManager: LayoutManager;

  private constructor() {
    this.messageChannel = MessageChannel.getInstance();
    this.nodeManager = NodeManager.getInstance();
    this.dashboardManager = DashboardManager.getInstance();
    this.layoutManager = LayoutManager.getInstance();
  }

  static getInstance(): PluginController {
    if (!PluginController.instance) {
      PluginController.instance = new PluginController();
    }
    return PluginController.instance;
  }

  async initialize(): Promise<void> {
    this.setupUI();
    this.registerHandlers();
    this.setupSelectionListener();
    this.setupDeleteListener();
    this.messageChannel.initialize();
  }

  private setupUI(): void {
    figma.showUI(__html__, {
      width: 400,
      height: 600,
      themeColors: true,
      title: 'SmartBi',
    });
  }

  private registerHandlers(): void {
    this.messageChannel.on(
      EUIMessageType.CREATE_NODE,
      async (payload: ICreateNodePayload | ICreateVisualPayload) => {
        let node: SceneNode;

        if ('dashboardId' in payload) {
          const dashboard = (await figma.getNodeByIdAsync(payload.dashboardId)) as FrameNode | null;
          if (!dashboard) return;

          node = await this.nodeManager.createNode(payload.config, payload.dashboardId);
          await this.dashboardManager.markAsVisual(node.id);
          this.layoutManager.applyLayout(node, payload.x, payload.y, payload.width, payload.height);
          await this.layoutManager.smartZoom(payload.dashboardId, payload.shouldZoom);
        } else {
          node = await this.nodeManager.createNode(payload);

          if (node.type === 'FRAME') {
            await this.dashboardManager.markAsDashboard(node.id);
            figma.currentPage.selection = [node];
            figma.viewport.scrollAndZoomIntoView([node]);
          }
        }

        const response: INodeCreatedPayload = {
          id: node.id,
          name: node.name,
          type: node.type,
        };
        this.messageChannel.sendSuccess(EPluginMessageType.NODE_CREATED, response);

        const nodes = await this.nodeManager.getNodes();
        const dashboards = await this.dashboardManager.getDashboards();
        const visuals = await this.dashboardManager.getVisuals();
        this.messageChannel.sendSuccess(EPluginMessageType.NODES_DATA, {
          nodes,
          dashboards,
          visuals,
        });

        figma.notify(`✅ Created ${node.name}`);
      }
    );

    this.messageChannel.on(
      EUIMessageType.IMPORT_SVG,
      async (payload: IImportSVGPayload | (IImportSVGPayload & ICreateVisualPayload)) => {
        try {
          const node = figma.createNodeFromSvg(payload.svg);
          node.name = payload.name;

          node.setPluginData(PLUGIN_CONFIG.PLUGIN_ID, 'true');
          node.setPluginData('createdAt', new Date().toISOString());
          node.setPluginData('source', 'highcharts');

          if ('dashboardId' in payload) {
            const dashboard = (await figma.getNodeByIdAsync(
              payload.dashboardId
            )) as FrameNode | null;
            if (dashboard) {
              dashboard.appendChild(node);
              await this.dashboardManager.markAsVisual(node.id);
              this.layoutManager.applyLayout(
                node,
                payload.x,
                payload.y,
                payload.width,
                payload.height
              );
              await this.layoutManager.smartZoom(payload.dashboardId, payload.shouldZoom);
            }
          } else {
            figma.currentPage.appendChild(node);
            if (payload.x !== undefined) node.x = payload.x;
            if (payload.y !== undefined) node.y = payload.y;
            figma.viewport.scrollAndZoomIntoView([node]);
          }

          const response: INodeCreatedPayload = {
            id: node.id,
            name: node.name,
            type: node.type,
          };
          this.messageChannel.sendSuccess(EPluginMessageType.NODE_CREATED, response);

          const nodes = await this.nodeManager.getNodes();
          const dashboards = await this.dashboardManager.getDashboards();
          const visuals = await this.dashboardManager.getVisuals();
          this.messageChannel.sendSuccess(EPluginMessageType.NODES_DATA, {
            nodes,
            dashboards,
            visuals,
          });

          figma.notify(`✅ Imported ${payload.name}`);
        } catch (error) {
          const errorMsg = error instanceof Error ? error.message : 'Unknown error';
          console.error('SVG import error:', errorMsg);
          figma.notify(`❌ Failed to import SVG: ${errorMsg}`);
          throw error;
        }
      }
    );

    this.messageChannel.on(EUIMessageType.UPDATE_NODE, async (payload) => {
      const node = await this.nodeManager.updateNode(payload);
      const response: INodeUpdatedPayload = { id: node.id };
      this.messageChannel.sendSuccess(EPluginMessageType.NODE_UPDATED, response);
      figma.notify(`✅ Updated ${node.name}`);
    });

    this.messageChannel.on(EUIMessageType.DELETE_NODE, async (payload) => {
      await this.nodeManager.deleteNodes(payload.ids);
      const response: INodeDeletedPayload = { ids: payload.ids };
      this.messageChannel.sendSuccess(EPluginMessageType.NODE_DELETED, response);

      const nodes = await this.nodeManager.getNodes();
      const dashboards = await this.dashboardManager.getDashboards();
      const visuals = await this.dashboardManager.getVisuals();
      this.messageChannel.sendSuccess(EPluginMessageType.NODES_DATA, {
        nodes,
        dashboards,
        visuals,
      });

      figma.notify(`✅ Deleted ${payload.ids.length} node(s)`);
    });

    this.messageChannel.on(EUIMessageType.GET_NODES, async () => {
      const nodes = await this.nodeManager.getNodes();
      const dashboards = await this.dashboardManager.getDashboards();
      const visuals = await this.dashboardManager.getVisuals();
      const response: INodesDataPayload = { nodes, dashboards, visuals };
      this.messageChannel.sendSuccess(EPluginMessageType.NODES_DATA, response);
    });

    this.messageChannel.on(EUIMessageType.SELECT_NODE, async (payload) => {
      await this.nodeManager.selectNode(payload.id);
      const response: ISelectionChangedPayload = { id: payload.id };
      this.messageChannel.sendSuccess(EPluginMessageType.SELECTION_CHANGED, response);
    });

    this.messageChannel.on(EUIMessageType.UI_READY, async () => {
      const nodes = await this.nodeManager.getNodes();
      const dashboards = await this.dashboardManager.getDashboards();
      const visuals = await this.dashboardManager.getVisuals();
      const response: INodesDataPayload = { nodes, dashboards, visuals };
      this.messageChannel.sendSuccess(EPluginMessageType.NODES_DATA, response);
    });
  }

  private setupSelectionListener(): void {
    figma.on('selectionchange', async () => {
      const selection = figma.currentPage.selection;
      if (selection.length === 1) {
        const node = selection[0];
        let dashboardId: string | undefined;

        if (
          node.type === 'FRAME' &&
          node.getPluginData(PLUGIN_CONFIG.PLUGIN_ID) === 'true' &&
          node.getPluginData('dashboard') === 'true'
        ) {
          dashboardId = node.id;
        } else {
          const parentDashboard = await this.dashboardManager.findDashboardForNode(node.id);
          dashboardId = parentDashboard ? parentDashboard : undefined;
        }

        const response: ISelectionChangedPayload = {
          id: node.id,
          dashboardId: dashboardId,
        };
        this.messageChannel.sendSuccess(EPluginMessageType.SELECTION_CHANGED, response);
      } else {
        const response: ISelectionChangedPayload = {
          id: '',
        };
        this.messageChannel.sendSuccess(EPluginMessageType.SELECTION_CHANGED, response);
      }
    });
  }

  private setupDeleteListener(): void {
    figma.on('documentchange', (event) => {
      for (const change of event.documentChanges) {
        if (change.type === 'DELETE') {
          const response: INodeDeletedPayload = { ids: [change.id] };
          this.messageChannel.sendSuccess(EPluginMessageType.NODE_DELETED, response);
        }
      }
    });
  }
}
