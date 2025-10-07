import { IElementConfig, IValidationResult, IValidationError, IValidationWarning } from '../types/interfaces';
import { EValidationErrorCode, ELogLevel } from '../types/enums';
import { BaseService } from './base/BaseService';

/**
 * Validation Service - Professional validation for element configurations
 * Ensures data integrity and prevents invalid configurations
 */
export class ValidationService extends BaseService {
  private static instance: ValidationService;

  private constructor() {
    super('ValidationService');
  }

  /**
   * Get singleton instance
   */
  static getInstance(): ValidationService {
    if (!ValidationService.instance) {
      ValidationService.instance = new ValidationService();
    }
    return ValidationService.instance;
  }

  /**
   * Validate element configuration
   */
  async validateElementConfig(config: Partial<IElementConfig>): Promise<IValidationResult> {
    try {
      const errors: IValidationError[] = [];
      const warnings: IValidationWarning[] = [];

      // Validate size
      if (config.size) {
        const sizeValidation = this.validateSize(config.size);
        errors.push(...sizeValidation.errors);
        warnings.push(...sizeValidation.warnings);
      }

      // Validate position
      if (config.position) {
        const positionValidation = this.validatePosition(config.position);
        errors.push(...positionValidation.errors);
        warnings.push(...positionValidation.warnings);
      }

      // Validate styling
      if (config.styling) {
        const stylingValidation = this.validateStyling(config.styling as Record<string, unknown>);
        errors.push(...stylingValidation.errors);
        warnings.push(...stylingValidation.warnings);
      }

      // Validate constraints
      if (config.constraints) {
        const constraintsValidation = this.validateConstraints(config.constraints as unknown as Record<string, unknown>);
        errors.push(...constraintsValidation.errors);
        warnings.push(...constraintsValidation.warnings);
      }

      // Validate opacity
      if (config.opacity !== undefined) {
        const opacityValidation = this.validateOpacity(config.opacity);
        errors.push(...opacityValidation.errors);
        warnings.push(...opacityValidation.warnings);
      }

      // Validate name
      if (config.name !== undefined) {
        const nameValidation = this.validateName(config.name);
        errors.push(...nameValidation.errors);
        warnings.push(...nameValidation.warnings);
      }

      const isValid = errors.length === 0;

      this.logOperation(
        isValid ? ELogLevel.DEBUG : ELogLevel.WARN,
        `Configuration validation ${isValid ? 'passed' : 'failed'}`,
        {
          isValid,
          errorCount: errors.length,
          warningCount: warnings.length,
          errors: errors.map(e => e.message),
          warnings: warnings.map(w => w.message)
        }
      );

      return {
        isValid,
        errors,
        warnings
      };

    } catch (error) {
      this.logOperation(ELogLevel.ERROR, 'Validation failed with exception', {
        error: error instanceof Error ? error.message : 'Unknown error'
      });

      return {
        isValid: false,
        errors: [{
          field: 'general',
          message: 'Validation failed due to internal error',
          code: EValidationErrorCode.CONSTRAINT_VIOLATION
        }],
        warnings: []
      };
    }
  }

  /**
   * Validate size configuration
   */
  private validateSize(size: { width: number; height: number; maintainAspectRatio?: boolean }): {
    errors: IValidationError[];
    warnings: IValidationWarning[];
  } {
    const errors: IValidationError[] = [];
    const warnings: IValidationWarning[] = [];

    // Validate width
    if (typeof size.width !== 'number') {
      errors.push({
        field: 'size.width',
        message: 'Width must be a number',
        code: EValidationErrorCode.INVALID_TYPE
      });
    } else if (size.width <= 0) {
      errors.push({
        field: 'size.width',
        message: 'Width must be greater than 0',
        code: EValidationErrorCode.OUT_OF_RANGE
      });
    } else if (size.width > 10000) {
      warnings.push({
        field: 'size.width',
        message: 'Width is very large, may cause performance issues',
        suggestion: 'Consider using a smaller width (< 10000px)'
      });
    }

    // Validate height
    if (typeof size.height !== 'number') {
      errors.push({
        field: 'size.height',
        message: 'Height must be a number',
        code: EValidationErrorCode.INVALID_TYPE
      });
    } else if (size.height <= 0) {
      errors.push({
        field: 'size.height',
        message: 'Height must be greater than 0',
        code: EValidationErrorCode.OUT_OF_RANGE
      });
    } else if (size.height > 10000) {
      warnings.push({
        field: 'size.height',
        message: 'Height is very large, may cause performance issues',
        suggestion: 'Consider using a smaller height (< 10000px)'
      });
    }

    return { errors, warnings };
  }

