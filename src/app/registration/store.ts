import { RegistrationSchema } from "@/features/registration/schema";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type RegistrationState = Partial<RegistrationSchema> & {
  setData: (data: Partial<RegistrationSchema>) => void;
};

export const useRegistrationStore = create<RegistrationState>()(
  persist(
    (set) => ({
      setData: (data) => set(data),
    }),
    {
      name: "registration-data",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
