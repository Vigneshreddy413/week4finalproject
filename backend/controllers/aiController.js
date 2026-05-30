import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Gemini API
const apiKey = process.env.GEMINI_API_KEY;
let genAI = null;
if (apiKey) {
  genAI = new GoogleGenerativeAI(apiKey);
} else {
  console.warn('[AI Service] WARNING: GEMINI_API_KEY not found in environment. Running in Simulator Mock Mode.');
}

/**
 * Helper to run Gemini model query or fallback to simulated mock response
 */
const runAiQuery = async (systemInstruction, prompt, fallbackResponse) => {
  if (genAI) {
    try {
      const model = genAI.getGenerativeModel({ 
        model: 'gemini-1.5-flash',
        systemInstruction: systemInstruction
      });
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      return text;
    } catch (err) {
      console.error('[AI Service] Error calling Gemini:', err.message);
      // Fallback to simulated response if API fails
    }
  }
  
  // Simulated delay for realistic UX
  await new Promise(resolve => setTimeout(resolve, 800));
  return fallbackResponse;
};

/**
 * @desc    Answer coding doubts & explain concepts (AI Doubt Assistant)
 * @route   POST /api/ai/doubt
 * @access  Private
 */
export const doubtAssistant = async (req, res, next) => {
  try {
    const { question, code, language } = req.body;

    const systemInstruction = "You are EduAI, an expert full-stack coding assistant. Help the student resolve their syntax questions, explain compiler errors, outline structural concepts, and provide small, well-commented code snippets. Return output in standard markdown.";
    
    let prompt = `User Question: "${question}"\n`;
    if (code) {
      prompt += `Language: ${language || 'unknown'}\nCode Snippet:\n\`\`\`${language || ''}\n${code}\n\`\`\``;
    }

    const fallbackResponse = `### EduAI Doubt Assistant (Simulated)

It looks like you're asking about **${question}**${code ? ` in **${language}**` : ''}. 

Here is an overview to help you:
1. **Key Concept**: Understanding this requires looking at variable scopes, syntax rules, and asynchronous behavior.
2. **Step-by-Step Explanation**:
   - Ensure the required namespaces, imports, or modules are imported correctly.
   - Look for common syntax oversights like unbalanced curly brackets or commas.
   - Print state updates to the terminal to trace data flow.

${code ? `
Here is a corrected structure for your code:
\`\`\`${language}
// Suggested revision
${code.includes('function') ? '// Make sure the arguments match the signature\n' + code : '// Standard syntax implementation\n' + code}
\`\`\`
` : ''}

*Note: Configure a \`GEMINI_API_KEY\` in the backend \`.env\` file to unlock real-time Gemini-powered conversational logic.*`;

    const responseText = await runAiQuery(systemInstruction, prompt, fallbackResponse);
    res.json({ success: true, answer: responseText });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Review editor code for bugs and optimization (AI Coding Mentor)
 * @route   POST /api/ai/mentor
 * @access  Private
 */
export const codeMentor = async (req, res, next) => {
  try {
    const { code, language, problemTitle } = req.body;

    const systemInstruction = "You are the EduAI Code Mentor. Analyze the student's code submission for the specified challenge. Provide detailed feedback containing: 1. Code Review (structure, logic), 2. Potential Bugs, 3. Performance Optimizations (Time/Space complexities), and 4. Best Practices. Format output with beautiful Markdown headings.";
    
    const prompt = `Challenge: "${problemTitle || 'General Code Evaluation'}"\nLanguage: ${language}\nUser Code:\n\`\`\`${language}\n${code}\n\`\`\``;

    const fallbackResponse = `### EduAI Code Mentor Review (Simulated)

Here is a quick evaluation of your **${language}** submission for **${problemTitle || 'General Code'}**:

#### 💡 1. Code Review
- **Logical Flow**: The overall logic is straightforward and readable. Variable namings are clear.
- **Completeness**: Basic base cases appear to be handled.

#### 🐛 2. Bug Detection
- **Edge Cases**: Double check boundary conditions (e.g. empty arrays, null values, negative integers).
- **Type Coercion**: Ensure values match the expected types throughout function execution.

#### ⚡ 3. Performance & Complexity
- **Time Complexity**: $\\mathcal{O}(N)$ or similar linear scan is ideal.
- **Space Complexity**: $\\mathcal{O}(1)$ auxiliary memory since we edit values in-place.

#### 🌟 4. Best Practices
- Refactor repeated operations into modular helper functions.
- Add comments explaining non-trivial logic blocks.

*Note: Set your \`GEMINI_API_KEY\` to receive dynamic, custom code critiques from Gemini.*`;

    const responseText = await runAiQuery(systemInstruction, prompt, fallbackResponse);
    res.json({ success: true, feedback: responseText });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Generate a random themed quiz (AI Quiz Generator)
 * @route   POST /api/ai/quiz-generate
 * @access  Private (Instructor/Admin)
 */
export const quizGenerator = async (req, res, next) => {
  try {
    const { topic, questionCount = 3 } = req.body;

    const systemInstruction = "You are a professional EdTech quiz builder. Create multiple choice questions on the provided topic. Return ONLY a valid JSON array of objects. Do NOT wrap in markdown code blocks (\`\`\`json).";
    const prompt = `Generate a JSON array of exactly ${questionCount} multiple-choice questions on "${topic}". 
Each question must have:
- "questionText" (string)
- "options" (array of 4 strings)
- "correctOption" (number: 0, 1, 2, or 3 representing the index)
- "explanation" (string explaining why it is correct)

Example structure:
[
  {
    "questionText": "What does CSS stand for?",
    "options": ["Computer Style Sheets", "Cascading Style Sheets", "Creative Style Sheets", "Colorful Style Sheets"],
    "correctOption": 1,
    "explanation": "CSS stands for Cascading Style Sheets."
  }
]`;

    const fallbackResponse = `[
      {
        "questionText": "Which hook in React is used to perform side effects?",
        "options": ["useState", "useEffect", "useContext", "useReducer"],
        "correctOption": 1,
        "explanation": "useEffect lets you perform side effects in function components, such as data fetching or subscriptions."
      },
      {
        "questionText": "What is the correct way to pass state down from a parent to a child component?",
        "options": ["Using hooks", "Using props", "Using localStorage", "Using state modifiers"],
        "correctOption": 1,
        "explanation": "Props are the standard way in React to pass configuration data down from parent components to children."
      },
      {
        "questionText": "What does JSX stand for in React?",
        "options": ["JavaScript Syntax Extension", "JavaScript XML", "Java Standard Extension", "JSON XML Syntax"],
        "correctOption": 1,
        "explanation": "JSX stands for JavaScript XML. It is a syntax extension to JavaScript which allows writing HTML elements in React."
      }
    ]`;

    let responseText = await runAiQuery(systemInstruction, prompt, fallbackResponse);

    // Clean markdown code blocks from response if present
    responseText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();

    let parsedQuestions;
    try {
      parsedQuestions = JSON.parse(responseText);
    } catch (e) {
      console.warn('[AI Service] Failed to parse generated quiz JSON. Falling back to default list.', e.message);
      parsedQuestions = JSON.parse(fallbackResponse);
    }

    res.json({ success: true, questions: parsedQuestions });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Generate personalized learning recommendations
 * @route   GET /api/ai/recommendations
 * @access  Private
 */
export const learningRecommender = async (req, res, next) => {
  try {
    const user = req.user; // populated by protect middleware
    
    const systemInstruction = "You are the EduAI Learning Recommender. Analyze the student profile and list 3 specific learning milestones, study schedules, or course paths. Return the results in Markdown format.";
    const prompt = `Student: "${user.name}"
Enrolled Course Count: ${user.enrolledCourses?.length || 0}
Completed Course Count: ${user.completedCourses?.length || 0}
Challenges Solved: ${user.solvedChallenges?.length || 0}
Current Learning Streak: ${user.learningStreak || 0} days
Current Coding Streak: ${user.codingStreak || 0} days`;

    const fallbackResponse = `### 🚀 Personalized Study Plan for ${user.name}

Based on your progress, our learning algorithms recommend the following paths:

1. **🏆 Expand your Algorithm Skills**:
   - Try solving a **Medium** difficulty coding challenge under the **Arrays & Strings** category to boost your coding rank.
   - Recommended Challenge: *Binary Search Tree validation*.

2. **📘 Core Tech Stack Milestone**:
   - Complete your enrolled courses. Focus on finishing the next chapter in your course stack. 
   - Dedicate 20 minutes today to maintain your **${user.learningStreak || 0}-day** learning streak!

3. **💡 Project Architecture**:
   - Put your knowledge to the test! Try building a mini API using Node/Express or creating a stateful user interface in React.`;

    const responseText = await runAiQuery(systemInstruction, prompt, fallbackResponse);
    res.json({ success: true, recommendations: responseText });
  } catch (error) {
    next(error);
  }
};
