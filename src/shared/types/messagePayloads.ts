import {
  ICreateNodePayload,
  IImportSVGPayload,
  IUpdateNodePayload,
  IDeleteNodePayload,
  ISelectNodePayload,
  INodesDataPayload,
  INodeCreatedPayload,
  INodeUpdatedPayload,
  INodeDeletedPayload,
  ISelectionChangedPayload,
  EUIMessageType,
  EPluginMessageType,
} from './messages';

// UI to Plugin message payloads
export interface IUIMessagePayloadMap {
  [EUIMessageType.CREATE_NODE]: ICreateNodePayload;
  [EUIMessageType.IMPORT_SVG]: IImportSVGPayload;
  [EUIMessageType.UPDATE_NODE]: IUpdateNodePayload;
  [EUIMessageType.DELETE_NODE]: IDeleteNodePayload;
  [EUIMessageType.GET_NODES]: void;
  [EUIMessageType.SELECT_NODE]: ISelectNodePayload;
  [EUIMessageType.EXPORT_SELECTION]: void;
  [EUIMessageType.UI_READY]: void;
}

// Plugin to UI message payloads
export interface IPluginMessagePayloadMap {
  [EPluginMessageType.NODE_CREATED]: INodeCreatedPayload;
  [EPluginMessageType.NODE_UPDATED]: INodeUpdatedPayload;
  [EPluginMessageType.NODE_DELETED]: INodeDeletedPayload;
  [EPluginMessageType.NODES_DATA]: INodesDataPayload;
  [EPluginMessageType.SELECTION_CHANGED]: ISelectionChangedPayload;
  [EPluginMessageType.EXPORT_COMPLETE]: void;
  [EPluginMessageType.ERROR]: string;
}
