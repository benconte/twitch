import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export function useAuth() {
    const user = useQuery(api.users.current);

    return {
        userId: user?._id,
        user,
        isLoading: user === undefined,
        isAuthenticated: !!user,
    };
}
