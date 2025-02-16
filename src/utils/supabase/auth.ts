import supabase from "@/utils/supabase/supabase";

import { create } from "zustand";
import { User } from "@supabase/supabase-js";

export interface UserAuth {
    user: User | null;
    setUser: (user: User | null) => void;
    fetchUser: () => Promise<void>;
    signOut: () => Promise<void>;
}

export const useAuth = create<UserAuth>((set) => ({
    user: null,

    setUser: (user) => set({ user }),

    fetchUser: async () => {
        const user = await fetchUser();
        if (user) {
            set({ user });
        } else {
            signOutUser();
        }
    },

    signOut: async () => {
        const result = await signOutUser();
        set({ user: null });
    },
}));

async function fetchUser(): Promise<User | null> {
    const { data, error } = await supabase.auth.getUser();
    return data.user ? data.user : null;
}

async function signOutUser(): Promise<void> {
    const { error } = await supabase.auth.signOut();
    if (error) {
        console.error(error);
    }
}
