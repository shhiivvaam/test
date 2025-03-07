import { createAsyncThunk } from "@reduxjs/toolkit";
import { doc, getDoc, updateDoc } from "firebase/firestore";

import { db } from "../../firebase/firebase";

export const isUserOnboardingCompleted = createAsyncThunk(
  "tasks/is-user-onboarding",
  async (uid: string, { rejectWithValue }) => {
    try {
      const docRef = doc(db, `customers/${uid}`);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        return data.isOnboardingCompleted ?? false; // Return the field or default to `false`
      } else {
        throw new Error("User document does not exist.");
      }
    } catch (error) {
      console.error("Error fetching onboarding status:", error);
        return rejectWithValue(error || "Failed to fetch onboarding status.");
    }
  }
);

export const isUserFirstTimeCompleted = createAsyncThunk(
  "tasks/is-user-first-time",
  async (uid: string, { rejectWithValue }) => {
    try {
      const docRef = doc(db, `customers/${uid}`);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        return data.isUserFirstTime || false; // Return the field or default to `false`
      } else {
        throw new Error("User document does not exist.");
      }
    } catch (error) {
        return rejectWithValue(error || "Failed to fetch onboarding status.");
    }
  }
);

export const completeTutorial = createAsyncThunk(
  "customer/completeTutorial",
  async (uid: string, { rejectWithValue }) => {
    try {
      // Firestore reference for the specific user
      const userDocRef = doc(db, "customers", uid);

      // Update the isUserFirstTime field to true
      await updateDoc(userDocRef, {
        isUserFirstTime: true,
      });

      // Return success message
      return { uid, message: "Onboarding marked as completed" };
    } catch (error) {
      // Handle errors and return a rejected value
      console.error("Error completing onboarding:", error);
      return rejectWithValue("Failed to complete onboarding");
    }
  }
);
