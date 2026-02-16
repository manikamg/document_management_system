import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  loading: false,
  sidebarOpen: true,
  modalOpen: {
    preview: false,
    upload: false,
    confirm: false,
  },
  previewDocument: null,
  notifications: [],
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload;
    },
    openModal: (state, action) => {
      state.modalOpen[action.payload] = true;
    },
    closeModal: (state, action) => {
      state.modalOpen[action.payload] = false;
      if (action.payload === 'preview') {
        state.previewDocument = null;
      }
    },
    setPreviewDocument: (state, action) => {
      state.previewDocument = action.payload;
      state.modalOpen.preview = true;
    },
    addNotification: (state, action) => {
      state.notifications.push({
        id: Date.now(),
        ...action.payload,
      });
    },
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(
        (notification) => notification.id !== action.payload
      );
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
  },
});

export const {
  setLoading,
  toggleSidebar,
  setSidebarOpen,
  openModal,
  closeModal,
  setPreviewDocument,
  addNotification,
  removeNotification,
  clearNotifications,
} = uiSlice.actions;

export default uiSlice.reducer;

