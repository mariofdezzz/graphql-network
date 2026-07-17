# Contributing Guide

Thank you for your interest in contributing! Please follow this guide to report issues and submit contributions.

## 📖 Before You Start

- Read the [README.md](./README.md) to understand the project
- Check [existing issues](../../issues) to avoid duplicates
- This extension focuses on **Google Chrome only** at this time

## 🐛 Reporting Bugs

### Requirements for an effective bug report

1. **Clear title**: Describe the problem in one sentence
2. **Steps to reproduce**: Detailed step-by-step instructions
3. **Expected behavior**: What should happen
4. **Actual behavior**: What actually happens
5. **Chrome version**: Specify your version
6. **Screenshots or videos**: If relevant
7. **Additional details**: System information, logs, etc.

### Example

```
Title: GraphQL queries not showing in inspector

Steps to reproduce:
1. Install the extension
2. Open DevTools (F12)
3. Navigate to a website with GraphQL requests
4. Go to the extension tab

Expected: See a list of GraphQL requests

Actual: Empty tab with no data

Chrome version: 126.0.6478.115
```

## ✨ Requesting Features

Please provide:

1. **Clear description**: Explain the desired functionality
2. **Use case**: Why you need it
3. **Examples**: Include examples if possible
4. **Alternatives considered**: What other solutions have you tried

### Example

```
Title: Add filter by operation type (Query/Mutation)

Description:
Ability to filter displayed GraphQL requests by operation type

Use case:
When there are many requests, it's difficult to quickly locate
all queries or all mutations

Examples:
- Filter: "Queries only" → shows only query operations
- Filter: "Mutations only" → shows state changes
```

## 📝 Labels

Issues are categorized with labels:

- **bug**: Something isn't working correctly
- **enhancement**: An improvement or new feature
- **good first issue**: Good for new contributors
- **help wanted**: Community help is wanted
- **discussion**: Topic for discussion
- **wontfix**: Will not be implemented
- **duplicate**: Duplicate of another issue

## ✅ Checklist before reporting

- [ ] I've searched for similar existing issues
- [ ] My title is descriptive
- [ ] I included clear steps to reproduce (if it's a bug)
- [ ] My browser is Google Chrome
- [ ] I provided sufficient context

## 🚀 Next Steps

1. Create the issue (bug or feature)
2. The team will review your report
3. An appropriate label will be assigned
4. Details will be discussed if necessary
5. Implementation will follow based on priority

---

Thank you for helping improve GraphQL Network Issues! 🎉
