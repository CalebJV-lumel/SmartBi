import { create } from 'zustand';
import { INodeData } from '../../shared/types/messages';

interface INodeStore {
  nodes: INodeData[];
  selectedNodeId: string | null;
  isLoading: boolean;
  searchQuery: string;
  
  setNodes: (nodes: INodeData[]) => void;
  addNode: (node: INodeData) => void;
  updateNode: (id: string, updates: Partial<INodeData>) => void;
  removeNode: (id: string) => void;
  selectNode: (id: string | null) => void;
  setLoading: (loading: boolean) => void;
  setSearchQuery: (query: string) => void;
  getFilteredNodes: () => INodeData[];
}

export const useNodeStore = create<INodeStore>((set, get) => ({
  nodes: [],
  selectedNodeId: null,
  isLoading: false,
  searchQuery: '',

  setNodes: (nodes) => set({ nodes }),
  
  addNode: (node) => set((state) => ({ 
    nodes: [...state.nodes, node] 
  })),
  
  updateNode: (id, updates) => set((state) => ({
    nodes: state.nodes.map(n => n.id === id ? { ...n, ...updates } : n)
  })),
  
  removeNode: (id) => set((state) => ({
    nodes: state.nodes.filter(n => n.id !== id),
    selectedNodeId: state.selectedNodeId === id ? null : state.selectedNodeId
  })),
  
  selectNode: (id) => set({ selectedNodeId: id }),
  
  setLoading: (loading) => set({ isLoading: loading }),
  
  setSearchQuery: (query) => set({ searchQuery: query }),
  
  getFilteredNodes: () => {
    const { nodes, searchQuery } = get();
    if (!searchQuery) return nodes;
    return nodes.filter(node => 
      node.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      node.type.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }
}));
