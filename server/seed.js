const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']); // Force Google DNS for Mobile Hotspot

const mongoose = require('mongoose');
const Challenge = require('./src/models/Challenge'); // Added /src/
require('dotenv').config();

const seedChallenges = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    // Clear existing challenges so we don't have duplicates
    await Challenge.deleteMany({});

    const items = [
      { 
        title: "The Fibonacci Sequence", 
        description: "Write a function that returns the n-th Fibonacci number. Optimize for O(n) time complexity.", 
        difficulty: "Easy", 
        points: 50 
      },
      { 
        title: "Graph Traversal (BFS)", 
        description: "Given an adjacency list, find the shortest path between two nodes using Breadth-First Search.", 
        difficulty: "Medium", 
        points: 150 
      },
      { 
        title: "Sudoku Solver", 
        description: "Implement a backtracking algorithm that solves any 9x9 Sudoku board.", 
        difficulty: "Hard", 
        points: 300 
      }
    ];

    await Challenge.insertMany(items);
    console.log("Arena Seeded! ⚔️");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedChallenges();