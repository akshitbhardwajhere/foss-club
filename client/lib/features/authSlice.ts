import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/lib/axios";

interface AuthState {
  user: { id: string; email: string } | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: true, // Init true as layout checks session immediately
  error: null,
};

// Async thunks
export const checkAuth = createAsyncThunk(
  "auth/check",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/api/admin/me");
      return response.data;
    } catch (err: unknown) {
      const error = err as any;
      if (!error.response) {
        return rejectWithValue("Network Error");
      }
      const msg =
        error.response?.data?.message || error.message || "Not authenticated";
      return rejectWithValue(msg);
    }
  },
);

export const loginAdmin = createAsyncThunk(
  "auth/login",
  async (
    credentials: { email: string; password: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await api.post("/api/admin/login", credentials);
      return response.data;
    } catch (err: unknown) {
      const error = err as any;
      if (!error.response) {
        return rejectWithValue("Network Error");
      }
      const msg =
        error.response?.data?.message || error.message || "Login failed";
      return rejectWithValue(msg);
    }
  },
);

export const logoutAdmin = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await api.post("/api/admin/logout");
      return true;
    } catch (err: unknown) {
      const error = err as any;
      if (!error.response) {
        return rejectWithValue("Network Error");
      }
      const msg =
        error.response?.data?.message || error.message || "Logout failed";
      return rejectWithValue(msg);
    }
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Check Auth
    builder.addCase(checkAuth.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(checkAuth.fulfilled, (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload;
    });
    builder.addCase(checkAuth.rejected, (state) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = null;
    });

    // Login
    builder.addCase(loginAdmin.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(loginAdmin.fulfilled, (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload;
    });
    builder.addCase(loginAdmin.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Logout
    builder.addCase(logoutAdmin.fulfilled, (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.error = null;
    });
  },
});

export default authSlice.reducer;
