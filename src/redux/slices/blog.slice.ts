import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

export interface Comment {
  id: string;
  content: string;
  author: {
    name: string;
    avatar: string;
    initials: string;
  };
  timestamp: string;
  likes: number;
  isLiked: boolean;
  replies: Comment[];
  parentId?: string;
}

export interface Report {
  id: number;
  title: string;
  author: string;
  category: string;
  readTime: string;
  date: string;
  views: number;
  echoes: number;
  image: string;
  excerpt: string;
  isEchoed?: boolean;
  isBookmarked?: boolean;
  comments: Comment[];
  commentsCount: number;
}

export interface Notification {
  id: number;
  message: string;
  type: "success" | "error" | "warning" | "info";
  timestamp?: number;
}

export type ScreenType =
  | "welcome"
  | "fields"
  | "loading"
  | "dashboard"
  | "report-detail"
  | "error"; // Added error screen type

export type RoleType =
  | "researcher"
  | "enthusiast"
  | "learner"
  | "reviewer"
  | "student"
  | "writer";

export type ThemeType = "light" | "dark";

export interface ReportState {
  // UI States
  currentScreen: ScreenType;
  sidebarOpen: boolean;
  notifications: Notification[];
  theme: ThemeType;
  showComments: boolean;
  replyingToComment: string | null;

  // Onboarding States
  selectedRole: RoleType;
  selectedFields: string[];
  isOnboardingCompleted: boolean;
  progress: number;
  onboardingError: string | null; // Added for error handling
  fieldValidationErrors: string[]; // Added for field validation errors

  // Report States
  reports: Report[];
  featuredReport: Report | null;
  selectedReport: Report | null;
  searchTerm: string;
  selectedCategory: string;
  loading: boolean;
  error: string | null;
}

// Utility function for ObjectId validation
const isValidObjectId = (id: string): boolean => {
  return /^[0-9a-fA-F]{24}$/.test(id);
};

