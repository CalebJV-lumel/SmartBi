/// <reference types="@figma/plugin-typings" />

import { PLUGIN_CONFIG } from './config';
import { MessageHandler } from './handlers/MessageHandler';
import { UIMessage } from './types';
import { PluginUtils } from './utils';

/**
 * Main Plugin Controller
 * Orchestrates the entire plugin lifecycle and communication
 */
export class PluginController {
  private static instance: PluginController;
  private messageHandler: MessageHandler;
  private isInitialized = false;

  private constructor() {
    this.messageHandler = MessageHandler.getInstance();
  }

  /**
   * Get singleton instance
   */
  static getInstance(): PluginController {
    if (!PluginController.instance) {
      PluginController.instance = new PluginController();
    }
    return PluginController.instance;
  }

  /**
   * Initialize the plugin
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) {
      PluginUtils.log('warn', 'Plugin already initialized');
      return;
    }

    try {
      PluginUtils.log('info', 'Initializing Dashboard Creator Plugin');

      // Show UI with configuration
      this.showUI();

      // Set up message listener
      this.setupMessageListener();

      // Mark as initialized
      this.isInitialized = true;

      PluginUtils.log('info', 'Plugin initialized successfully');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Initialization failed';
      PluginUtils.log('error', 'Plugin initialization failed', { error: errorMessage });
      
      figma.notify('Plugin initialization failed');
      figma.closePlugin();
    }
  }

  /**
   * Show UI with configuration
   */
  private showUI(): void {
    const uiConfig = {
      width: PLUGIN_CONFIG.ui.width,
      height: PLUGIN_CONFIG.ui.height,
      themeColors: PLUGIN_CONFIG.ui.themeColors,
      title: PLUGIN_CONFIG.ui.title || 'Dashboard Creator'
    };
    
    figma.showUI(__html__, uiConfig);
    PluginUtils.log('info', 'UI displayed', uiConfig);
  }

  /**
   * Set up message listener for UI communication
   */
  private setupMessageListener(): void {
    figma.ui.onmessage = async (message: UIMessage) => {
      await this.messageHandler.handleMessage(message);
    };

    PluginUtils.log('info', 'Message listener configured');
  }

  /**
   * Shutdown the plugin
   */
  shutdown(): void {
    PluginUtils.log('info', 'Shutting down plugin');
    this.isInitialized = false;
    figma.closePlugin();
  }

  /**
   * Get plugin status
   */
  getStatus(): { initialized: boolean; version: string } {
    return {
      initialized: this.isInitialized,
      version: '1.0.0'
    };
  }
}
