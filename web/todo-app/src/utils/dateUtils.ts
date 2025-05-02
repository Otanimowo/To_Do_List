/**
 * Date Utility Functions
 * 
 * Contains reusable date formatting and manipulation functions for the Todo application.
 */

import { createLogger } from './logger';

const log = createLogger('DateUtils');

/**
 * Format a date string for display
 * 
 * @param {string} dateString - ISO date string to format
 * @param {Intl.DateTimeFormatOptions} options - Formatting options
 * @returns {string|null} Formatted date string or null if invalid
 */
export const formatDate = (
  dateString?: string, 
  options: Intl.DateTimeFormatOptions = { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  }
): string | null => {
  if (!dateString) return null;
  
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', options).format(date);
  } catch (error) {
    log.error('Error formatting date:', error);
    return null;
  }
};

/**
 * Format a date string for HTML date input (YYYY-MM-DD)
 * 
 * @param {string} dateString - ISO date string to format
 * @returns {string} Date in YYYY-MM-DD format or empty string if invalid
 */
export const formatDateForInput = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  } catch (error) {
    log.error('Error formatting date for input:', error);
    return '';
  }
};

/**
 * Check if a date is in the past (overdue)
 * 
 * @param {string} dateString - ISO date string to check
 * @returns {boolean} True if date is in the past, false otherwise
 */
export const isDateOverdue = (dateString?: string): boolean => {
  if (!dateString) return false;
  
  try {
    const date = new Date(dateString);
    const today = new Date();
    
    // Reset time to compare just the dates
    today.setHours(0, 0, 0, 0);
    
    return date < today;
  } catch (error) {
    log.error('Error checking if date is overdue:', error);
    return false;
  }
};

/**
 * Get the number of days between two dates
 * 
 * @param {Date|string} date1 - First date
 * @param {Date|string} date2 - Second date (defaults to today)
 * @returns {number} Number of days between dates
 */
export const getDaysBetween = (
  date1: Date | string,
  date2: Date | string = new Date()
): number => {
  try {
    const d1 = date1 instanceof Date ? date1 : new Date(date1);
    const d2 = date2 instanceof Date ? date2 : new Date(date2);
    
    // Reset time parts
    d1.setHours(0, 0, 0, 0);
    d2.setHours(0, 0, 0, 0);
    
    // Calculate difference in days
    const diffTime = Math.abs(d2.getTime() - d1.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  } catch (error) {
    log.error('Error calculating days between dates:', error);
    return 0;
  }
}; 