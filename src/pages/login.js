import * as setCookie from "set-cookie-parser";
import {
  AppwriteEndpoint,
  SsrHostname,
  AppwriteHostname,
  AppwriteProject,
} from "./AppwriteService.js";

export async function post({ cookies }) {
  try {
    const response = await fetch(
      `${AppwriteEndpoint}/account/sessions/anonymous`,
      {
        method: "POST",
        headers: {
          "x-appwrite-project": AppwriteProject,
        },
      }
    );

    const json = await response.json();

    if (json.code >= 400) {
      return {
        status: 400,
        body: JSON.stringify({ message: json.message }),
      };
    }

    const ssrHostname =
      SsrHostname === "localhost" ? SsrHostname : "." + SsrHostname;
    const appwriteHostname =
      AppwriteHostname === "localhost"
        ? AppwriteHostname
        : "." + AppwriteHostname;

    const cookiesStr = (response.headers.get("set-cookie") ?? "")
      .split(appwriteHostname)
      .join(ssrHostname);

    const cookiesArray = setCookie.splitCookiesString(cookiesStr);
    const cookiesParsed = cookiesArray.map((cookie) =>
      setCookie.parseString(cookie)
    );

    for (const cookie of cookiesParsed) {
      console.log(cookie.name);
      cookies.set(cookie.name, cookie.value, {
        domain: cookie.domain,
        secure: cookie.secure,
        sameSite: cookie.sameSite,
        path: cookie.path,
        maxAge: cookie.maxAge,
        httpOnly: cookie.httpOnly,
        expires: cookie.expires,
      });
    }

    return {
      body: JSON.stringify(json),
    };
  } catch (err) {
    return {
      status: 400,
      body: JSON.stringify({ message: err.message }),
    };
  }
}
