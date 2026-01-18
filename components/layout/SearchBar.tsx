"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Spinner } from "@/components/ui/Spinner";

export function SearchBar() {
    const router = useRouter();
    const [query, setQuery] = useState("");
    const [debouncedQuery, setDebouncedQuery] = useState("");
    const [isFocused, setIsFocused] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Debounce the query
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(query);
        }, 300);
        return () => clearTimeout(timer);
    }, [query]);

    // Search users
    const users = useQuery(
        api.search.searchUsers,
        debouncedQuery.length >= 2 ? { query: debouncedQuery, limit: 5 } : "skip",
    );

    // Search streams
    const streams = useQuery(
        api.search.searchLive,
        debouncedQuery.length >= 2 ? { query: debouncedQuery, limit: 5 } : "skip",
    );

    const hasResults =
        (users && users.length > 0) || (streams && streams.length > 0);
    const isLoading =
        debouncedQuery.length >= 2 &&
        (users === undefined || streams === undefined);
    const showDropdown = isFocused && debouncedQuery.length >= 2;

    // Close dropdown on outside click
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node) &&
                inputRef.current &&
                !inputRef.current.contains(event.target as Node)
            ) {
                setIsFocused(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSubmit = useCallback(
        (e: React.FormEvent) => {
            e.preventDefault();
            if (query.trim()) {
                router.push(`/search?q=${encodeURIComponent(query.trim())}`);
                setIsFocused(false);
                inputRef.current?.blur();
            }
        },
        [query, router],
    );

    const handleUserClick = useCallback(
        (username: string) => {
            router.push(`/${username}`);
            setQuery("");
            setIsFocused(false);
        },
        [router],
    );

    const handleStreamClick = useCallback(
        (streamId: string) => {
            router.push(`/stream/${streamId}`);
            setQuery("");
            setIsFocused(false);
        },
        [router],
    );

    return (
        <div className="relative w-full max-w-md">
            <form onSubmit={handleSubmit}>
                <div className="relative">
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onFocus={() => setIsFocused(true)}
                        placeholder="Search"
                        className="
              w-full pl-10 pr-4 py-2
              bg-background-secondary border border-border rounded-full
              text-foreground placeholder:text-foreground-secondary
              focus:border-accent focus:ring-2 focus:ring-accent/20 focus:outline-none
              transition-all
            "
                    />
                    <svg
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground-secondary"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                    </svg>
                </div>
            </form>

            {/* Dropdown */}
            {showDropdown && (
                <div
                    ref={dropdownRef}
                    className="
            absolute top-full left-0 right-0 mt-2 z-50
            bg-background border border-border rounded-lg shadow-xl
            max-h-96 overflow-y-auto
          "
                >
                    {isLoading && (
                        <div className="flex items-center justify-center py-4">
                            <Spinner size="sm" />
                        </div>
                    )}

                    {!isLoading && !hasResults && (
                        <div className="px-4 py-6 text-center text-foreground-secondary">
                            No results found for &quot;{debouncedQuery}&quot;
                        </div>
                    )}

                    {/* Users */}
                    {users && users.length > 0 && (
                        <div>
                            <div className="px-4 py-2 text-xs font-semibold text-foreground-secondary uppercase tracking-wide">
                                Channels
                            </div>
                            {users.map((user) => (
                                <button
                                    key={user._id}
                                    onClick={() => handleUserClick(user.username ?? "")}
                                    className="w-full flex items-center gap-3 px-4 py-2 hover:bg-background-secondary transition-colors"
                                >
                                    <Avatar
                                        src={user.avatarUrl}
                                        fallback={user.displayName || user.username}
                                        size="sm"
                                    />
                                    <div className="text-left">
                                        <p className="text-sm font-medium text-foreground">
                                            {user.displayName || user.username}
                                        </p>
                                        <p className="text-xs text-foreground-secondary">
                                            @{user.username}
                                        </p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Live Streams */}
                    {streams && streams.length > 0 && (
                        <div
                            className={
                                users && users.length > 0 ? "border-t border-border" : ""
                            }
                        >
                            <div className="px-4 py-2 text-xs font-semibold text-foreground-secondary uppercase tracking-wide">
                                Live Now
                            </div>
                            {streams.map((stream) => (
                                <button
                                    key={stream._id}
                                    onClick={() => handleStreamClick(stream._id)}
                                    className="w-full flex items-center gap-3 px-4 py-2 hover:bg-background-secondary transition-colors"
                                >
                                    <Avatar
                                        src={stream.streamer?.avatarUrl}
                                        fallback={
                                            stream.streamer?.displayName ||
                                            stream.streamer?.username ||
                                            "?"
                                        }
                                        size="sm"
                                        isLive
                                    />
                                    <div className="flex-1 text-left">
                                        <p className="text-sm font-medium text-foreground truncate">
                                            {stream.title}
                                        </p>
                                        <p className="text-xs text-foreground-secondary">
                                            {stream.streamer?.displayName ||
                                                stream.streamer?.username}
                                        </p>
                                    </div>
                                    <Badge variant="live">Live</Badge>
                                </button>
                            ))}
                        </div>
                    )}

                    {/* View All */}
                    {hasResults && (
                        <button
                            onClick={() =>
                                handleSubmit({ preventDefault: () => { } } as React.FormEvent)
                            }
                            className="w-full px-4 py-3 text-sm text-accent hover:bg-background-secondary border-t border-border transition-colors"
                        >
                            View all results for &quot;{query}&quot;
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
