import { prismaClient } from "../../client/db";
import JWTService from "../../services/jwt";
import axios from "axios";

interface GoogleTokenResult {
  iss?: string;
  azp?: string;
  aud?: string;
  sub?: string;
  email?: string;
  email_verified?: string;
  nbf?: string;
  name?: string;
  picture?: string;
  given_name?: string;
  family_name?: string;
  iat?: string;
  exp?: string;
  jti?: string;
  alg?: string;
  kid?: string;
  typ?: string;
}

const queries = {
  verifyGoogleToken: async (parent: any, { token }: { token: any }) => {
    const googleToken = token;
    const googleOauthURL = new URL("https://oauth2.googleapis.com/tokeninfo");
    googleOauthURL.searchParams.set("id_token", googleToken);
    const { data } = await axios.get<GoogleTokenResult>(
      googleOauthURL.toString(),
      {
        responseType: "json"
      }
    );

    const user = await prismaClient.user.findUnique({
      where: { email: data.email }
    });
    if (!user) {
      await prismaClient.user.create({
        data: {
          email: data.email!,
          firstName: data.given_name!,
          lastName: data?.family_name,
          profileIamgeURL: data?.picture
        }
      });
    }
    const userInDB = prismaClient.user.findUnique({
      where: { email: data.email }
    });
    if (!userInDB) throw new Error("user not found");
    const userToken = await JWTService.generateTOkenForUser();
    return userToken;
  }
};

export const resolvers = { queries };
