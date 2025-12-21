/**
 * Android Transcription Test Utilities
 * 
 * Add these functions to browser console during testing to help debug
 */

// Test 1: Check if refs are properly initialized
window.checkTranscriptRefs = () => {
  console.log('=== Transcript Refs Status ===');
  console.log('Recognition active:', !!window.recognitionRef?.current);
  console.log('Recording active:', !!window.isRecordingRef?.current);
  console.log('Final transcript ref:', window.finalTranscriptRef?.current || 'Empty');
  console.log('Interim transcript ref:', window.interimTranscriptRef?.current || 'Empty');
  console.log('Manual stop flag:', window.manualStopRef?.current);
  console.log('===============================');
};

// Test 2: Monitor transcript accumulation
window.startTranscriptMonitoring = () => {
  if (window.transcriptMonitorInterval) {
    clearInterval(window.transcriptMonitorInterval);
  }
  
  let lastLength = 0;
  window.transcriptMonitorInterval = setInterval(() => {
    const currentLength = window.finalTranscriptRef?.current?.length || 0;
    if (currentLength !== lastLength) {
      console.log('📊 Transcript changed:', {
        newLength: currentLength,
        added: currentLength - lastLength,
        preview: window.finalTranscriptRef?.current?.substring(Math.max(0, lastLength - 10), currentLength)
      });
      lastLength = currentLength;
    }
  }, 500);
  
  console.log('✅ Started monitoring transcript changes');
};

window.stopTranscriptMonitoring = () => {
  if (window.transcriptMonitorInterval) {
    clearInterval(window.transcriptMonitorInterval);
    console.log('⏹️ Stopped monitoring transcript changes');
  }
};

// Test 3: Simulate recognition events
window.testRecognitionEvent = (text = 'Test phrase', isFinal = true) => {
  console.log('🧪 Simulating recognition event:', text, 'Final:', isFinal);
  
  if (isFinal) {
    window.finalTranscriptRef.current += text + ' ';
    console.log('Updated final transcript:', window.finalTranscriptRef.current);
  } else {
    window.interimTranscriptRef.current = text;
    console.log('Updated interim transcript:', window.interimTranscriptRef.current);
  }
};

// Test 4: Check restart timing
window.checkRestartTiming = () => {
  const startTime = Date.now();
  let restartCount = 0;
  
  const originalLog = console.log;
  console.log = function(...args) {
    const message = args.join(' ');
    if (message.includes('Speech recognition restarted successfully')) {
      restartCount++;
      const elapsed = Date.now() - startTime;
      console.warn(`🔄 Restart #${restartCount} at ${elapsed}ms (${elapsed/restartCount}ms avg)`);
    }
    originalLog.apply(console, args);
  };
  
  console.warn('✅ Monitoring restart timing (reload page to stop)');
};

// Test 5: Export transcript history
window.exportTranscriptData = () => {
  const data = {
    timestamp: new Date().toISOString(),
    finalTranscript: window.finalTranscriptRef?.current || '',
    interimTranscript: window.interimTranscriptRef?.current || '',
    recognitionActive: !!window.recognitionRef?.current,
    recordingActive: !!window.isRecordingRef?.current,
    userAgent: navigator.userAgent,
    isAndroid: /Android/i.test(navigator.userAgent)
  };
  
  console.log('📋 Transcript Data:', JSON.stringify(data, null, 2));
  
  // Copy to clipboard if available
  if (navigator.clipboard) {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2))
      .then(() => console.log('✅ Copied to clipboard'))
      .catch(err => console.warn('⚠️ Could not copy to clipboard:', err));
  }
  
  return data;
};

// Test 6: Stress test - rapid phrase addition
window.stressTestTranscript = async (phraseCount = 10, delayMs = 1000) => {
  console.log(`🧪 Starting stress test: ${phraseCount} phrases, ${delayMs}ms delay`);
  
  for (let i = 1; i <= phraseCount; i++) {
    const phrase = `Stress test phrase number ${i}`;
    window.finalTranscriptRef.current += phrase + ' ';
    console.log(`✅ Added phrase ${i}/${phraseCount}`);
    
    await new Promise(resolve => setTimeout(resolve, delayMs));
  }
  
  console.log('🏁 Stress test complete');
  console.log('Final transcript length:', window.finalTranscriptRef.current.length);
  console.log('Final transcript:', window.finalTranscriptRef.current);
};

// Test 7: Check for duplicate phrases
window.checkForDuplicates = () => {
  const transcript = window.finalTranscriptRef?.current || '';
  const words = transcript.split(' ').filter(w => w.length > 0);
  
  // Find 3+ word sequences
  const sequences = new Map();
  for (let i = 0; i < words.length - 2; i++) {
    const sequence = words.slice(i, i + 3).join(' ');
    sequences.set(sequence, (sequences.get(sequence) || 0) + 1);
  }
  
  const duplicates = Array.from(sequences.entries())
    .filter(([seq, count]) => count > 1)
    .sort((a, b) => b[1] - a[1]);
  
  if (duplicates.length > 0) {
    console.warn('⚠️ Found duplicate sequences:');
    duplicates.forEach(([seq, count]) => {
      console.warn(`  "${seq}" appears ${count} times`);
    });
  } else {
    console.log('✅ No duplicate sequences found');
  }
  
  return duplicates;
};

// Test 8: Measure recognition latency
window.measureRecognitionLatency = () => {
  window.recognitionLatencies = [];
  
  const originalOnResult = window.recognitionRef?.current?.onresult;
  if (originalOnResult) {
    window.recognitionRef.current.onresult = function(event) {
      const latency = Date.now() - (window.lastSpeechTime || Date.now());
      window.recognitionLatencies.push(latency);
      console.log(`⏱️ Recognition latency: ${latency}ms (avg: ${
        window.recognitionLatencies.reduce((a,b) => a+b, 0) / window.recognitionLatencies.length
      }ms)`);
      window.lastSpeechTime = Date.now();
      originalOnResult.call(this, event);
    };
    console.log('✅ Monitoring recognition latency');
  } else {
    console.warn('⚠️ Recognition not active');
  }
};

// Print help
console.log(`
🧪 Android Transcription Test Utilities Loaded

Available functions:
  checkTranscriptRefs()          - Check current ref values
  startTranscriptMonitoring()    - Monitor transcript changes
  stopTranscriptMonitoring()     - Stop monitoring
  testRecognitionEvent(text)     - Simulate recognition result
  checkRestartTiming()           - Monitor restart frequency
  exportTranscriptData()         - Export current state as JSON
  stressTestTranscript(count)    - Add multiple phrases rapidly
  checkForDuplicates()           - Find duplicate sequences
  measureRecognitionLatency()    - Track recognition speed

Example workflow:
  1. checkTranscriptRefs()
  2. startTranscriptMonitoring()
  3. Start recording and speak
  4. checkForDuplicates()
  5. exportTranscriptData()
`);
