# Archidekt Shared Components

A simple React UI component library for sharing components across projects

# Install

```
npm install @mikedrewitt/archidekt-shared-components
```

```
yarn add @mikedrewitt/archidekt-shared-components
```

# Developing library components

We're using [Storybook](https://storybook.js.org/docs/react/get-started/install) to act as a development/ example environment for the components. This way we can develop them in this project without needing to interact with other projects first. Storybook runs webpack under the hood, so it should act as if you are developing in a more tradition react environment.

```
npm run dev
```

# Publishing library

Publishing the library will push it live for the latest version of whatever is in the `package.json`. If you run this, be careful be aware of the NPM [dependancy version rules](https://docs.npmjs.com/cli/v7/configuring-npm/package-json#dependencies) as you could end up breaking projets using these components. If you have breaking changes, you **must upgrade a major version**.

In order to push a new build, be on the branch/ commit you want to push, and run the below command to create the build.

```
npm run rollup
```

Assuming that works, you can then run

```
npm publish
```

To create the published version of the library
