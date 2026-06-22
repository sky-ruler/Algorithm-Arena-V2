const mongoose = require('mongoose');
const Challenge = require('./src/features/challenges/Challenge.model');
require('dotenv').config();

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB');

    const newChallenge = new Challenge({
      title: 'Merge Sort Array',
      description: '<p>Implement the Merge Sort algorithm to sort an array of integers in ascending order.</p><p><strong>Example 1:</strong></p><pre>Input: 5 2 3 1\nOutput: 1 2 3 5</pre>',
      difficulty: 'Medium',
      points: 150,
      category: 'Sorting',
      tags: ['Merge Sort', 'Divide and Conquer', 'Array'],
      testCases: [
        {
          label: 'Example 1',
          args: [[5, 2, 3, 1]],
          expected: '1 2 3 5'
        },
        {
          label: 'Example 2',
          args: [[5, 1, 1, 2, 0, 0]],
          expected: '0 0 1 1 2 5'
        },
        {
          label: 'Already Sorted',
          args: [[1, 2, 3, 4, 5]],
          expected: '1 2 3 4 5'
        }
      ]
    });

    await newChallenge.save();
    console.log('Challenge added successfully:', newChallenge._id);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seed();
