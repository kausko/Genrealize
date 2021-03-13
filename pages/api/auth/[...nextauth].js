import NextAuth from 'next-auth'
import Providers from "next-auth/providers"

export default NextAuth({
    providers: [
        Providers.Email({
            server: process.env.EMAIL_SERVER,
            from: process.env.EMAIL_FROM
        }),
        Providers.Google(
            process.env.NODE_ENV.toLowerCase() === "production" ?
            {
                clientId: process.env.GOOGLE_PROD_ID,
                clientSecret: process.env.GOOGLE_PROD_SECRET
            }
            :
            {
                clientId: process.env.GOOGLE_DEV_ID,
                clientSecret: process.env.GOOGLE_DEV_SECRET
            }
        )
    ],
    database: process.env.DATABASE_URL,
    secret: process.env.SECRET
})