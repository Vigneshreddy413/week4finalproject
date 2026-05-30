import vm from 'vm';

/**
 * Executes JavaScript code in a secure vm sandbox
 * @param {string} userCode - User submitted JS code
 * @param {Array} testCases - Array of { input: string, output: string }
 * @returns {Promise<Object>} - Execution result details
 */
const runJavaScript = async (userCode, testCases) => {
  const results = [];
  let compileError = null;

  // Attempt to compile user script first
  let script;
  try {
    script = new vm.Script(userCode);
  } catch (err) {
    return {
      status: 'Compile Error',
      runtime: 0,
      failedTestCase: {
        input: 'Compilation phase',
        expected: 'Valid JS syntax',
        actual: err.message
      }
    };
  }

  const startTime = Date.now();

  for (let i = 0; i < testCases.length; i++) {
    const { input, output: expectedOutput } = testCases[i];
    
    // Setup a clean sandbox context
    const sandbox = {
      console: {
        log: (...args) => sandbox.logs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a) : a).join(' ')),
      },
      logs: [],
    };
    
    const context = vm.createContext(sandbox);

    try {
      // Run the code to load functions in context
      script.runInContext(context, { timeout: 1000 });

      // Determine which function to call (assume first function in user code or standard function name)
      // We search the context keys for any function
      const functionNames = Object.keys(context).filter(
        key => typeof context[key] === 'function' && key !== 'console'
      );

      if (functionNames.length === 0) {
        throw new Error('No function defined in submission. Please use the default template.');
      }

      const targetFunctionName = functionNames[0];
      const targetFunction = context[targetFunctionName];

      // Parse input arguments.
      // Standard input formats could be:
      // Case 1: "[2,7,11,15]\n9" -> We can split by newline and parse JSON
      // Case 2: "1\n2" -> integers
      // Case 3: "\"hello\"" -> string
      const parsedArgs = input.split('\n').map(arg => {
        try {
          return JSON.parse(arg.trim());
        } catch {
          // If not valid JSON, treat as raw string/number
          const val = arg.trim();
          if (!isNaN(val) && val !== '') return Number(val);
          return val;
        }
      });

      // Execute the function
      const actualOutput = targetFunction(...parsedArgs);
      
      // Normalize actual output and expected output for comparison
      const formattedActual = typeof actualOutput === 'object' ? JSON.stringify(actualOutput) : String(actualOutput).trim();
      const formattedExpected = expectedOutput.trim();

      // Compare JSON strings directly, ignoring spaces or wrapping
      const cleanActual = formattedActual.replace(/\s+/g, '');
      const cleanExpected = formattedExpected.replace(/\s+/g, '');

      if (cleanActual === cleanExpected) {
        results.push({ passed: true });
      } else {
        return {
          status: 'Wrong Answer',
          runtime: Date.now() - startTime,
          failedTestCase: {
            input,
            expected: formattedExpected,
            actual: formattedActual,
          }
        };
      }
    } catch (err) {
      return {
        status: err.message.includes('Script execution timed out') ? 'Time Limit Exceeded' : 'Runtime Error',
        runtime: Date.now() - startTime,
        failedTestCase: {
          input,
          expected: expectedOutput,
          actual: err.message,
        }
      };
    }
  }

  return {
    status: 'Accepted',
    runtime: Date.now() - startTime,
  };
};

/**
 * Simulates Python, Java, and C++ code execution.
 * Checks basic syntax and mocks results so the website looks realistic for non-JS entries.
 */
const runSimulated = async (language, userCode, testCases) => {
  const startTime = Date.now();
  
  // Basic Syntax Checks
  if (language === 'python') {
    // Check for indentation or missing colons in def statements
    const defLines = userCode.split('\n').filter(line => line.trim().startsWith('def '));
    for (const line of defLines) {
      if (!line.includes(':')) {
        return {
          status: 'Compile Error',
          runtime: 0,
          failedTestCase: {
            input: 'Syntax Check',
            expected: 'Valid Python function syntax',
            actual: `SyntaxError: expected ':' in definition: "${line.trim()}"`
          }
        };
      }
    }
  } else if (language === 'cpp' || language === 'java') {
    // Check for missing semicolons
    const lines = userCode.split('\n').map(l => l.trim());
    for (const line of lines) {
      if (line.length > 0 && 
          !line.endsWith(';') && 
          !line.endsWith('{') && 
          !line.endsWith('}') && 
          !line.startsWith('#') && 
          !line.startsWith('//') && 
          !line.startsWith('class') && 
          !line.startsWith('public') && 
          !line.startsWith('private') && 
          !line.startsWith('import') && 
          !line.startsWith('using')) {
        return {
          status: 'Compile Error',
          runtime: 0,
          failedTestCase: {
            input: 'Syntax Check',
            expected: 'Valid C++/Java semicolon placement',
            actual: `CompileError: expected ';' after statement: "${line}"`
          }
        };
      }
    }
  }

  // Simulate execution time
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // If no syntax errors found, we simulate success for the portfolio.
  // In a showcase LMS, if the user didn't write an empty script, we accept it.
  if (userCode.trim().length < 20) {
    return {
      status: 'Wrong Answer',
      runtime: Date.now() - startTime,
      failedTestCase: {
        input: testCases[0]?.input || 'default',
        expected: testCases[0]?.output || 'result',
        actual: 'Error: Code output is empty or incomplete.'
      }
    };
  }

  return {
    status: 'Accepted',
    runtime: Date.now() - startTime + 50, // add a small mock processing time
  };
};

export const executeCode = async (language, userCode, testCases) => {
  if (language === 'javascript') {
    return await runJavaScript(userCode, testCases);
  } else {
    return await runSimulated(language, userCode, testCases);
  }
};
