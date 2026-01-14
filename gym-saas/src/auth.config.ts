import type { NextAuthConfig } from "next-auth";

export const authConfig = {
    pages: {
        signIn: "/login",
        error: "/login",
    },
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.email = user.email!;
                token.name = user.name!;
                token.role = user.role;
                token.tenantId = user.tenantId;
                token.tenantSlug = user.tenantSlug;
            }
            return token;
        },
        async session({ session, token }) {
            if (token && session.user) {
                session.user.id = token.id;
                session.user.email = token.email!;
                session.user.name = token.name!;
                session.user.role = token.role;
                session.user.tenantId = token.tenantId;
                session.user.tenantSlug = token.tenantSlug;
            }
            return session;
        },
    },
    providers: [], // Configured in auth.ts
} satisfies NextAuthConfig;
