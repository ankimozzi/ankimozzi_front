import { create } from "zustand";

interface LoadingState {
  isLoading: boolean;
  isComplete: boolean;
  message: string;
  startLoading: (message?: string) => void;
  completeLoading: () => void;
  resetLoading: () => void;
}

export const useLoadingStore = create<LoadingState>((set) => ({
  isLoading: false,
  isComplete: false,
  message: "Loading...",

  startLoading: (message = "Loading...") =>
    set({
      isLoading: true,
      isComplete: false,
      message,
    }),

  completeLoading: () => {
    set({ isComplete: true });
    // progress가 100%가 되는 모습을 보여주기 위한 지연
    setTimeout(() => {
      set({ isLoading: false, isComplete: false });
    }, 800);
  },

  resetLoading: () =>
    set({
      isLoading: false,
      isComplete: false,
      message: "Loading...",
    }),
}));
