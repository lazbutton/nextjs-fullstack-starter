/**
 * Email template constants
 */

export const EMAIL_STYLES = {
  CONTAINER_MAX_WIDTH: '600px',
  PRIMARY_COLOR: '#007bff',
  DANGER_COLOR: '#dc3545',
  TEXT_COLOR: '#333',
  MUTED_COLOR: '#666',
  BACKGROUND_LIGHT: '#f4f4f4',
  BACKGROUND_WHITE: '#ffffff',
  FONT_FAMILY: 'Arial, sans-serif',
  LINE_HEIGHT: '1.6',
  PADDING_SMALL: '20px',
  PADDING_MEDIUM: '30px',
  FONT_SIZE_SMALL: '12px',
} as const

export const EMAIL_EXPIRY = {
  VERIFICATION_HOURS: 24,
  PASSWORD_RESET_HOURS: 1,
} as const

export const EMAIL_DEFAULTS = {
  DEFAULT_NAME: 'there',
} as const

