// src/tests/claude-test.js
import { analyzeJournalEntry } from '../services/claudeService';

const testClaudeIntegration = async () => {
  // Test image (you'll need to provide a real base64 image)
  const testImage = 'your_base64_image_string';
  
  const testCases = [
    {
      dayNumber: 1,
      prompt: "Share a story that encapsulates who you are. What experiences, values, or passions define you?",
      expectedThemes: ["identity", "values", "experiences"]
    },
    {
      dayNumber: 2,
      prompt: "List your top five personal values and describe why each is important to you.",
      expectedThemes: ["values", "principles", "priorities"]
    }
    // Add more test cases as needed
  ];

  for (const test of testCases) {
    console.log(`Testing Day ${test.dayNumber}...`);
    
    try {
      const result = await analyzeJournalEntry(testImage, test.dayNumber, test.prompt);
      
      if (result.success) {
        console.log('✅ Analysis successful');
        console.log('Analysis results:', result.analysis);
      } else {
        console.log('❌ Analysis failed:', result.error);
      }
    } catch (error) {
      console.error('❌ Test failed:', error);
    }
    
    console.log('-------------------');
  }
};

// Run the test
testClaudeIntegration();