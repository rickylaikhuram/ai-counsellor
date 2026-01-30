import { Profile } from "@/app/generated/prisma/client";

export interface ProfileFormProps {
  profile: Profile;
}

export interface BaseProps {
  profile: Profile;
  errors: Record<string, string[]>;
}