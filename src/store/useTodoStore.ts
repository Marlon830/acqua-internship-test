import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface StoreState {
  storedTodo: string[];
  storedDone: string[];
  setStoredTodo: (items: string[]) => void;
  setStoredDone: (items: string[]) => void;
}

interface LoadingState {
  loading: boolean;
  setLoadingToFalse: (loading: boolean) => void;
}

const TODO_ITEMS = [
  'AI Fish or Phish',
  'Compile Coral DB',
  'AI Sub Navigation',
  'Server Water Cooling',
  'Whale Song AI',
  'Marine Chatbot',
];

const DONE_ITEMS = ['Dolphin Comm Sim'];

// Create a store with Zustand to know when the items are loaded
// Can't do it in the TodoStore because else it persist and the loading will never be true
export const useLoadingTodoItemsStore = create<LoadingState>()((set) => ({
  loading: true,
  setLoadingToFalse: (loading: boolean) => set({ loading: loading }),
}));

export const useTodoStore = create<StoreState>()(
  persist(
    (set) => ({
      storedTodo: TODO_ITEMS,
      storedDone: DONE_ITEMS,
      setStoredTodo: (items) => set({ storedTodo: items }),
      setStoredDone: (items) => set({ storedDone: items }),
    }),
    {
      name: 'acqua-board-todo-storage',
      storage: createJSONStorage(() => localStorage),
      // When the storage is rehydrated, we set the loading to false because the items are loaded
      onRehydrateStorage: () => {
        useLoadingTodoItemsStore.getState().setLoadingToFalse(false);

        return (state, error) => {
          if (error) {
            console.log('an error ocurred during hydration', error);
          }
        };
      },
    },
  ),
);
