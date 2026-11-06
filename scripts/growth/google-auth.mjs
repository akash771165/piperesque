/**
 * Real Google Service Account OAuth 2.0 Authenticator
 * 
 * Implements RFC 7523 JWT Bearer Token exchange using native Node.js crypto.
 * Requires ZERO external dependencies.
 * 
 * Works with Google Cloud Service Account credentials:
 * - GSC_CLIENT_EMAIL / GA4 Service Account email
 * - GSC_PRIVATE_KEY / PEM formatted RSA private key
 */

import crypto from "node:crypto";

export class GoogleAuthService {
  constructor(options = {}) {
    this.clientEmail = options.clientEmail || process.env.GSC_CLIENT_EMAIL;
    this.privateKey = options.privateKey || process.env.GSC_PRIVATE_KEY;
    this.cachedTokens = new Map(); // scope -> { token, expiresAt }
  }

  isConfigured() {
    return Boolean(this.clientEmail && this.privateKey);
  }

  /**
   * Normalizes private key by repairing escaped newlines (common in env vars)
   */
  getNormalizedPrivateKey() {
    if (!this.privateKey) return null;
    let key = this.privateKey.trim();
    if (key.includes("\\n")) {
      key = key.replace(/\\n/g, "\n");
    }
    return key;
  }

  /**
   * Obtains a valid Google OAuth2 Bearer Access Token for the requested scope
   */
  async getAccessToken(scope) {
    if (!this.isConfigured()) {
      throw new Error("Google Service Account credentials not configured (missing GSC_CLIENT_EMAIL or GSC_PRIVATE_KEY).");
    }

    // Check token cache (with 2-minute safety window)
    const cached = this.cachedTokens.get(scope);
    if (cached && cached.expiresAt > Date.now() + 120000) {
      return cached.token;
    }

    const normalizedKey = this.getNormalizedPrivateKey();
    const now = Math.floor(Date.now() / 1000);
    const exp = now + 3600; // 1 hour validity

    // 1. JWT Header
    const header = {
      alg: "RS256",
      typ: "JWT"
    };

    // 2. JWT Claims Set
    const claims = {
      iss: this.clientEmail,
      scope,
      aud: "https://oauth2.googleapis.com/token",
      exp,
      iat: now
    };

    const encodedHeader = Buffer.from(JSON.stringify(header)).toString("base64url");
    const encodedClaims = Buffer.from(JSON.stringify(claims)).toString("base64url");
    const signInput = `${encodedHeader}.${encodedClaims}`;

    // 3. RSA-SHA256 Signature
    let signature;
    try {
      const signer = crypto.createSign("RSA-SHA256");
      signer.update(signInput);
      signer.end();
      signature = signer.sign(normalizedKey, "base64url");
    } catch (err) {
      throw new Error(`Failed to sign Google JWT assertion: ${err.message}. Verify that GSC_PRIVATE_KEY is a valid RSA private key.`);
    }

    const assertion = `${signInput}.${signature}`;

    // 4. Token Exchange Request
    const response = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: new URLSearchParams({
        grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
        assertion
      }).toString()
    });

    if (!response.ok) {
      const errorText = await response.text();
      let parsed;
      try { parsed = JSON.parse(errorText); } catch { parsed = { error: errorText }; }
      throw new Error(`Google OAuth token exchange failed (HTTP ${response.status}): ${parsed.error_description || parsed.error || errorText}`);
    }

    const data = await response.json();
    const accessToken = data.access_token;
    const expiresIn = data.expires_in || 3600;

    this.cachedTokens.set(scope, {
      token: accessToken,
      expiresAt: Date.now() + (expiresIn * 1000)
    });

    return accessToken;
  }
}
