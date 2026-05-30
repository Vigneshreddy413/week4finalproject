import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from '../config/db.js';

// Models
import User from '../models/User.js';
import Course from '../models/Course.js';
import Challenge from '../models/Challenge.js';
import Quiz from '../models/Quiz.js';
import Progress from '../models/Progress.js';
import Submission from '../models/Submission.js';
import Certificate from '../models/Certificate.js';
import Forum from '../models/Forum.js';
import Notification from '../models/Notification.js';

dotenv.config();

// Connect to Database
const connString = process.env.MONGO_URI || 'mongodb://localhost:27017/eduai';

const seedData = async () => {
  try {
    await mongoose.connect(connString);
    console.log('[Seeder] Connected to MongoDB for seeding...');

    // Clear all existing data
    await User.deleteMany();
    await Course.deleteMany();
    await Challenge.deleteMany();
    await Quiz.deleteMany();
    await Progress.deleteMany();
    await Submission.deleteMany();
    await Certificate.deleteMany();
    await Forum.deleteMany();
    await Notification.deleteMany();
    console.log('[Seeder] Database collections cleared.');

    // 1. Create Default Users (Passwords are hashed in pre-save hook)
    const student = await User.create({
      name: 'John Student',
      email: 'student@synapseai.com',
      password: 'password123',
      role: 'student',
      bio: 'An aspiring software developer learning modern web architectures and algorithms.',
      learningStreak: 3,
      codingStreak: 2,
      points: 40,
      badges: [
        {
          title: 'SynapseAI Explorer',
          description: 'Joined the SynapseAI platform and began their coding journey.',
          icon: 'Sparkles',
        }
      ]
    });

    const instructor = await User.create({
      name: 'Dr. Sarah Instructor',
      email: 'instructor@synapseai.com',
      password: 'password123',
      role: 'instructor',
      bio: 'Ex-Google Staff Engineer & Educator with over 10 years of experience teaching fullstack and machine learning systems.',
      instructorStats: {
        revenue: 2990,
        studentCount: 15,
      }
    });

    const admin = await User.create({
      name: 'Alex Admin',
      email: 'admin@synapseai.com',
      password: 'password123',
      role: 'admin',
      bio: 'SynapseAI Platform Principal System Administrator.'
    });

    console.log('[Seeder] Default accounts generated (student@synapseai.com, instructor@synapseai.com, admin@synapseai.com)');

    // 2. Create Coding Challenges
    const challenges = await Challenge.create([
      {
        title: 'Two Sum',
        description: `Given an array of integers \`nums\` and an integer \`target\`, return indices of the two numbers such that they add up to \`target\`.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.

### Examples

**Example 1:**
\`\`\`text
Input: nums = [2,7,11,15], target = 9
Output: [0,1]
Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].
\`\`\`

**Example 2:**
\`\`\`text
Input: nums = [3,2,4], target = 6
Output: [1,2]
\`\`\`

**Example 3:**
\`\`\`text
Input: nums = [3,3], target = 6
Output: [0,1]
\`\`\`
`,
        difficulty: 'Easy',
        category: 'Arrays',
        points: 10,
        constraints: [
          '2 <= nums.length <= 10^4',
          '-10^9 <= nums[i] <= 10^9',
          '-10^9 <= target <= 10^9',
          'Only one valid answer exists.'
        ],
        templates: {
          javascript: `function twoSum(nums, target) {
  // Write your code here
  
}`,
          python: `def twoSum(nums, target):
    # Write your code here
    pass`,
          java: `public class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Write your code here
        return new int[2];
    }
}`,
          cpp: `class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        // Write your code here
        return {};
    }
};`
        },
        testCases: [
          {
            input: '[2,7,11,15]\n9',
            output: '[0,1]',
            isSample: true
          },
          {
            input: '[3,2,4]\n6',
            output: '[1,2]',
            isSample: true
          },
          {
            input: '[3,3]\n6',
            output: '[0,1]',
            isSample: false
          }
        ]
      },
      {
        title: 'Reverse String',
        description: `Write a function that reverses a string. The input string is given as an array of characters \`s\`.

You must do this by modifying the input array in-place with $\\mathcal{O}(1)$ extra memory.

### Examples

**Example 1:**
\`\`\`text
Input: s = ["h","e","l","l","o"]
Output: ["o","l","l","e","h"]
\`\`\`

**Example 2:**
\`\`\`text
Input: s = ["H","a","n","n","a","h"]
Output: ["h","a","n","n","a","H"]
\`\`\`
`,
        difficulty: 'Easy',
        category: 'Strings',
        points: 10,
        constraints: [
          '1 <= s.length <= 10^5',
          's[i] is a printable ascii character.'
        ],
        templates: {
          javascript: `function reverseString(s) {
  // Write your code here
  return s.reverse();
}`,
          python: `def reverseString(s):
    # Write your code here
    s.reverse()
    return s`,
          java: `public class Solution {
    public void reverseString(char[] s) {
        // Write your code here
    }
}`,
          cpp: `class Solution {
public:
    void reverseString(vector<char>& s) {
        // Write your code here
    }
};`
        },
        testCases: [
          {
            input: '["h","e","l","l","o"]',
            output: '["o","l","l","e","h"]',
            isSample: true
          },
          {
            input: '["H","a","n","n","a","h"]',
            output: '["h","a","n","n","a","H"]',
            isSample: false
          }
        ]
      },
      {
        title: 'Binary Search',
        description: `Given an array of integers \`nums\` which is sorted in ascending order, and an integer \`target\`, write a function to search \`target\` in \`nums\`. If \`target\` exists, then return its index. Otherwise, return \`-1\`.

You must write an algorithm with $\\mathcal{O}(\\log n)$ runtime complexity.

### Examples

**Example 1:**
\`\`\`text
Input: nums = [-1,0,3,5,9,12], target = 9
Output: 4
Explanation: 9 exists in nums and its index is 4
\`\`\`

**Example 2:**
\`\`\`text
Input: nums = [-1,0,3,5,9,12], target = 2
Output: -1
Explanation: 2 does not exist in nums so return -1
\`\`\`
`,
        difficulty: 'Easy',
        category: 'Algorithms',
        points: 15,
        constraints: [
          '1 <= nums.length <= 10^4',
          '-10^4 < nums[i], target < 10^4',
          'All the integers in nums are unique.',
          'nums is sorted in ascending order.'
        ],
        templates: {
          javascript: `function search(nums, target) {
  // Write your code here
  
}`,
          python: `def search(nums, target):
    # Write your code here
    pass`,
          java: `public class Solution {
    public int search(int[] nums, int target) {
        return -1;
    }
}`,
          cpp: `class Solution {
public:
    int search(vector<int>& nums, int target) {
        return -1;
    }
};`
        },
        testCases: [
          {
            input: '[-1,0,3,5,9,12]\n9',
            output: '4',
            isSample: true
          },
          {
            input: '[-1,0,3,5,9,12]\n2',
            output: '-1',
            isSample: false
          }
        ]
      }
    ]);

    console.log('[Seeder] Coding challenges created.');

    // 3. Create Sample Course
    const course = await Course.create({
      title: 'Modern React & Component Design System',
      description: 'Master React v19, React Hooks, custom component libraries, state synchronization with Zustand, and micro-interaction animations using Framer Motion. Built for modern front-end developers seeking UI excellence.',
      thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=600&auto=format&fit=crop',
      category: 'Development',
      difficulty: 'Beginner',
      price: 99,
      instructor: instructor._id,
      rating: 4.8,
      reviewsCount: 32,
      modules: [
        {
          title: 'Module 1: The Core Foundation of React',
          description: 'Getting set up with Vite, understanding the virtual DOM, props, and structural layouts.',
          lessons: [
            {
              title: 'Welcome to modern React development',
              description: 'An overview of the course syllabus and introduction to building dynamic responsive user interfaces.',
              type: 'video',
              contentUrl: 'https://res.cloudinary.com/demo/video/upload/c_scale,w_400/dog.mp4',
              duration: 5,
              isFreePreview: true
            },
            {
              title: 'Setting up Vite & Tailwind CSS',
              description: 'Step-by-step instructions to configure clean Tailwind styling inside your new Vite React application.',
              type: 'video',
              contentUrl: 'https://res.cloudinary.com/demo/video/upload/c_scale,w_400/dog.mp4',
              duration: 12
            },
            {
              title: 'React Fundamentals Notes',
              description: 'Reference sheet covering JSX rules, elements, components, and props matching.',
              type: 'pdf',
              contentUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
              duration: 0
            }
          ]
        },
        {
          title: 'Module 2: State Synchronization & Hooks',
          description: 'Deep dive into local state using useState and handling asynchronous side effects in useEffect.',
          lessons: [
            {
              title: 'Managing State with useState',
              description: 'Learn how variables react, trigger re-renders, and update the UI in response to user inputs.',
              type: 'video',
              contentUrl: 'https://res.cloudinary.com/demo/video/upload/c_scale,w_400/dog.mp4',
              duration: 15
            },
            {
              title: 'Handling Side Effects using useEffect',
              description: 'Understanding dependencies, API calling patterns, subscriptions, and component cleanup scopes.',
              type: 'video',
              contentUrl: 'https://res.cloudinary.com/demo/video/upload/c_scale,w_400/dog.mp4',
              duration: 18
            }
          ]
        }
      ]
    });

    console.log('[Seeder] React course created.');

    // 4. Create Quiz for Module 2 of React Course
    const quiz = await Quiz.create({
      title: 'React Hooks & State Validation Quiz',
      course: course._id,
      timeLimit: 5,
      passingPercentage: 66,
      questions: [
        {
          questionText: 'Which React hook is used to handle side-effects like fetching data or setting timers?',
          options: ['useState', 'useMemo', 'useEffect', 'useReducer'],
          correctOption: 2,
          explanation: 'useEffect is specifically built to handle side effects that sync with rendering systems.'
        },
        {
          questionText: 'What type of structure does useState return?',
          options: [
            'An object: { state, set }',
            'An array containing state and its corresponding setter function',
            'A single setter function',
            'A string containing key-value pairs'
          ],
          correctOption: 1,
          explanation: 'useState returns a pair: the current state value and a function to update it in an array.'
        },
        {
          questionText: 'Which of the following is NOT a rule of React Hooks?',
          options: [
            'Only call hooks at the top level',
            'Only call hooks from React function components',
            'Hooks can be called conditionally inside if blocks',
            'Only call hooks from custom hooks'
          ],
          correctOption: 2,
          explanation: 'Hooks must not be called inside loops, conditions, or nested functions to ensure they fire in the same order.'
        }
      ]
    });

    // Link Quiz to the React Course Module 2
    course.modules[1].quiz = quiz._id;
    await course.save();

    console.log('[Seeder] Quiz created and linked to Course Module 2.');

    // 5. Enroll Student in the React Course
    student.enrolledCourses.push(course._id);
    await student.save();

    // Create a student progress entry
    await Progress.create({
      user: student._id,
      course: course._id,
      completedLessons: [course.modules[0].lessons[0]._id.toString()], // seed with 1 completed lesson
      bookmarkedLessons: [],
      lastAccessedLesson: course.modules[0].lessons[0]._id.toString(),
      progressPercentage: 20
    });

    // Increment instructor student count
    instructor.instructorStats.studentCount = 1;
    await instructor.save();

    console.log('[Seeder] Student enrolled and progress initialized.');
    console.log('[Seeder] Database seeding successfully complete!');
    process.exit(0);
  } catch (error) {
    console.error(`[Seeder Error] Seed failed: ${error.message}`);
    process.exit(1);
  }
};

seedData();
