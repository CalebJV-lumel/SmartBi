/**
 * Dashboard Creator Plugin - Main Entry Point
 * 
 * Professional, scalable, and maintainable Figma plugin controller
 * Following industrial standards for code organization and architecture
 * 
 * @version 1.0.0
 * @author Dashboard Creator Team
 */

import { PluginController } from './PluginController';

/**
 * Plugin Entry Point
 * Initialize the Dashboard Creator plugin with professional architecture
 */
async function main(): Promise<void> {
  try {
    const controller = PluginController.getInstance();
    await controller.initialize();
  } catch (error) {
    console.error('Failed to start Dashboard Creator plugin:', error);
    figma.notify('Plugin failed to start');
    figma.closePlugin();
  }
}

// Start the plugin
main();