// Async thunks for API calls
export const fetchReports = createAsyncThunk(
  "report/fetchReports",
  async ({
    category,
    searchTerm,
  }: {
    category: string;
    searchTerm: string;
  }): Promise<Report[]> => {
    // API call simulation
    const response = await fetch(
      `/api/reports?category=${category}&search=${searchTerm}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch reports");
    }
    return response.json();
  }
);

const initialState: ReportState = {
  // UI States
  currentScreen: "welcome",
  sidebarOpen: false,
  notifications: [],
  theme: "light",
  showComments: false,
  replyingToComment: null,

  // Onboarding States
  selectedRole: "researcher",
  selectedFields: [],
  isOnboardingCompleted: false,
  progress: 0,
  onboardingError: null, // Initialize error state
  fieldValidationErrors: [], // Initialize validation errors

  // Report States
  reports: [],
  featuredReport: null,
  selectedReport: null,
  searchTerm: "",
  selectedCategory: "all",
  loading: false,
  error: null,
};

const blogSlice = createSlice({
  name: "blog",
  initialState,
  reducers: {
    // UI Actions
    setCurrentScreen: (state, action: PayloadAction<ScreenType>) => {
      state.currentScreen = action.payload;
      // Clear onboarding errors when navigating away from error screen
      if (action.payload !== "error") {
        state.onboardingError = null;
      }
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    addNotification: (
      state,
      action: PayloadAction<Omit<Notification, "id">>
    ) => {
      state.notifications.push({
        id: Date.now(),
        timestamp: Date.now(),
        ...action.payload,
      });
    },
    removeNotification: (state, action: PayloadAction<number>) => {
      state.notifications = state.notifications.filter(
        (n) => n.id !== action.payload
      );
    },
    toggleComments: (state) => {
      state.showComments = !state.showComments;
    },
    setReplyingToComment: (state, action: PayloadAction<string | null>) => {
      state.replyingToComment = action.payload;
    },

    // Onboarding Actions
    setSelectedRole: (state, action: PayloadAction<RoleType>) => {
      state.selectedRole = action.payload;
      // Clear errors when user makes progress
      state.onboardingError = null;
      state.fieldValidationErrors = [];
    },

    toggleField: (state, action: PayloadAction<string>) => {
      const fieldId = action.payload;

      // Validate field ID format
      if (!/^[0-9a-fA-F]{24}$/.test(fieldId)) {
        return state;
      }

      const index = state.selectedFields.indexOf(fieldId);
      if (index === -1) {
        state.selectedFields.push(fieldId);
      } else {
        state.selectedFields.splice(index, 1);
      }
    },

    setProgress: (state, action: PayloadAction<number>) => {
      state.progress = Math.min(Math.max(action.payload, 0), 100);
    },

    completeOnboarding: (state) => {
      state.isOnboardingCompleted = true;
      state.currentScreen = "dashboard";
      state.onboardingError = null;
      state.fieldValidationErrors = [];
    },

    // Error Handling Actions
    setOnboardingError: (state, action: PayloadAction<string>) => {
      state.onboardingError = action.payload;
      state.currentScreen = "error";
    },

    clearOnboardingError: (state) => {
      state.onboardingError = null;
      state.fieldValidationErrors = [];
    },

    addFieldValidationError: (state, action: PayloadAction<string>) => {
      if (!state.fieldValidationErrors.includes(action.payload)) {
        state.fieldValidationErrors.push(action.payload);
      }
    },

    clearFieldValidationErrors: (state) => {
      state.fieldValidationErrors = [];
    },

    // Helper action to clear selected fields (useful for debugging/reset)
    clearSelectedFields: (state) => {
      state.selectedFields = [];
      state.fieldValidationErrors = [];
    },

    // Helper action to reset onboarding state
    resetOnboardingState: (state) => {
      state.selectedRole = "researcher";
      state.selectedFields = [];
      state.isOnboardingCompleted = false;
      state.progress = 0;
      state.onboardingError = null;
      state.fieldValidationErrors = [];
      state.currentScreen = "welcome";
    },

    // Report Actions
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },
    setSelectedCategory: (state, action: PayloadAction<string>) => {
      state.selectedCategory = action.payload;
    },
    setSelectedReport: (state, action: PayloadAction<Report | null>) => {
      state.selectedReport = action.payload;
    },
    clearSelectedReport: (state) => {
      state.selectedReport = null;
    },
    setReports: (state, action: PayloadAction<Report[]>) => {
      state.reports = action.payload;
    },

    // Interactive Actions
    toggleEcho: (state, action: PayloadAction<number>) => {
      const reportId = action.payload;
      if (state.selectedReport?.id === reportId) {
        state.selectedReport.isEchoed = !state.selectedReport.isEchoed;
        state.selectedReport.echoes += state.selectedReport.isEchoed ? 1 : -1;
      }
      const report = state.reports.find((r) => r.id === reportId);
      if (report) {
        report.isEchoed = !report.isEchoed;
        report.echoes += report.isEchoed ? 1 : -1;
      }
    },

    toggleBookmark: (state, action: PayloadAction<number>) => {
      const reportId = action.payload;
      if (state.selectedReport?.id === reportId) {
        state.selectedReport.isBookmarked = !state.selectedReport.isBookmarked;
      }
      const report = state.reports.find((r) => r.id === reportId);
      if (report) {
        report.isBookmarked = !report.isBookmarked;
      }
    },

    addComment: (
      state,
      action: PayloadAction<{
        reportId: number;
        comment: Omit<
          Comment,
          "id" | "timestamp" | "likes" | "isLiked" | "replies"
        >;
      }>
    ) => {
      const { reportId, comment } = action.payload;
      const newComment: Comment = {
        ...comment,
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        likes: 0,
        isLiked: false,
        replies: [],
      };

      if (state.selectedReport?.id === reportId) {
        if (comment.parentId) {
          const parentComment = findCommentById(
            state.selectedReport.comments,
            comment.parentId
          );
          if (parentComment) {
            parentComment.replies.push(newComment);
          }
        } else {
          state.selectedReport.comments.push(newComment);
        }
        state.selectedReport.commentsCount += 1;
      }
    },

    toggleCommentLike: (
      state,
      action: PayloadAction<{ reportId: number; commentId: string }>
    ) => {
      const { reportId, commentId } = action.payload;
      if (state.selectedReport?.id === reportId) {
        const comment = findCommentById(
          state.selectedReport.comments,
          commentId
        );
        if (comment) {
          comment.isLiked = !comment.isLiked;
          comment.likes += comment.isLiked ? 1 : -1;
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchReports.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchReports.fulfilled,
        (state, action: PayloadAction<Report[]>) => {
          state.loading = false;
          state.reports = action.payload;
        }
      )
      .addCase(fetchReports.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch reports";
      });
  },
});

// Helper function to find comment by ID in nested structure
function findCommentById(comments: Comment[], id: string): Comment | null {
  for (const comment of comments) {
    if (comment.id === id) {
      return comment;
    }
    const found = findCommentById(comment.replies, id);
    if (found) {
      return found;
    }
  }
  return null;
}

export const {
  // UI Actions
  setCurrentScreen,
  toggleSidebar,
  addNotification,
  removeNotification,
  toggleComments,
  setReplyingToComment,

  // Onboarding Actions
  setSelectedRole,
  toggleField,
  setProgress,
  completeOnboarding,

  // Error Handling Actions
  setOnboardingError,
  clearOnboardingError,
  addFieldValidationError,
  clearFieldValidationErrors,
  clearSelectedFields,
  resetOnboardingState,

  // Report Actions
  setSearchTerm,
  setSelectedCategory,
  setSelectedReport,
  clearSelectedReport,
  setReports,

  // Interactive Actions
  toggleEcho,
  toggleBookmark,
  addComment,
  toggleCommentLike,
} = blogSlice.actions;

export default blogSlice.reducer;
