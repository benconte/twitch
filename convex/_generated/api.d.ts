/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as auth from "../auth.js";
import type * as chat from "../chat.js";
import type * as dashboard from "../dashboard.js";
import type * as follows from "../follows.js";
import type * as http from "../http.js";
import type * as livekit from "../livekit.js";
import type * as search from "../search.js";
import type * as streams from "../streams.js";
import type * as users from "../users.js";
import type * as viewers from "../viewers.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  auth: typeof auth;
  chat: typeof chat;
  dashboard: typeof dashboard;
  follows: typeof follows;
  http: typeof http;
  livekit: typeof livekit;
  search: typeof search;
  streams: typeof streams;
  users: typeof users;
  viewers: typeof viewers;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
