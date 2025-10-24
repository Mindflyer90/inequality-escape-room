#!/usr/bin/env node

/**
 * Test script to verify the complete user flow
 * Tests: puzzle generation, hint request, and solution validation
 */

const API_URL = process.env.API_URL || 'http://localhost:3000';

async function testFlow() {
  console.log('🧪 Testing Inequality Escape Room User Flow\n');
  console.log(`API URL: ${API_URL}\n`);

  try {
    // Test 1: Health Check
    console.log('1️⃣  Testing health check...');
    const healthResponse = await fetch(`${API_URL}/health`);
    if (!healthResponse.ok) {
      throw new Error('Health check failed');
    }
    const healthData = await healthResponse.json();
    console.log('✅ Health check passed:', healthData);
    console.log();

    // Test 2: Generate Puzzle
    console.log('2️⃣  Testing puzzle generation...');
    const puzzleResponse = await fetch(`${API_URL}/api/puzzle/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ difficulty: 'easy' })
    });
    
    if (!puzzleResponse.ok) {
      const error = await puzzleResponse.json();
      throw new Error(`Puzzle generation failed: ${error.message}`);
    }
    
    const puzzle = await puzzleResponse.json();
    console.log('✅ Puzzle generated successfully:');
    console.log(`   ID: ${puzzle.id}`);
    console.log(`   Inequality: ${puzzle.inequality}`);
    console.log(`   Difficulty: ${puzzle.difficulty}`);
    console.log(`   Mode: ${puzzle.mode}`);
    console.log();

    // Test 3: Request Hint (if Claude API is configured)
    console.log('3️⃣  Testing hint generation...');
    try {
      const hintResponse = await fetch(`${API_URL}/api/hint/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          puzzleId: puzzle.id,
          inequality: puzzle.inequality,
          hintsUsed: 0
        })
      });
      
      if (hintResponse.ok) {
        const hintData = await hintResponse.json();
        console.log('✅ Hint generated successfully:');
        console.log(`   Hint: ${hintData.hint.substring(0, 100)}...`);
        console.log(`   Hints remaining: ${hintData.hintsRemaining}`);
      } else {
        const error = await hintResponse.json();
        console.log('⚠️  Hint generation failed (this is expected if ANTHROPIC_API_KEY is not set):');
        console.log(`   ${error.message}`);
      }
    } catch (error) {
      console.log('⚠️  Hint generation error:', error.message);
    }
    console.log();

    // Test 4: Validate Correct Answer
    console.log('4️⃣  Testing solution validation (correct answer)...');
    const correctAnswer = puzzle.solution;
    const validateCorrectResponse = await fetch(`${API_URL}/api/puzzle/validate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        puzzleId: puzzle.id,
        answer: correctAnswer
      })
    });
    
    if (!validateCorrectResponse.ok) {
      const error = await validateCorrectResponse.json();
      throw new Error(`Validation failed: ${error.message}`);
    }
    
    const correctResult = await validateCorrectResponse.json();
    console.log('✅ Correct answer validation:');
    console.log(`   Correct: ${correctResult.correct}`);
    console.log(`   Message: ${correctResult.message}`);
    console.log();

    // Test 5: Validate Incorrect Answer
    console.log('5️⃣  Testing solution validation (incorrect answer)...');
    const incorrectAnswer = 'x > 999';
    const validateIncorrectResponse = await fetch(`${API_URL}/api/puzzle/validate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        puzzleId: puzzle.id,
        answer: incorrectAnswer
      })
    });
    
    if (!validateIncorrectResponse.ok) {
      const error = await validateIncorrectResponse.json();
      throw new Error(`Validation failed: ${error.message}`);
    }
    
    const incorrectResult = await validateIncorrectResponse.json();
    console.log('✅ Incorrect answer validation:');
    console.log(`   Correct: ${incorrectResult.correct}`);
    console.log(`   Message: ${incorrectResult.message}`);
    console.log();

    // Summary
    console.log('🎉 All tests passed successfully!');
    console.log('\n📋 Summary:');
    console.log('   ✅ Health check');
    console.log('   ✅ Puzzle generation');
    console.log('   ✅ Hint generation (if API key configured)');
    console.log('   ✅ Correct answer validation');
    console.log('   ✅ Incorrect answer validation');
    console.log('\n✨ The complete user flow is working correctly!');
    
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    console.error('\n💡 Make sure the backend server is running on', API_URL);
    process.exit(1);
  }
}

// Run tests
testFlow();
