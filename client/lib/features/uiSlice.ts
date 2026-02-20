import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  cursorVariant: 'default' | 'hover';
  darkMode: boolean;
  isSidebarOpen: boolean;
}

const initialState: UIState = {
  cursorVariant: 'default',
  darkMode: true, // Defaulting to dark mode for modern look
  isSidebarOpen: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setCursorVariant(state, action: PayloadAction<'default' | 'hover'>) {
      state.cursorVariant = action.payload;
    },
    toggleDarkMode(state) {
      state.darkMode = !state.darkMode;
    },
    toggleSidebar(state) {
      state.isSidebarOpen = !state.isSidebarOpen;
    },
  },
});

export const { setCursorVariant, toggleDarkMode, toggleSidebar } = uiSlice.actions;
export default uiSlice.reducer;