  /**
   * Validate position configuration
   */
  private validatePosition(position: { x: number; y: number; relativeTo?: string }): {
    errors: IValidationError[];
    warnings: IValidationWarning[];
  } {
    const errors: IValidationError[] = [];
    const warnings: IValidationWarning[] = [];

    // Validate x coordinate
    if (typeof position.x !== 'number') {
      errors.push({
        field: 'position.x',
        message: 'X coordinate must be a number',
        code: EValidationErrorCode.INVALID_TYPE
      });
    } else if (Math.abs(position.x) > 100000) {
      warnings.push({
        field: 'position.x',
        message: 'X coordinate is very far from origin',
        suggestion: 'Consider positioning closer to the origin'
      });
    }

    // Validate y coordinate
    if (typeof position.y !== 'number') {
      errors.push({
        field: 'position.y',
        message: 'Y coordinate must be a number',
        code: EValidationErrorCode.INVALID_TYPE
      });
    } else if (Math.abs(position.y) > 100000) {
      warnings.push({
        field: 'position.y',
        message: 'Y coordinate is very far from origin',
        suggestion: 'Consider positioning closer to the origin'
      });
    }

    return { errors, warnings };
  }

  /**
   * Validate styling configuration
   */
  private validateStyling(styling: Record<string, unknown>): {
    errors: IValidationError[];
    warnings: IValidationWarning[];
  } {
    const errors: IValidationError[] = [];
    const warnings: IValidationWarning[] = [];

    // Validate stroke weight
    if (styling.strokeWeight !== undefined) {
      if (typeof styling.strokeWeight !== 'number') {
        errors.push({
          field: 'styling.strokeWeight',
          message: 'Stroke weight must be a number',
          code: EValidationErrorCode.INVALID_TYPE
        });
      } else if (styling.strokeWeight < 0) {
        errors.push({
          field: 'styling.strokeWeight',
          message: 'Stroke weight cannot be negative',
          code: EValidationErrorCode.OUT_OF_RANGE
        });
      } else if (styling.strokeWeight > 100) {
        warnings.push({
          field: 'styling.strokeWeight',
          message: 'Stroke weight is very large',
          suggestion: 'Consider using a smaller stroke weight (< 100px)'
        });
      }
    }

    // Validate corner radius
    if (styling.cornerRadius !== undefined) {
      if (typeof styling.cornerRadius === 'number') {
        if (styling.cornerRadius < 0) {
          errors.push({
            field: 'styling.cornerRadius',
            message: 'Corner radius cannot be negative',
            code: EValidationErrorCode.OUT_OF_RANGE
          });
        }
      } else if (Array.isArray(styling.cornerRadius)) {
        styling.cornerRadius.forEach((radius: unknown, index: number) => {
          if (typeof radius !== 'number') {
            errors.push({
              field: `styling.cornerRadius[${index}]`,
              message: 'Corner radius must be a number',
              code: EValidationErrorCode.INVALID_TYPE
            });
          } else if (radius < 0) {
            errors.push({
              field: `styling.cornerRadius[${index}]`,
              message: 'Corner radius cannot be negative',
              code: EValidationErrorCode.OUT_OF_RANGE
            });
          }
        });
      } else {
        errors.push({
          field: 'styling.cornerRadius',
          message: 'Corner radius must be a number or array of numbers',
          code: EValidationErrorCode.INVALID_TYPE
        });
      }
    }

    return { errors, warnings };
  }

