import type {
  FrameNode,
  RectangleNode,
  TextNode,
  LineNode,
  EllipseNode,
  Paint,
  FontName,
  StrokeCap
} from '@figma/plugin-typings/plugin-api-standalone';
import { ENodeType } from './messages';

type ExcludedKeys = 'id' | 'parent' | 'children' | 'removed' | 'type' | 'clone' | 'remove' | 'setPluginData' | 'getPluginData' | 'setSharedPluginData' | 'getSharedPluginData' | 'setRelaunchData' | 'getRelaunchData';

type NodeConfig<T> = {
  [K in keyof T as K extends ExcludedKeys ? never : K]?: T[K] extends typeof figma.mixed ? never : T[K];
} & { parentId?: string };

export type IFrameNodeConfig = NodeConfig<FrameNode> & { type: ENodeType.FRAME };
export type IRectangleNodeConfig = NodeConfig<RectangleNode> & { type: ENodeType.RECTANGLE };
export type ITextNodeConfig = NodeConfig<TextNode> & { type: ENodeType.TEXT };
export type ILineNodeConfig = NodeConfig<LineNode> & { type: ENodeType.LINE };
export type IEllipseNodeConfig = NodeConfig<EllipseNode> & { type: ENodeType.ELLIPSE };

export type TNodeConfig =
  | IFrameNodeConfig
  | IRectangleNodeConfig
  | ITextNodeConfig
  | ILineNodeConfig
  | IEllipseNodeConfig;

export type { Paint, FontName, StrokeCap };
