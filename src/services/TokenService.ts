import Cookies from 'js-cookie';

export class TokenService {
  private static readonly ACCESS_TOKEN_KEY = 'accessToken';
  private static readonly REFRESH_TOKEN_KEY = 'refreshToken';

  static setTokens(tokens: { accessToken: string; refreshToken: string }): void {
    Cookies.set(this.ACCESS_TOKEN_KEY, tokens.accessToken, {
      expires: undefined, // TODO: Set expiration
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
    Cookies.set(this.REFRESH_TOKEN_KEY, tokens.refreshToken, {
      expires: undefined, // TODO: Set expiration
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
  }

  static getAccessToken(): string | undefined {
    return Cookies.get(this.ACCESS_TOKEN_KEY);
  }

  static getRefreshToken(): string | undefined {
    return Cookies.get(this.REFRESH_TOKEN_KEY);
  }

  static clearTokens(): void {
    Cookies.remove(this.ACCESS_TOKEN_KEY, { path: '/', domain: window.location.hostname });
    Cookies.remove(this.REFRESH_TOKEN_KEY, { path: '/', domain: window.location.hostname });
  }
}