  /**
   * Validate constraints configuration
   */
  private validateConstraints(constraints: Record<string, unknown>): {
    errors: IValidationError[];
    warnings: IValidationWarning[];
  } {
    const errors: IValidationError[] = [];
    const warnings: IValidationWarning[] = [];

    const validConstraints = ['MIN', 'CENTER', 'MAX', 'STRETCH', 'SCALE'];

    if (constraints.horizontal && !validConstraints.includes(constraints.horizontal as string)) {
      errors.push({
        field: 'constraints.horizontal',
        message: `Invalid horizontal constraint. Must be one of: ${validConstraints.join(', ')}`,
        code: EValidationErrorCode.INVALID_FORMAT
      });
    }

    if (constraints.vertical && !validConstraints.includes(constraints.vertical as string)) {
      errors.push({
        field: 'constraints.vertical',
        message: `Invalid vertical constraint. Must be one of: ${validConstraints.join(', ')}`,
        code: EValidationErrorCode.INVALID_FORMAT
      });
    }

    return { errors, warnings };
  }

  /**
   * Validate opacity value
   */
  private validateOpacity(opacity: number): {
    errors: IValidationError[];
    warnings: IValidationWarning[];
  } {
    const errors: IValidationError[] = [];
    const warnings: IValidationWarning[] = [];

    if (typeof opacity !== 'number') {
      errors.push({
        field: 'opacity',
        message: 'Opacity must be a number',
        code: EValidationErrorCode.INVALID_TYPE
      });
    } else if (opacity < 0 || opacity > 1) {
      errors.push({
        field: 'opacity',
        message: 'Opacity must be between 0 and 1',
        code: EValidationErrorCode.OUT_OF_RANGE
      });
    } else if (opacity < 0.1) {
      warnings.push({
        field: 'opacity',
        message: 'Element will be nearly invisible with very low opacity',
        suggestion: 'Consider using opacity >= 0.1 for better visibility'
      });
    }

    return { errors, warnings };
  }

  /**
   * Validate element name
   */
  private validateName(name: string): {
    errors: IValidationError[];
    warnings: IValidationWarning[];
  } {
    const errors: IValidationError[] = [];
    const warnings: IValidationWarning[] = [];

    if (typeof name !== 'string') {
      errors.push({
        field: 'name',
        message: 'Name must be a string',
        code: EValidationErrorCode.INVALID_TYPE
      });
    } else {
      if (name.length === 0) {
        warnings.push({
          field: 'name',
          message: 'Element name is empty',
          suggestion: 'Consider providing a descriptive name'
        });
      } else if (name.length > 255) {
        warnings.push({
          field: 'name',
          message: 'Element name is very long',
          suggestion: 'Consider using a shorter name (< 255 characters)'
        });
      }

      // Check for potentially problematic characters
      const problematicChars = /[<>:"\/\\|?*\x00-\x1f]/;
      if (problematicChars.test(name)) {
        warnings.push({
          field: 'name',
          message: 'Element name contains special characters that may cause issues',
          suggestion: 'Consider using only alphanumeric characters, spaces, hyphens, and underscores'
        });
      }
    }

    return { errors, warnings };
  }

  /**
   * Validate array of configurations
   */
  async validateMultipleConfigs(configs: Partial<IElementConfig>[]): Promise<IValidationResult[]> {
    const results: IValidationResult[] = [];

    for (let i = 0; i < configs.length; i++) {
      try {
        const result = await this.validateElementConfig(configs[i]);
        results.push(result);
      } catch (error) {
        results.push({
          isValid: false,
          errors: [{
            field: `config[${i}]`,
            message: `Validation failed for configuration at index ${i}`,
            code: EValidationErrorCode.CONSTRAINT_VIOLATION
          }],
          warnings: []
        });
      }
    }

    return results;
  }

  /**
   * Get validation summary for multiple results
   */
  getValidationSummary(results: IValidationResult[]): {
    totalConfigs: number;
    validConfigs: number;
    invalidConfigs: number;
    totalErrors: number;
    totalWarnings: number;
    successRate: number;
  } {
    const totalConfigs = results.length;
    const validConfigs = results.filter(r => r.isValid).length;
    const invalidConfigs = totalConfigs - validConfigs;
    const totalErrors = results.reduce((sum, r) => sum + r.errors.length, 0);
    const totalWarnings = results.reduce((sum, r) => sum + r.warnings.length, 0);
    const successRate = totalConfigs > 0 ? (validConfigs / totalConfigs) * 100 : 0;

    return {
      totalConfigs,
      validConfigs,
      invalidConfigs,
      totalErrors,
      totalWarnings,
      successRate
    };
  }
}
