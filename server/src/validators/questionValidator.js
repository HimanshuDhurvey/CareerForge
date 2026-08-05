'use strict';

/**
 * questionValidator.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Reusable validation utility for Question datasets and JSON files.
 * Provides schema validation, enum verification, type checking, and
 * intra-file duplicate detection.
 */

const VALID_DIFFICULTIES   = ['Easy', 'Medium', 'Hard'];
const VALID_INTERVIEW_TYPES = ['Technical', 'HR', 'Behavioral', 'Mixed'];

/**
 * Validates a single raw question record.
 *
 * @param {Object} item - Question object to validate
 * @returns {{ isValid: boolean, errors: Array<string> }} Validation result
 */
const validateQuestionRecord = (item) => {
  const errors = [];

  if (!item || typeof item !== 'object' || Array.isArray(item)) {
    return { isValid: false, errors: ['Question record must be a non-null object'] };
  }

  // 1. String fields: role, category, question
  if (!item.role || typeof item.role !== 'string' || !item.role.trim()) {
    errors.push('Field "role" is required and must be a non-empty string');
  }

  if (!item.category || typeof item.category !== 'string' || !item.category.trim()) {
    errors.push('Field "category" is required and must be a non-empty string');
  }

  if (!item.question || typeof item.question !== 'string' || !item.question.trim()) {
    errors.push('Field "question" is required and must be a non-empty string');
  }

  // 2. Enum: difficulty
  if (!item.difficulty || typeof item.difficulty !== 'string' || !VALID_DIFFICULTIES.includes(item.difficulty.trim())) {
    errors.push(`Field "difficulty" is required and must be one of: ${VALID_DIFFICULTIES.join(', ')}`);
  }

  // 3. Enum: interviewType
  if (!item.interviewType || typeof item.interviewType !== 'string' || !VALID_INTERVIEW_TYPES.includes(item.interviewType.trim())) {
    errors.push(`Field "interviewType" is required and must be one of: ${VALID_INTERVIEW_TYPES.join(', ')}`);
  }

  // 4. Array: expectedTopics
  if (!item.expectedTopics || !Array.isArray(item.expectedTopics)) {
    errors.push('Field "expectedTopics" is required and must be an array of strings');
  } else {
    const invalidTopics = item.expectedTopics.some((topic) => typeof topic !== 'string' || !topic.trim());
    if (invalidTopics) {
      errors.push('All elements in "expectedTopics" must be non-empty strings');
    }
  }

  // 5. Optional Array: tags
  if (item.tags !== undefined) {
    if (!Array.isArray(item.tags)) {
      errors.push('Field "tags" must be an array of strings');
    } else {
      const invalidTags = item.tags.some((tag) => typeof tag !== 'string');
      if (invalidTags) {
        errors.push('All elements in "tags" must be strings');
      }
    }
  }

  // Optional Array: keyPoints (if missing, automatically set to [])
  if (item.keyPoints === undefined) {
    item.keyPoints = [];
  } else if (!Array.isArray(item.keyPoints)) {
    errors.push('Field "keyPoints" must be an array of strings');
  } else {
    const invalidKeyPoints = item.keyPoints.some((point) => typeof point !== 'string');
    if (invalidKeyPoints) {
      errors.push('All elements in "keyPoints" must be strings');
    }
  }

  // 6. Optional Numeric: estimatedTime
  if (item.estimatedTime !== undefined && (typeof item.estimatedTime !== 'number' || item.estimatedTime < 0)) {
    errors.push('Field "estimatedTime" must be a non-negative number');
  }

  // 7. Optional Boolean: isActive
  if (item.isActive !== undefined && typeof item.isActive !== 'boolean') {
    errors.push('Field "isActive" must be a boolean value');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Validates a dataset array loaded from a JSON file.
 * Checks item fields as well as duplicate questions inside the same file.
 *
 * @param {Array<Object>} records - Raw JSON records array or single object
 * @returns {{ validRecords: Array<Object>, invalidCount: number, duplicateInFileCount: number, errors: Array<string> }}
 */
const validateDataset = (records) => {
  const list = Array.isArray(records) ? records : [records];
  const validRecords = [];
  let invalidCount = 0;
  let duplicateInFileCount = 0;
  const errors = [];
  const seenKeys = new Set();

  list.forEach((record, index) => {
    const recordValidation = validateQuestionRecord(record);
    if (!recordValidation.isValid) {
      invalidCount++;
      errors.push(`Item #${index + 1}: ${recordValidation.errors.join('; ')}`);
      return;
    }

    // Key for intra-file duplicate detection: role + difficulty + question
    const uniqueKey = `${record.role.trim().toLowerCase()}|${record.difficulty.trim().toLowerCase()}|${record.question.trim().toLowerCase()}`;

    if (seenKeys.has(uniqueKey)) {
      duplicateInFileCount++;
      errors.push(`Item #${index + 1}: Duplicate question within the same file ("${record.question.trim()}")`);
    } else {
      seenKeys.add(uniqueKey);
      validRecords.push(record);
    }
  });

  return {
    validRecords,
    invalidCount,
    duplicateInFileCount,
    errors,
  };
};

module.exports = {
  VALID_DIFFICULTIES,
  VALID_INTERVIEW_TYPES,
  validateQuestionRecord,
  validateDataset,
};
