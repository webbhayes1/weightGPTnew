/**
 * Test script for meal parsing
 * Run with: npx ts-node src/scripts/testParsing.ts
 */

import { parseMealInput } from '../services/openai/loggingParsing.service';

async function testParsing() {
  console.log('Testing meal parsing...\n');

  // Use a test user ID (doesn't matter for parsing)
  const testUserId = 'test-user-id';

  const testInputs = [
    'protein shake',
    'grilled chicken with rice',
    'chipotle burrito bowl',
    '2 eggs and toast',
  ];

  for (const input of testInputs) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`Input: "${input}"`);
    console.log('='.repeat(60));

    try {
      const result = await parseMealInput(input, testUserId);
      console.log('\nResult:');
      console.log(JSON.stringify(result, null, 2));
    } catch (error) {
      console.error('\nError:', error);
    }
  }
}

testParsing().then(() => {
  console.log('\n\nDone!');
  process.exit(0);
}).catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
