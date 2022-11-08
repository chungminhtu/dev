export interface IJwtPayload {
  iss?: string; // issuer
  iat?: string; // issued-at time
  exp?: string; // expiration time
  jti?: string; // Unique Identifier for a one time use token
  sub: string; // subject
  uav?: number; // user auth version
  deviceID?: string; //
}
