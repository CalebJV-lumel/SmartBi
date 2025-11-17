import { PluginController } from './core/PluginController';

/**
 * Plugin Entry Point
 */
async function main(): Promise<void> {
  try {
    const controller = PluginController.getInstance();
    await controller.initialize();
  } catch (error) {
    console.error('Plugin initialization failed:', error);
    figma.notify('❌ Plugin failed to start');
    figma.closePlugin();
  }
}

main();
