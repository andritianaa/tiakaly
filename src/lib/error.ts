export const errors = {
  /** The client is not signed as a user */
  user_001: {
    code: "user_001",
    description: "The client is not signed as a user",
  },

  /** Invalid authentication token */
  user_002: { code: "user_002", description: "Invalid authentication token" },

  /** User account is suspended */
  user_003: { code: "user_003", description: "User account is suspended" },
} as const;

// Type qui extrait les clés de `errors` pour l'auto-complétion
type ASErrorCode = keyof typeof errors;

// Type d'une erreur
type ASError = (typeof errors)[ASErrorCode];
