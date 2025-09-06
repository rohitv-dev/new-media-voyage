import { env } from "@/env/server";
import { serverOnly } from "@tanstack/react-start";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { username } from "better-auth/plugins";
import { reactStartCookies } from "better-auth/react-start";
import { db } from "../db";
import { account, session, user, verification } from "../db/schemas/auth";

const getAuthConfig = serverOnly(() =>
	betterAuth({
		baseURL: env.VITE_BASE_URL,
		database: drizzleAdapter(db, {
			provider: "pg",
			schema: {
				user,
				session,
				account,
				verification,
			},
		}),

		// https://www.better-auth.com/docs/integrations/tanstack#usage-tips
		plugins: [username(), reactStartCookies()],

		// https://www.better-auth.com/docs/concepts/session-management#session-caching
		session: {
			cookieCache: {
				enabled: true,
				maxAge: 10 * 60,
			},
		},

		// https://www.better-auth.com/docs/authentication/email-password
		emailAndPassword: {
			enabled: true,
		},
	}),
);

export const auth = getAuthConfig();
