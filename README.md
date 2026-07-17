# GraphQL Network Issues - Chrome DevTools Extension

A Google Chrome extension for analyzing and monitoring GraphQL network requests in Chrome's developer tools (F12).

## 🎯 Features

- Detailed analysis of GraphQL requests
- Real-time network traffic monitoring
- Native integration with Chrome DevTools
- Clear visualization of queries, mutations, and fragments

## 🔧 Requirements

- Google Chrome v140 or higher
- (Compatibility with other browsers: NOT planned at this time)

## 📋 Usage and Support

### Report Bugs

If you encounter an issue or unexpected behavior:

1. Open a [new issue](../../issues/new?template=bug_report.md)
2. Provide as much detail as possible
3. Include steps to reproduce the problem

### Request Features

Have an idea to improve the extension?

1. Open a [new issue](../../issues/new?template=feature_request.md)
2. Describe the desired functionality and its use case
3. Include examples if possible

## 🤝 Contributing

Please read [CONTRIBUTING.md](./CONTRIBUTING.md) before contributing.

## Local development

To be able to test all features, a server & client will be executed in order to use debugger from the client. You can access it from the link that appears on terminal:

```sh
pnpm i
pnpm -r --include-workspace-root run dev
```

You will need to install chrome extension locally, using the compiled extension (./dist folder) in order to visualize changes while debugging. Remember to disable the chrome extension if installed.
