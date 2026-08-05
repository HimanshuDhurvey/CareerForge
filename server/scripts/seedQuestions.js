'use strict';

/**
 * seedQuestions.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Question Bank Import & Seeding Script (Recursive Directory Scanner).
 *
 * Recursively scans `server/data/questions/` and all subdirectories for JSON files.
 * Uses `questionValidator` utility to validate schema requirements, type constraints,
 * and intra-file duplicates. Checks MongoDB for existing records to prevent duplicates
 * and updates existing records missing the `keyPoints` field.
 *
 * Usage:
 *   node scripts/seedQuestions.js
 *   npm run seed:questions
 */

const path     = require('path');
const fs       = require('fs');
const dotenv   = require('dotenv');
const mongoose = require('mongoose');

// Load environment variables from server root .env
dotenv.config({ path: path.join(__dirname, '../.env') });

const connectDB = require('../src/config/db');
const Question  = require('../src/models/Question');
const logger    = require('../src/utils/logger');
const { validateDataset } = require('../src/validators/questionValidator');

/**
 * Recursively retrieves all `.json` files inside a given directory and its subdirectories.
 *
 * @param {string} dirPath - Target root directory path
 * @param {Array<string>} [fileList=[]] - Accumulated file path list
 * @returns {Array<string>} List of absolute JSON file paths
 */
const getJsonFilesRecursively = (dirPath, fileList = []) => {
  if (!fs.existsSync(dirPath)) {
    return fileList;
  }

  const entries = fs.readdirSync(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      getJsonFilesRecursively(fullPath, fileList);
    } else if (entry.isFile() && entry.name.endsWith('.json')) {
      fileList.push(fullPath);
    }
  }

  return fileList;
};

/**
 * Main recursive seeding workflow function.
 */
const seedQuestions = async () => {
  let importedCount = 0;
  let updatedCount  = 0;
  let skippedCount  = 0;
  let failedCount   = 0;

  console.log('\n========================================');
  console.log(' Starting Question Bank Import Process ');
  console.log('========================================\n');

  try {
    // 1. Connect to MongoDB
    await connectDB();

    // 2. Resolve root target directory containing question JSON files
    const questionsRootDir = path.join(__dirname, '../data/questions');

    // Recursively collect all JSON file paths
    const jsonFiles = getJsonFilesRecursively(questionsRootDir);

    if (jsonFiles.length === 0) {
      logger.info('No JSON question files found in data/questions/ or its subdirectories.');
    } else {
      logger.info(`Discovered ${jsonFiles.length} JSON file(s) across dataset directories.`);
    }

    // 3. Process each JSON file
    for (const filePath of jsonFiles) {
      const relativePath = path.relative(questionsRootDir, filePath);
      logger.info(`Processing dataset file: ${relativePath}`);

      let rawContent;
      try {
        rawContent = fs.readFileSync(filePath, 'utf8');
      } catch (readErr) {
        logger.error(`Failed to read file ${relativePath}: ${readErr.message}`);
        failedCount++;
        continue;
      }

      let parsedData;
      try {
        parsedData = JSON.parse(rawContent);
      } catch (parseErr) {
        logger.error(`Invalid JSON syntax in file ${relativePath}: ${parseErr.message}`);
        failedCount++;
        continue;
      }

      // Validate dataset records and check intra-file duplicates
      const { validRecords, invalidCount, duplicateInFileCount, errors } = validateDataset(parsedData);

      failedCount += invalidCount;
      skippedCount += duplicateInFileCount;

      if (errors.length > 0) {
        errors.forEach((err) => logger.warn(`[${relativePath}] ${err}`));
      }

      // Check database duplicates and insert or update valid records
      for (const record of validRecords) {
        const role = record.role.trim();
        const difficulty = record.difficulty.trim();
        const questionText = record.question.trim();

        // Query database lean document to check if question exists and its keyPoints state
        const existingDoc = await Question.findOne({
          role,
          difficulty,
          question: questionText,
        }).lean();

        if (existingDoc) {
          // Check if keyPoints field is missing in existing MongoDB document
          if (existingDoc.keyPoints === undefined) {
            await Question.updateOne(
              { _id: existingDoc._id },
              { $set: { keyPoints: Array.isArray(record.keyPoints) ? record.keyPoints : [] } }
            );
            updatedCount++;
          } else {
            skippedCount++;
          }
          continue;
        }

        const questionToSave = {
          role,
          category: record.category.trim(),
          interviewType: record.interviewType.trim(),
          difficulty,
          question: questionText,
          expectedTopics: record.expectedTopics.map((t) => t.trim()),
          keyPoints: Array.isArray(record.keyPoints) ? record.keyPoints.map((k) => k.trim()) : [],
          tags: Array.isArray(record.tags) ? record.tags.map((t) => t.trim()) : [],
          estimatedTime: record.estimatedTime !== undefined ? Number(record.estimatedTime) : 120,
          isActive: record.isActive !== undefined ? Boolean(record.isActive) : true,
        };

        try {
          await Question.create(questionToSave);
          importedCount++;
        } catch (dbErr) {
          logger.error(`Database insertion error for item in ${relativePath}: ${dbErr.message}`);
          failedCount++;
        }
      }
    }
  } catch (error) {
    logger.error(`Unexpected error during seeding: ${error.message}`, error);
  } finally {
    // Gracefully close MongoDB connection
    await mongoose.connection.close();
    logger.info('MongoDB connection closed gracefully.');

    // 4. Print Summary Report
    console.log('\n========================================');
    console.log('       Question Seeding Summary         ');
    console.log('========================================');
    console.log(` Imported : ${importedCount}`);
    console.log(` Updated  : ${updatedCount}`);
    console.log(` Skipped  : ${skippedCount}`);
    console.log(` Failed   : ${failedCount}`);
    console.log('========================================\n');
  }
};

// Execute if run directly via CLI
if (require.main === module) {
  seedQuestions();
}

module.exports = {
  seedQuestions,
  getJsonFilesRecursively,
};
