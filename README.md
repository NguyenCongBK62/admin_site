# EComeTrue Frontend

This is using [Create React App](https://github.com/facebook/create-react-app).

## Dependencies

1. `Node version v14.16.0`
2. `npm version 6.14.11`
3. `yarn version 1.22.10`

## Editor

We are using `vs-code` editor for development.

## Dev Dependencies

The development environment is using `eslint` for linting purposes. `Prettier` for formatting purposes. The root path for import is set to `/src` so that it can be an absolute import. We are also using `yarn` as default package manager.

`vs-code` is setup to format on save. The eslint should also be available without any additional configuration.

## Local env setup

1. Install Dependencies using `$ yarn` (First run this before trying other steps.)
2. To run the project `$ yarn start`
3. To lint and get errors `$ yarn lint`
4. To lint and fix the error `$ yarn lint-fix`
5. To format the `src` directory `$ yarn format`
6. To run tests `$ yarn tests`

## .env files

We have 4 `.env` files. Remember not to push any secrets here. It is only used for common env variables that can be public. i.e. **The backend domain**.

1. `.env` this will be available everywhere.
2. `.env.development` this will be only available for development build.
3. `.env.staging` this will only available for staging build.
4. `.env.production` this will be only available for production build.

## Scripts details

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build:development`

Builds the app for production to the `build` folder.\
It is going to use the variables available inside `.env.development`. It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn build:staging`

Builds the app for production to the `build` folder.\
It is going to use the variables available inside `.env.staging`. It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn build:production`

Builds the app for production to the `build` folder.\
It is going to use the variables available inside `.env.production`. It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### For release versioning and cache control use the following commands

- `npm version patch` — for releases with only bug fixes
- `npm version minor` — for releases with new features w/ or w/o bug fixes
- `npm version major` — for major releases or breaking features

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Deployment

We are using `AWS codepipeline` to implement `ci/cd`. We currently have 3 environment setup. `development`, `staging`, `production`.

To release something to **`development`** we marge the code to **`development`** branch of our git control system.

To release something to **`staging`** we marge the code to **`staging`** branch of our git control system.

To release something to **`production`** we first marge the code to **`staging`** branch. After that a manual approval process is initiated. If it is approved that starts a release to the production server.
