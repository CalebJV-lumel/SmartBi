import { useEffect } from 'react';
import { MessageBridge } from '../utils/MessageBridge';
import { useNodeStore } from '../store/useNodeStore';
import { useDashboardStore } from '../store/useDashboardStore';
import { LayoutCalculator } from '../core/LayoutCalculator';
import {
  ICreateNodePayload,
  IImportSVGPayload,
  IUpdateNodePayload,
  IDeleteNodePayload,
  ISelectNodePayload,
  INodesDataPayload,
  INodeDeletedPayload,
  ISelectionChangedPayload,
  ICreateVisualPayload,
  EPluginMessageType,
  EUIMessageType,
} from '../../shared/types/messages';
import { IDimensions } from '@shared/types/layout';

export function usePlugin() {
  const bridge = MessageBridge.getInstance();
  const { setNodes, removeNode, selectNode, setLoading } = useNodeStore();
  const { dashboards, selectedDashboardId, getVisualsForDashboard } = useDashboardStore();
  const layoutCalculator = LayoutCalculator.getInstance();

  useEffect(() => {
    const unsubscribers = [
      bridge.on<INodesDataPayload>(EPluginMessageType.NODES_DATA, (data) => {
        setNodes(data.nodes);
        setLoading(false);
      }),

      bridge.on(EPluginMessageType.NODE_CREATED, () => {
        bridge.emit(EUIMessageType.GET_NODES);
      }),

      bridge.on(EPluginMessageType.NODE_UPDATED, () => {
        bridge.emit(EUIMessageType.GET_NODES);
      }),

      bridge.on<INodeDeletedPayload>(EPluginMessageType.NODE_DELETED, (data) => {
        data.ids.forEach((id) => removeNode(id));
      }),

      bridge.on<ISelectionChangedPayload>(EPluginMessageType.SELECTION_CHANGED, (data) => {
        selectNode(data.id);
      }),

      bridge.on<string>(EPluginMessageType.ERROR, (error) => {
        console.error('Plugin error:', error);
        setLoading(false);
      }),
    ];

    bridge.emit(EUIMessageType.UI_READY);

    return () => {
      unsubscribers.forEach((unsub) => unsub());
    };
  }, [bridge, setNodes, removeNode, selectNode, setLoading]);

  return {
    createNode: (payload: ICreateNodePayload) => {
      bridge.emit(EUIMessageType.CREATE_NODE, payload);
    },

    createVisual: (config: ICreateNodePayload) => {
      if (!selectedDashboardId) {
        bridge.emit(EUIMessageType.CREATE_NODE, config);
        return;
      }

      const dashboard = dashboards.find((d) => d.id === selectedDashboardId);
      if (!dashboard) {
        bridge.emit(EUIMessageType.CREATE_NODE, config);
        return;
      }

      const visuals = getVisualsForDashboard(selectedDashboardId);
      const layout = layoutCalculator.calculateVisualLayout(dashboard, visuals);

      const visualPayload: ICreateVisualPayload = {
        config,
        dashboardId: selectedDashboardId,
        x: layout.position.x,
        y: layout.position.y,
        width: layout.dimensions.width,
        height: layout.dimensions.height,
        shouldZoom: layout.shouldZoom,
      };

      bridge.emit(EUIMessageType.CREATE_NODE, visualPayload);
    },

    createNodes: (payloads: ICreateNodePayload[]) => {
      payloads.forEach((payload) => {
        bridge.emit(EUIMessageType.CREATE_NODE, payload);
      });
    },

    importSVG: (svg: string, name: string, dimension: IDimensions) => {
      if (!selectedDashboardId) {
        const payload: IImportSVGPayload = { svg, name };
        bridge.emit(EUIMessageType.IMPORT_SVG, payload);
        return;
      }

      const dashboard = dashboards.find((d) => d.id === selectedDashboardId);
      if (!dashboard) {
        const payload: IImportSVGPayload = { svg, name };
        bridge.emit(EUIMessageType.IMPORT_SVG, payload);
        return;
      }

      const visuals = getVisualsForDashboard(selectedDashboardId);
      const layout = layoutCalculator.calculateVisualLayout(dashboard, visuals);

      const payload = {
        svg,
        name,
        dashboardId: selectedDashboardId,
        x: layout.position.x,
        y: layout.position.y,
        width: dimension.width ?? layout.dimensions.width,
        height: dimension.height ?? layout.dimensions.height,
        shouldZoom: layout.shouldZoom,
      };

      bridge.emit(EUIMessageType.IMPORT_SVG, payload);
    },

    getOptimizedNewVisualDimension: () => {
      if (!selectedDashboardId) return { width: 0, height: 0 };

      const dashboard = dashboards.find((d) => d.id === selectedDashboardId);
      if (!dashboard) return { width: 0, height: 0 };

      const visuals = getVisualsForDashboard(selectedDashboardId);
      const layout = layoutCalculator.calculateVisualLayout(dashboard, visuals);

      return layout.dimensions;
    },

    updateNode: (id: string, properties: IUpdateNodePayload['properties']) => {
      const payload: IUpdateNodePayload = { id, properties };
      bridge.emit(EUIMessageType.UPDATE_NODE, payload);
    },

    deleteNode: (ids: string[]) => {
      const payload: IDeleteNodePayload = { ids };
      bridge.emit(EUIMessageType.DELETE_NODE, payload);
    },

    selectNode: (id: string) => {
      const payload: ISelectNodePayload = { id };
      bridge.emit(EUIMessageType.SELECT_NODE, payload);
    },

    refreshNodes: () => {
      setLoading(true);
      bridge.emit(EUIMessageType.GET_NODES);
    },
  };
}
