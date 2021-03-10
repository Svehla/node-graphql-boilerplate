export default class BearerParser {
  private static REGEX_BEARER_TOKEN = /^Bearer\s+([A-Za-z0-9\-\._~\+\/]+)=*$/

  /**
   * Returns Bearer token from request header.
   *
   * @param {Object} headers Request headers.
   * @return {string|undefined}
   */
  public static parseBearerToken(headers: { authorization?: string }): string | undefined {
    // Returns undefined if there is no Authorization header.
    if (!headers.authorization) return undefined

    // Find the Bearer token in the Authorization header.
    const found = headers.authorization.match(BearerParser.REGEX_BEARER_TOKEN)

    // Return Bearer token.
    return found ? found[1] : undefined
  }
}
