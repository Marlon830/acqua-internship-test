# Acqua Internship Technical Test

## Here's writeup about how I solved the tasks

### Task 0: Setup and read the codebase

I started by cloning the repository and running the application. After using the application a little bit, I went through the codebase to understand the structure of the application.

### Task 1: Implement Persistent State Management

For this task, I started to look up on the suggested library, [Zustand](https://docs.pmnd.rs/zustand/getting-started/introduction). I followed the documentation and implemented the state management in the application. I created a store file in the `src` directory and initialized the store with the initial state of the application. I then created a custom hook to access the store in the components.

I updated the drag and drop hooks to use values from the store, I then updated the stored values with a `useEffect` hook that will be called when a value from the drag and drop hooks is changed.

By doing this, I came to realize that Zustand loads the stored values from the local storage after a process that we call hydration. So the values used in the drag and drop hooks are not the ones used in the local store at the start of the application. I looked up the documentation and found that I can know when the hydration is finished by using the `onRehydrateStorage`. I created another store to store the state of the hydration and used it to know when the hydration is finished (I couldn't do it in the same store because the TodoStore is persisted in the local storage).

With this, I was able to implement the persistent state management in the application.
