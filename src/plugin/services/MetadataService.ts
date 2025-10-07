import { IMetadataService, IElementMetadata, IServiceResult } from '../types/interfaces';
import { EErrorCode, ELogLevel } from '../types/enums';
import { BaseService } from './base/BaseService';

/**
 * Metadata Service - Professional metadata management for Figma elements
 * Handles storage, retrieval, and querying of element metadata
 */
export class MetadataService extends BaseService implements IMetadataService {
  private static instance: MetadataService;
  private metadataCache: Map<string, IElementMetadata> = new Map();

  private constructor() {
    super('MetadataService');
  }

  /**
   * Get singleton instance
   */
  static getInstance(): MetadataService {
    if (!MetadataService.instance) {
      MetadataService.instance = new MetadataService();
    }
    return MetadataService.instance;
  }

  /**
   * Store metadata for an element
   */
  async storeMetadata(elementId: string, metadata: IElementMetadata): Promise<IServiceResult<void>> {
    return this.executeOperation(`storeMetadata-${elementId}`, async () => {
      try {
        // Find the element
        const element = figma.currentPage.findOne(node => node.id === elementId);
        if (!element) {
          throw new Error(`Element with id ${elementId} not found`);
        }

        // Store in Figma plugin data
        element.setPluginData('metadata', JSON.stringify(metadata));
        
        // Cache locally
        this.metadataCache.set(elementId, metadata);

        this.logOperation(ELogLevel.INFO, 'Metadata stored successfully', {
          elementId,
          metadataKeys: Object.keys(metadata)
        });

        return undefined;
      } catch (error) {
        this.logOperation(ELogLevel.ERROR, 'Failed to store metadata', {
          elementId,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
        throw error;
      }
    });
  }

  /**
   * Get metadata for an element
   */
  async getMetadata(elementId: string): Promise<IServiceResult<IElementMetadata>> {
    return this.executeOperation(`getMetadata-${elementId}`, async () => {
      try {
        // Check cache first
        const cachedMetadata = this.metadataCache.get(elementId);
        if (cachedMetadata) {
          return cachedMetadata;
        }

        // Find the element
        const element = figma.currentPage.findOne(node => node.id === elementId);
        if (!element) {
          throw new Error(`Element with id ${elementId} not found`);
        }

        // Get from Figma plugin data
        const metadataJson = element.getPluginData('metadata');
        if (!metadataJson) {
          throw new Error(`No metadata found for element ${elementId}`);
        }

        const metadata: IElementMetadata = JSON.parse(metadataJson);
        
        // Cache locally
        this.metadataCache.set(elementId, metadata);

        return metadata;
      } catch (error) {
        this.logOperation(ELogLevel.ERROR, 'Failed to get metadata', {
          elementId,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
        throw error;
      }
    });
  }

  /**
   * Update metadata for an element
   */
  async updateMetadata(elementId: string, updates: Partial<IElementMetadata>): Promise<IServiceResult<IElementMetadata>> {
    return this.executeOperation(`updateMetadata-${elementId}`, async () => {
      try {
        // Get existing metadata
        const existingResult = await this.getMetadata(elementId);
        if (!existingResult.success || !existingResult.data) {
          throw new Error(`Cannot update metadata: ${existingResult.error?.message}`);
        }

        // Merge updates
        const updatedMetadata: IElementMetadata = {
          ...existingResult.data,
          ...updates,
          updatedAt: new Date().toISOString()
        };

        // Store updated metadata
        const storeResult = await this.storeMetadata(elementId, updatedMetadata);
        if (!storeResult.success) {
          throw new Error(`Failed to store updated metadata: ${storeResult.error?.message}`);
        }

        return updatedMetadata;
      } catch (error) {
        this.logOperation(ELogLevel.ERROR, 'Failed to update metadata', {
          elementId,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
        throw error;
      }
    });
  }

  /**
   * Delete metadata for an element
   */
  async deleteMetadata(elementId: string): Promise<IServiceResult<void>> {
    return this.executeOperation(`deleteMetadata-${elementId}`, async () => {
      try {
        // Find the element
        const element = figma.currentPage.findOne(node => node.id === elementId);
        if (element) {
          // Remove from Figma plugin data
          element.setPluginData('metadata', '');
        }

        // Remove from cache
        this.metadataCache.delete(elementId);

        this.logOperation(ELogLevel.INFO, 'Metadata deleted successfully', { elementId });

        return undefined;
      } catch (error) {
        this.logOperation(ELogLevel.ERROR, 'Failed to delete metadata', {
          elementId,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
        throw error;
      }
    });
  }

  /**
   * Search elements by metadata
   */
  async searchByMetadata(query: Record<string, any>): Promise<IServiceResult<IElementMetadata[]>> {
    return this.executeOperation('searchByMetadata', async () => {
      try {
        const results: IElementMetadata[] = [];
        
        // Search all elements in current page
        const allElements = figma.currentPage.findAll(() => true);
        
        for (const element of allElements) {
          try {
            const metadataJson = element.getPluginData('metadata');
            if (metadataJson) {
              const metadata: IElementMetadata = JSON.parse(metadataJson);
              
              // Check if metadata matches query
              const matches = Object.entries(query).every(([key, value]) => {
                const metadataValue = (metadata as any)[key];
                
                if (Array.isArray(metadataValue) && Array.isArray(value)) {
                  return value.some(v => metadataValue.includes(v));
                }
                
                if (typeof metadataValue === 'string' && typeof value === 'string') {
                  return metadataValue.toLowerCase().includes(value.toLowerCase());
                }
                
                return metadataValue === value;
              });
              
              if (matches) {
                results.push(metadata);
              }
            }
          } catch (error) {
            // Skip elements with invalid metadata
            continue;
          }
        }

        this.logOperation(ELogLevel.INFO, 'Metadata search completed', {
          query,
          resultCount: results.length
        });

        return results;
      } catch (error) {
        this.logOperation(ELogLevel.ERROR, 'Metadata search failed', {
          query,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
        throw error;
      }
    });
  }

  /**
   * Get all metadata from current page
   */
  async getAllMetadata(): Promise<IServiceResult<IElementMetadata[]>> {
    return this.executeOperation('getAllMetadata', async () => {
      try {
        const results: IElementMetadata[] = [];
        const allElements = figma.currentPage.findAll(() => true);
        
        for (const element of allElements) {
          try {
            const metadataJson = element.getPluginData('metadata');
            if (metadataJson) {
              const metadata: IElementMetadata = JSON.parse(metadataJson);
              results.push(metadata);
            }
          } catch (error) {
            // Skip elements with invalid metadata
            continue;
          }
        }

        return results;
      } catch (error) {
        throw error;
      }
    });
  }

  /**
   * Clear all cached metadata
   */
  clearCache(): void {
    this.metadataCache.clear();
    this.logOperation(ELogLevel.INFO, 'Metadata cache cleared');
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): { size: number; elements: string[] } {
    return {
      size: this.metadataCache.size,
      elements: Array.from(this.metadataCache.keys())
    };
  }
}
