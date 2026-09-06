// Runtime smoke test: drives the built CommonJS adapter with a fake prompter
// and checks the commit message it hands back. Catches dependency upgrades
// that break at require/run time rather than at compile time.
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import path from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(import.meta.url);

function loadAdapter() {
  const built = path.join(repoRoot, "build", "index.js");
  try {
    return require(built);
  } catch (error) {
    if (error.code === "MODULE_NOT_FOUND") {
      assert.fail(`${built} is missing - run \`npm run build\` first`);
    }
    throw error;
  }
}

// Answers the real inquirer would collect, plus the questions it was asked.
function runPrompter(answers) {
  const { prompter } = loadAdapter();
  let asked;
  return new Promise((resolve) => {
    prompter(
      {
        prompt(questions) {
          asked = questions;
          // inquirer runs each question's `filter` over the raw answer
          const filtered = { ...answers };
          for (const question of questions) {
            if (question.filter && question.name in filtered) {
              filtered[question.name] = question.filter(
                filtered[question.name],
                filtered
              );
            }
          }
          return Promise.resolve(filtered);
        },
      },
      (message) => resolve({ message, asked })
    );
  });
}

test("adapter loads and builds a conventional commit message", async () => {
  const { message, asked } = await runPrompter({
    type: "✨ feat",
    scope: "parser",
    subject: "Add emoji support.",
    body: "",
    isBreaking: false,
    isIssueAffected: false,
  });

  assert.equal(message, "✨ feat(parser): add emoji support");
  assert.ok(asked.length > 0, "expected the adapter to ask questions");
});

test("type choices carry an emoji and a description", async () => {
  const { asked } = await runPrompter({
    type: "🐛 fix",
    scope: "",
    subject: "x",
    isBreaking: false,
    isIssueAffected: false,
  });

  const typeQuestion = asked.find((q) => q.name === "type");
  assert.ok(typeQuestion, "expected a `type` question");
  assert.ok(typeQuestion.choices.length >= 7, "expected the built-in types");
  for (const choice of typeQuestion.choices) {
    // "<emoji> <type>" - an undefined emoji would stringify into the value
    assert.doesNotMatch(choice.value, /undefined/, `bad choice value: ${choice.value}`);
    assert.match(choice.name, /\S+\s+\w+:\s+\S/, `bad choice label: ${choice.name}`);
  }
});

test("body, breaking change and issues are wrapped into the message", async () => {
  const { message } = await runPrompter({
    type: "🐛 fix",
    scope: "",
    subject: "handle empty input",
    body: "The parser threw on empty input.",
    isBreaking: true,
    breaking: "parse() now returns null instead of throwing",
    isIssueAffected: true,
    issues: "#42",
  });

  assert.equal(
    message,
    [
      "🐛 fix: handle empty input (#42)",
      "The parser threw on empty input.",
      "BREAKING CHANGE: parse() now returns null instead of throwing",
      "#42",
    ].join("\n\n")
  );
});
