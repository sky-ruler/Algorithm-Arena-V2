// Compiles and runs generated drivers with local toolchains, exactly the way
// Judge0 does (java Main / gcc / g++ / python3 / node). Exits 1 on any failure.
// Usage: node shared/lib/verify-drivers.mjs
import { wrapWithDriver, isDrivableSignature } from "./leetcodeDriver.js";
import { execSync, spawnSync } from "child_process";
import { mkdtempSync, writeFileSync, rmSync, mkdirSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";

const has = (bin) => {
  try { execSync(`command -v ${bin}`, { stdio: "ignore" }); return true; }
  catch { return false; }
};

const SOLUTIONS = {
  twoSum: {
    functionName: "twoSum",
    params: [{ name: "nums", type: "integer[]" }, { name: "target", type: "integer" }],
    returnType: "integer[]",
    stdin: '[2,7,11,15]\n9\n',
    expected: [0, 1],
    code: {
      javascript: `var twoSum = function(nums, target) {
  for (let i = 0; i < nums.length; i++)
    for (let j = i + 1; j < nums.length; j++)
      if (nums[i] + nums[j] === target) return [i, j];
  return [];
};`,
      python: `class Solution:
    def twoSum(self, nums, target):
        for i in range(len(nums)):
            for j in range(i + 1, len(nums)):
                if nums[i] + nums[j] == target:
                    return [i, j]
        return []`,
      java: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        for (int i = 0; i < nums.length; i++)
            for (int j = i + 1; j < nums.length; j++)
                if (nums[i] + nums[j] == target) return new int[]{i, j};
        return new int[]{};
    }
}`,
      cpp: `class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        for (int i = 0; i < (int)nums.size(); i++)
            for (int j = i + 1; j < (int)nums.size(); j++)
                if (nums[i] + nums[j] == target) return {i, j};
        return {};
    }
};`,
    },
  },
  moveZeroes: {
    functionName: "moveZeroes",
    params: [{ name: "nums", type: "integer[]" }],
    returnType: "void",
    stdin: '[0,1,0,3,12]\n',
    expected: [1, 3, 12, 0, 0],
    code: {
      javascript: `var moveZeroes = function(nums) {
  let left = 0;
  for (let right = 0; right < nums.length; right++) {
    if (nums[right] !== 0) { [nums[left], nums[right]] = [nums[right], nums[left]]; left++; }
  }
};`,
      python: `class Solution:
    def moveZeroes(self, nums):
        left = 0
        for right in range(len(nums)):
            if nums[right] != 0:
                nums[left], nums[right] = nums[right], nums[left]
                left += 1`,
      java: `class Solution {
    public void moveZeroes(int[] nums) {
        int left = 0;
        for (int right = 0; right < nums.length; right++) {
            if (nums[right] != 0) {
                int t = nums[right]; nums[right] = nums[left]; nums[left] = t; left++;
            }
        }
    }
}`,
      cpp: `class Solution {
public:
    void moveZeroes(vector<int>& nums) {
        int left = 0;
        for (int right = 0; right < (int)nums.size(); right++)
            if (nums[right] != 0) swap(nums[left++], nums[right]);
    }
};`,
    },
  },
};

// Task 2 appends C solutions/cases here.
const CASES = [];
for (const [name, s] of Object.entries(SOLUTIONS)) {
  for (const [language, code] of Object.entries(s.code)) {
    CASES.push({ name: `${name}/${language}`, language, code,
      functionName: s.functionName, params: s.params, returnType: s.returnType,
      stdin: s.stdin, expected: s.expected });
  }
}

const GATE_CHECKS = [
  // [description, actual, expectedBool]
  ["java twoSum drivable", isDrivableSignature("java", SOLUTIONS.twoSum.params, "integer[]"), true],
  ["java void drivable", isDrivableSignature("java", SOLUTIONS.moveZeroes.params, "void"), true],
  ["cpp depth-2 drivable", isDrivableSignature("cpp", [{ type: "list<list<integer>>" }], "integer"), true],
  ["unknown lang not drivable", isDrivableSignature("ruby", SOLUTIONS.twoSum.params, "integer[]"), false],
];

const dir = mkdtempSync(join(tmpdir(), "driver-verify-"));
let failures = 0;
const fail = (msg) => { failures++; console.error(`  FAIL ${msg}`); };

for (const [desc, actual, expected] of GATE_CHECKS) {
  if (actual !== expected) fail(`${desc}: expected ${expected}, got ${actual}`);
  else console.log(`  ok   ${desc}`);
}

const PORTABLE_CPP_HEADERS =
  "#include <vector>\n#include <string>\n#include <iostream>\n#include <sstream>\n#include <stdexcept>\n#include <cctype>\n#include <algorithm>\n";

const runCase = (c, idx) => {
  const src = wrapWithDriver(c.code, c.language, c.functionName, c.params, c.returnType);
  let cmd;
  if (c.language === "javascript") {
    const f = join(dir, `case${idx}.js`); writeFileSync(f, src); cmd = ["node", [f]];
  } else if (c.language === "python") {
    const f = join(dir, `case${idx}.py`); writeFileSync(f, src); cmd = ["python3", [f]];
  } else if (c.language === "java") {
    if (!has("javac")) { console.log(`  skip ${c.name} (no javac)`); return; }
    const d = join(dir, `case${idx}`); mkdirSync(d);
    writeFileSync(join(d, "Main.java"), src);
    execSync(`javac Main.java`, { cwd: d });
    cmd = ["java", ["-cp", d, "Main"]];
  } else if (c.language === "cpp") {
    if (!has("g++")) { console.log(`  skip ${c.name} (no g++)`); return; }
    // macOS clang lacks bits/stdc++.h; swap it for portable headers (test-only).
    const portable = src.replace("#include <bits/stdc++.h>", PORTABLE_CPP_HEADERS);
    const f = join(dir, `case${idx}.cpp`); const bin = join(dir, `case${idx}_cpp`);
    writeFileSync(f, portable);
    execSync(`g++ -std=c++17 -o ${bin} ${f}`);
    cmd = [bin, []];
  } else if (c.language === "c") {
    if (!has("gcc")) { console.log(`  skip ${c.name} (no gcc)`); return; }
    const f = join(dir, `case${idx}.c`); const bin = join(dir, `case${idx}_c`);
    writeFileSync(f, src);
    execSync(`gcc -std=gnu11 -o ${bin} ${f}`);
    cmd = [bin, []];
  } else {
    fail(`${c.name}: unknown language`); return;
  }
  const res = spawnSync(cmd[0], cmd[1], { input: c.stdin, encoding: "utf-8", timeout: 15000 });
  if (res.status !== 0) { fail(`${c.name}: exit ${res.status}\n${res.stderr}`); return; }
  let parsed;
  try { parsed = JSON.parse(res.stdout.trim()); }
  catch { fail(`${c.name}: non-JSON stdout: ${JSON.stringify(res.stdout)}`); return; }
  if (JSON.stringify(parsed) !== JSON.stringify(c.expected)) {
    fail(`${c.name}: expected ${JSON.stringify(c.expected)}, got ${JSON.stringify(parsed)}`);
  } else {
    console.log(`  ok   ${c.name}`);
  }
};

try {
  CASES.forEach((c, i) => {
    try { runCase(c, i); }
    catch (e) { fail(`${c.name}: ${e.message}`); } // compile errors count as case failures
  });
} finally {
  rmSync(dir, { recursive: true, force: true });
}
console.log(failures === 0 ? "\nALL PASS" : `\n${failures} FAILURE(S)`);
process.exit(failures === 0 ? 0 : 1);
