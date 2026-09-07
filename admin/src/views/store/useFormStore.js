// store/branchFormStore.js
import { create } from "zustand";

export const useFormStore = create((set) => ({
  formData: null,  // will store branch row or empty for add
  setFormData: (data) => set({ formData: data }),
  clearFormData: () => set({ formData: null }),
}));
