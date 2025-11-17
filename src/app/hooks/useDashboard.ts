import { useEffect } from 'react';
import { MessageBridge } from '../utils/MessageBridge';
import { useDashboardStore } from '../store/useDashboardStore';
import { 
  INodesDataPayload,
  INodeDeletedPayload,
  ISelectionChangedPayload,
  EPluginMessageType
} from '../../shared/types/messages';

export function useDashboard() {
  const bridge = MessageBridge.getInstance();
  const { setDashboards, setVisuals, selectDashboard, removeDashboard, removeVisual } = useDashboardStore();

  useEffect(() => {
    const unsubscribers = [
      bridge.on<INodesDataPayload>(EPluginMessageType.NODES_DATA, (data) => {
        if (data.dashboards) setDashboards(data.dashboards);
        if (data.visuals) setVisuals(data.visuals);
      }),

      bridge.on<INodeDeletedPayload>(EPluginMessageType.NODE_DELETED, (data) => {
        data.ids.forEach(id => {
          removeDashboard(id);
          removeVisual(id);
        });
      }),

      bridge.on<ISelectionChangedPayload>(EPluginMessageType.SELECTION_CHANGED, (data) => {
        if (data.dashboardId) {
          selectDashboard(data.dashboardId);
        } else {
          selectDashboard(null);
        }
      })
    ];

    return () => {
      unsubscribers.forEach(unsub => unsub());
    };
  }, [bridge, setDashboards, setVisuals, selectDashboard, removeDashboard, removeVisual]);
}
