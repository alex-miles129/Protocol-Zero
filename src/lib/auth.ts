import { NextAuthOptions } from "next-auth"
import DiscordProvider from "next-auth/providers/discord"

const DISCORD_SERVER_ID = process.env.DISCORD_SERVER_ID as string;

export const authOptions: NextAuthOptions = {
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID as string,
      clientSecret: process.env.DISCORD_CLIENT_SECRET as string,
      authorization: { params: { scope: 'identify email guilds guilds.join' } },
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account) {
        token.accessToken = account.access_token
        if (profile) {
          token.id = profile.id
          token.image = `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png`
        }
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.image = token.image as string
        session.user.accessToken = token.accessToken as string
      }
      return session
    }
  },
} 