# Contributing

Here are a couple of instructions/guidelines for contributing to the project.

## Getting started

First you must have the following installed.

- [NodeJS](https://nodejs.org/en/download/)
- [Git](https://git-scm.com/downloads)

After installing the above prerequisites. Clone the repository locally.

```
git clone https://github.com/uoa-compsci399-s2-2022/spatial-skills-web-app.git
```

Then install the necessary dependencies.

```
cd spatial-skills-web-app
npm install
npm run init
```

To run the project.

```
npm run dev
```

If you have issues with running the backend, contact [Damon Greenhalgh](https://github.com/DamonGreenhalgh) for the `.env` information.

## Git Workflow / Conventions

Bellow is an illustration of the workflow this project uses.

![Git workflow diagram displaying the use of a develop branch with feature branches.](/.github/git-workflow.png)

> Reference: https://rovitpm.com/5-git-workflows-to-improve-development/ 

- **MASTER(or MAIN)**: For product release, hotfix and general documentation.
- **DEVELOP**: This branch will contain multiple features for a new product release.
- **FEATURE**: This is where you will develop the feature.

New features will be developed within their own feature branch. For example, suppose you wanted to work on a new navbar component. First, you would create a new branch.

```
git checkout -b [feature name]
```

> Example feature names: navbar-component, user-authentication, spatial-memory-component

While working on the feature you may want to commit the current state.

```
git commit -m "[message name]"
```

> Example message names: "Add navbar component", "Fix navbar styling", "Add responsiveness to navbar at smaller resolutions"

**Note**: For commit messages it is good to follow these guidelines,
- Do not use a period to end messages.
- Use active voice, for example "Add navbar component" instead of "Added navbar component".
- Think of a commit message as a pitch to the team.

When you have completed the feature open up a pull request for review.
