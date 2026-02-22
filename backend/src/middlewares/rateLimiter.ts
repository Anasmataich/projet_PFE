// rateLimiter.ts - middleware de limitation de débit (stub)

import rateLimit from 'express-rate-limit';
import env from '../config/env';
import { HttpStatus } from '../shared/enums';

// ─────────────────────────────────────────────
// Rate Limiters
// ─────────────────────────────────────────────

/**
 * Limiter global pour toutes les routes API
 */
export const globalRateLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Trop de requêtes. Veuillez réessayer dans quelques minutes.',
    statusCode: HttpStatus.TOO_MANY_REQUESTS,
  },
  skip: (req) => req.ip === '127.0.0.1' && env.NODE_ENV === 'development',
});

/**
 * Limiter strict pour les tentatives de connexion
 * 5 tentatives par 15 minutes par IP
 */
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // Ne compte pas les succès
  message: {
    success: false,
    message: 'Trop de tentatives de connexion. Votre accès est bloqué pendant 15 minutes.',
    statusCode: HttpStatus.TOO_MANY_REQUESTS,
  },
});

/**
 * Limiter pour les uploads de fichiers
 * 20 uploads par heure
 */
export const uploadRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 heure
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Limite d\'upload atteinte. Réessayez dans une heure.',
    statusCode: HttpStatus.TOO_MANY_REQUESTS,
  },
});

/**
 * Limiter pour les requêtes IA (coûteuses en ressources)
 * 10 requêtes par minute
 */
export const aiRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Limite de requêtes IA atteinte. Réessayez dans une minute.',
    statusCode: HttpStatus.TOO_MANY_REQUESTS,
  },
});