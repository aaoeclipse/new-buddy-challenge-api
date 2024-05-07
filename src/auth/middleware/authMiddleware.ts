export const apiMiddleware = async ({
  headers,
  set,
  userToken,
}: {
  headers: Record<string, string | undefined>;
  set: any;
  userToken: any;
}) => {
  const bearer = headers.authorization?.split(" ")[1];
  if (!bearer) {
    set.status = 401;
    set.headers[
      "WWW-Authenticate"
    ] = `Bearer realm='sign', error="invalid_request"`;

    return {
      status: "error",
      message: "Unauthorized",
    };
  }

  const profile = await userToken.verify(bearer);
  if (!profile) {
    set.status = 401;
    set.headers[
      "WWW-Authenticate"
    ] = `Bearer realm='sign', error="invalid_request"`;

    return {
      status: "error",
      message: "Unauthorized",
    };
  }
};
