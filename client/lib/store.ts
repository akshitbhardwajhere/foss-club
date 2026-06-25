import { configureStore } from "@reduxjs/toolkit";
// Import auth slice managing administrator log-in state/tokens
import authReducer from "./features/authSlice";
// Import UI slice managing sidebar toggles and loading indicators
import uiReducer from "./features/uiSlice";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

/**
 * Global Redux Store Configuration
 * 
 * Orchestrates application-wide client-side states such as authentication statuses
 * and structural UI layout flags (drawers, dialogs).
 */
export const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Custom typed wrappers for useDispatch and useSelector hooks.
// Always use these instead of plain React-Redux hooks to maintain clean TypeScript types.
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
