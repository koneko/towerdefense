# How to build for production

1. Clone the repository

```
git clone https://github.com/koneko/towerdefense.git
```

2. Ensure you have atleast Node v23.3.0

```
node -v
```

3. Install dependencies.

```
npm install
```

4. Run the build script

```
npm run build
```

This will create a `dist` folder in the root of the project, you can statically serve those files or play the latest build of main [here](https://bastion.overflow.fun).

5. (DEVELOPMENT) You are now ready to start editing the files, run:

```
npm run dev
```

to start the development server which uses Vite and offers hot reloading alongside in-browser error logging.
