interface AuthResultBase {
  success: boolean;
  message: string;
  accessToken?: string;
  refreshToken?: string;
}

interface AuthResultWithMnemonic extends AuthResultBase {
  mnemonic: string;
}

export type SendMagicLinkResponse = {
  sendMagicLink: AuthResultBase | AuthResultWithMnemonic;
};

export type VerifyMagicLinkResponse = {
  verifyMagicLink: AuthResultBase | AuthResultWithMnemonic;
};
