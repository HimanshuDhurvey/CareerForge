'use strict';

/**
 * questionSelectionService.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Reusable Question Selection Engine service for the CareerForge Interview Engine.
 *
 * Responsibilities:
 *   - Intelligently select balanced interview questions across topics/categories.
 *   - Deduplicate selected questions (guarantee no duplicate questions in session).
 *   - Filter active questions by role, difficulty, and interview type.
 *   - Gracefully fallback across difficulties/categories if exact criteria has insufficient pool.
 *   - Randomize question order within each topic/category and final session payload.
 */

const Question = require('../models/Question');
const ApiError = require('../utils/ApiError');

/**
 * Fisher-Yates Shuffle helper algorithm to randomize an array in-place.
 *
 * @param {Array} array
 * @returns {Array} Shuffled array
 */
const shuffleArray = (array) => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

/**
 * Select balanced questions for an interview session.
 *
 * @param {Object} options
 * @param {string} options.role - Target job role (e.g., 'Frontend Developer')
 * @param {string} options.difficulty - Target difficulty ('Easy', 'Medium', 'Hard')
 * @param {string} options.interviewType - Interview type ('Technical', 'HR', 'Behavioral', 'Mixed')
 * @param {number} [options.numberOfQuestions=10] - Number of questions requested
 * @returns {Promise<Array<Object>>} List of selected Question documents
 */
const selectQuestions = async ({
  role,
  difficulty,
  interviewType,
  numberOfQuestions = 10,
}) => {
  const targetCount = Math.max(1, Number(numberOfQuestions) || 10);

  // 1. Build regex for flexible role matching (case-insensitive)
  const roleRegex = new RegExp(role.trim(), 'i');

  // 2. Build interviewType query condition
  let typeQuery;
  if (!interviewType || interviewType === 'Mixed') {
    typeQuery = { $in: ['Technical', 'HR', 'Behavioral', 'Mixed'] };
  } else {
    typeQuery = { $in: [interviewType, 'Mixed'] };
  }

  // 3. Primary fetch matching role, interviewType, and exact difficulty
  let primaryQuery = {
    isActive: true,
    role: roleRegex,
    interviewType: typeQuery,
    difficulty: difficulty,
  };

  let candidateQuestions = await Question.find(primaryQuery).lean();

  // 4. Fallback Strategy: If primary query yields fewer questions than requested
  if (candidateQuestions.length < targetCount) {
    // Search across all difficulties for the given role and interviewType
    const secondaryQuery = {
      isActive: true,
      role: roleRegex,
      interviewType: typeQuery,
    };

    const fallbackQuestions = await Question.find(secondaryQuery).lean();

    // Combine candidate pools avoiding duplicate ObjectIds
    const existingIds = new Set(candidateQuestions.map((q) => q._id.toString()));
    for (const q of fallbackQuestions) {
      if (!existingIds.has(q._id.toString())) {
        candidateQuestions.push(q);
        existingIds.add(q._id.toString());
      }
    }
  }

  // 5. Secondary Fallback Strategy: If still under target, search all active questions for interviewType
  if (candidateQuestions.length < targetCount) {
    const tertiaryQuery = {
      isActive: true,
      interviewType: typeQuery,
    };

    const globalFallback = await Question.find(tertiaryQuery).lean();
    const existingIds = new Set(candidateQuestions.map((q) => q._id.toString()));
    for (const q of globalFallback) {
      if (!existingIds.has(q._id.toString())) {
        candidateQuestions.push(q);
        existingIds.add(q._id.toString());
      }
    }
  }

  // 6. Check if any questions were found at all
  if (candidateQuestions.length === 0) {
    throw new ApiError(
      404,
      `No active questions available in the question bank for role '${role}' and type '${interviewType}'`
    );
  }

  // 7. Group candidate questions by category/topic to ensure topic balance
  const categoryGroups = {};
  for (const q of candidateQuestions) {
    const categoryKey = (q.category || 'General').trim().toLowerCase();
    if (!categoryGroups[categoryKey]) {
      categoryGroups[categoryKey] = [];
    }
    categoryGroups[categoryKey].push(q);
  }

  // 8. Shuffle questions within each category group for variety
  const categoryKeys = Object.keys(categoryGroups);
  for (const key of categoryKeys) {
    categoryGroups[key] = shuffleArray(categoryGroups[key]);
  }

  // 9. Round-robin balanced selection across category groups
  const selectedQuestions = [];
  const selectedIds = new Set();

  let addedInPass = true;
  while (selectedQuestions.length < targetCount && addedInPass) {
    addedInPass = false;
    for (const key of categoryKeys) {
      if (selectedQuestions.length >= targetCount) break;

      const group = categoryGroups[key];
      if (group && group.length > 0) {
        const nextQ = group.shift();
        if (!selectedIds.has(nextQ._id.toString())) {
          selectedIds.add(nextQ._id.toString());
          selectedQuestions.push(nextQ);
          addedInPass = true;
        }
      }
    }
  }

  // 10. Shuffle the final assembled list of questions so candidate gets a dynamic mix
  const finalQuestions = shuffleArray(selectedQuestions);

  return finalQuestions;
};

module.exports = {
  selectQuestions,
  shuffleArray,
};
