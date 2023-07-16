"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prompter = void 0;
var chalk_1 = require("chalk");
var commitizen_1 = require("commitizen");
var word_wrap_1 = __importDefault(require("word-wrap"));
var constant_1 = require("./constant");
var config = commitizen_1.configLoader.load() || {};
var options = {
    types: config.types || constant_1.types,
    defaultType: process.env.CZ_TYPE || config.defaultType,
    defaultScope: process.env.CZ_SCOPE || config.defaultScope,
    defaultSubject: process.env.CZ_SUBJECT || config.defaultSubject,
    defaultBody: process.env.CZ_BODY || config.defaultBody,
    defaultIssues: process.env.CZ_ISSUES || config.defaultIssues,
    disableScopeLowerCase: process.env.DISABLE_SCOPE_LOWERCASE || config.disableScopeLowerCase,
    disableSubjectLowerCase: process.env.DISABLE_SUBJECT_LOWERCASE || config.disableSubjectLowerCase,
    maxHeaderWidth: (process.env.CZ_MAX_HEADER_WIDTH &&
        parseInt(process.env.CZ_MAX_HEADER_WIDTH)) ||
        config.maxHeaderWidth ||
        100,
    maxLineWidth: (process.env.CZ_MAX_LINE_WIDTH &&
        parseInt(process.env.CZ_MAX_LINE_WIDTH)) ||
        config.maxLineWidth ||
        100,
};
var headerLength = function (answers) {
    return (answers.type.length + 2 + (answers.scope ? answers.scope.length + 2 : 0));
};
var maxSummaryLength = function (options, answers) {
    return options.maxHeaderWidth - headerLength(answers);
};
var filterSubject = function (subject, disableSubjectLowerCase) {
    subject = subject.trim();
    if (!disableSubjectLowerCase) {
        subject =
            subject.charAt(0).toLowerCase() + subject.slice(1, subject.length);
    }
    while (subject.endsWith(".")) {
        subject = subject.slice(0, subject.length - 1);
    }
    return subject;
};
var prompter = function (cz, commit) {
    var typeList = Object.keys(options.types);
    var length = typeList.reduce(function (a, c) { return Math.max(a, c.length); }, 0) + 2;
    var choices = typeList.map(function (t) { return ({
        name: options.types[t].emoji +
            " " +
            (t + ":").padEnd(length) +
            " " +
            options.types[t].description,
        value: options.types[t].emoji + " " + t,
    }); });
    cz.prompt([
        {
            type: "list",
            name: "type",
            message: "Select the type of change that you're committing:",
            choices: choices,
            default: options.defaultType,
        },
        {
            type: "input",
            name: "scope",
            message: "What is the scope of this change (e.g. component or file name): (press enter to skip)",
            default: options.defaultScope,
            filter: function (value) {
                return options.disableScopeLowerCase
                    ? value.trim()
                    : value.trim().toLowerCase();
            },
        },
        {
            type: "input",
            name: "subject",
            message: function (answers) {
                return ("Write a short, imperative tense description of the change (max " +
                    maxSummaryLength(options, answers) +
                    " chars):\n");
            },
            default: options.defaultSubject,
            validate: function (subject, answers) {
                var filteredSubject = filterSubject(subject, options.disableSubjectLowerCase);
                return filteredSubject.length === 0
                    ? "subject is required"
                    : filteredSubject.length <= maxSummaryLength(options, answers)
                        ? true
                        : "Subject length must be less than or equal to " +
                            maxSummaryLength(options, answers) +
                            " characters. Current length is " +
                            filteredSubject.length +
                            " characters.";
            },
            transformer: function (subject, answers) {
                var filteredSubject = filterSubject(subject, options.disableSubjectLowerCase);
                var color = filteredSubject.length <= maxSummaryLength(options, answers)
                    ? chalk_1.green
                    : chalk_1.red;
                return color("(" + filteredSubject.length + ") " + subject);
            },
            filter: function (subject) {
                return filterSubject(subject, options.disableSubjectLowerCase);
            },
        },
        {
            type: "input",
            name: "body",
            message: "Provide a longer description of the change: (press enter to skip)\n",
            default: options.defaultBody,
        },
        {
            type: "confirm",
            name: "isBreaking",
            message: "Are there any breaking changes?",
            default: false,
        },
        {
            type: "input",
            name: "breakingBody",
            default: "-",
            message: "A BREAKING CHANGE commit requires a body. Please enter a longer description of the commit itself:\n",
            when: function (answers) {
                return answers.isBreaking && !answers.body;
            },
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            validate: function (breakingBody, _) {
                return (breakingBody.trim().length > 0 ||
                    "Body is required for BREAKING CHANGE");
            },
        },
        {
            type: "input",
            name: "breaking",
            message: "Describe the breaking changes:\n",
            when: function (answers) {
                return answers.isBreaking;
            },
        },
        {
            type: "confirm",
            name: "isIssueAffected",
            message: "Does this change affect any open issues?",
            default: !!options.defaultIssues,
        },
        {
            type: "input",
            name: "issuesBody",
            default: "-",
            message: "If issues are closed, the commit requires a body. Please enter a longer description of the commit itself:\n",
            when: function (answers) {
                return (answers.isIssueAffected && !answers.body && !answers.breakingBody);
            },
        },
        {
            type: "input",
            name: "issues",
            message: 'Add issue references (e.g. "fix #123", "re #123".):\n',
            when: function (answers) {
                return answers.isIssueAffected;
            },
            default: options.defaultIssues ? options.defaultIssues : undefined,
        },
    ]).then(function (answers) {
        var wrapOptions = {
            trim: true,
            cut: false,
            newline: "\n",
            indent: "",
            width: options.maxLineWidth,
        };
        // parentheses are only needed when a scope is present
        var scope = answers.scope ? "(" + answers.scope + ")" : "";
        // Add issue to head
        var headIssue = answers.issues ? " (".concat(answers.issues, ")") : "";
        // Hard limit this line in the validate
        var head = answers.type + scope + ": " + answers.subject + headIssue;
        // Wrap these lines at options.maxLineWidth characters
        var body = answers.body ? (0, word_wrap_1.default)(answers.body, wrapOptions) : false;
        // Apply breaking change prefix, removing it if already present
        var breaking = answers.breaking ? answers.breaking.trim() : "";
        breaking = breaking
            ? "BREAKING CHANGE: " + breaking.replace(/^BREAKING CHANGE: /, "")
            : "";
        breaking = breaking ? (0, word_wrap_1.default)(breaking, wrapOptions) : false;
        var issues = answers.issues ? (0, word_wrap_1.default)(answers.issues, wrapOptions) : false;
        commit([head, body, breaking, issues].filter(function (e) { return e; }).join("\n\n"));
    });
};
exports.prompter = prompter;
