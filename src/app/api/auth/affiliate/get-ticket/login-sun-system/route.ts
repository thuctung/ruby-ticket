import { SUN_GROUP } from "@/commons/constant";
import { SUN_GET_TOKEN_URL, SUN_SCOPE_TOKEN } from "@/commons/outApiURL";
import { env } from "@/lib/env";
import axios from "axios";
import { NextResponse } from "next/server";

const draftResponseData = {
  token_type: "Bearer",
  not_before: 1691025093,
  expires_in: 3600,
  expires_on: 1691028693,
  resource: "c8163e2e-f64e-4d34-b604-2341607f8935",
  access_token: `eyJhbGciOiJSUzI1NiIsImtpZCI6Ilg1ZVhrNHh5b2pORnVtMWtsMll0djhkbE5QNC1jNTdkTzZRR1RWQn
dhTmsiLCJ0eXAiOiJKV1QifQ.eyJ0ZnAiOiJCMkNfMV9yb3BjIiwiYXpwYWNyIjoiMSIsInN1YiI6ImY4Z
GRkMzA4LTBkNDQtNDVlMC04YWQyLWNlZTEzYmI2YWE4NiIsImF1ZCI6ImM4MTYzZTJlLWY2N
GUtNGQzNC1iNjA0LTIzNDE2MDdmODkzNSIsIm9pZCI6ImY4ZGRkMzA4LTBkNDQtNDVlMC04YW
QyLWNlZTEzYmI2YWE4NiIsInRpZCI6ImMwMTMzYTdhLTQ2OTctNGU3Yy04ZjFjLWY0ZTgzMjJiM
DU3NSIsInZlciI6IjIuMCIsImF6cCI6ImM4MTYzZTJlLWY2NGUtNGQzNC1iNjA0LTIzNDE2MDdmODk
zNSIsImlhdCI6MTY5MTAyNTA5MywiZXhwIjoxNjkxMDI4NjkzLCJpc3MiOiJodHRwczovL3N1bndvcmx
kYjJjZGV2LmIyY2xvZ2luLmNvbS9jMDEzM2E3YS00Njk3LTRlN2MtOGYxYy1mNGU4MzIyYjA1NzU
vdjIuMC8iLCJuYmYiOjE2OTEwMjUwOTN9.rmGr_dYJ4et9_gCRwzvrF277dK
JIYloPanINWRXgIKBCTBrYVoabvihSknWwhJIlHJtZwJO5puD51dVGVf441RZs
GVFESE5MeTXVLpXCIY-Qaj51g3uON1ZzaqE3NUCwtPkgYmIsI7Y4-ZdEBMnnGOArS3dsArqTZ
8Q5Azij-pyWTdpmDTtczhRqTOdAJWQUSPcMD5bYfjHXaC6
z1oLPQLxfMffv5JFngYRy0O1T5M0oVr4ArNxwBVhp6L-
0ekOgoLck21YFFISiZM00uec0mXxPbIziwjhia0eM9LA0lyt2boJ2krV6TsxE0WyN1cLPW5D8sZmaqFi1W
N1KQ`,
};

export async function POST(req: Request) {
  const params = new URLSearchParams();

  params.append("client_id", env.NEXT_PUBLIC_SUN_CLIENT_ID);
  params.append("client_secret", env.NEXT_PUBLIC_SUN_CLIENT_SECRET);
  params.append("grant_type", "client_credentials");
  params.append("scope", SUN_SCOPE_TOKEN);

  const data = await axios
    .post(SUN_GET_TOKEN_URL, params, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    })
    .catch((error) => {
      console.error("Error fetching token:", error.response?.data || error.message);
      return NextResponse.json({ error: "Failed to fetch token" }, { status: 500 });
    });

  return NextResponse.json(draftResponseData, { status: 200 });
}
