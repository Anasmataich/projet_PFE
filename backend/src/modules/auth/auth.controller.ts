// auth.controller.ts - contrôleur d'authentification

import { Request, Response } from 'express';
import { ApiResponse } from '../../shared/ApiResponse';
import { HttpStatus } from '../../shared/enums';
import { authService } from './auth.service';
import { extractBearerToken } from '../../config/jwt';
import {
  validateLoginInput,
  validateRegisterInput,
  validateMfaVerifyInput,
  validateMfaEnableInput,
  validateRefreshInput,
  validateChangePasswordInput,
} from './auth.validation';

// ─────────────────────────────────────────────
// Contrôleurs
// ─────────────────────────────────────────────

export const register = async (req: Request, res: Response): Promise<void> => {
  const input = validateRegisterInput(req.body);
  const ipAddress = req.ip ?? req.socket.remoteAddress ?? 'unknown';
  const result = await authService.register(
    input.email,
    input.password,
    ipAddress,
    input.firstName,
    input.lastName
  );
  ApiResponse.created(res, result, 'Compte créé avec succès');
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const input = validateLoginInput(req.body);
  const ipAddress = req.ip ?? req.socket.remoteAddress ?? 'unknown';
  const result = await authService.login(input.email, input.password, ipAddress);
  ApiResponse.success(res, result, 'Connexion réussie');
};

export const verifyMFA = async (req: Request, res: Response): Promise<void> => {
  const input = validateMfaVerifyInput(req.body);
  const ipAddress = req.ip ?? req.socket.remoteAddress ?? 'unknown';
  const tokens = await authService.verifyMFA(input.userId, input.totpToken, input.pendingToken, ipAddress);
  ApiResponse.success(res, tokens, 'MFA vérifié avec succès');
};

export const setupMFA = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user!.userId;
  const result = await authService.setupMFA(userId);
  ApiResponse.success(res, result, 'Scannez le QR code avec votre application TOTP');
};

export const enableMFA = async (req: Request, res: Response): Promise<void> => {
  const input = validateMfaEnableInput(req.body);
  const userId = req.user!.userId;
  const ipAddress = req.ip ?? req.socket.remoteAddress ?? 'unknown';
  await authService.enableMFA(userId, input.totpToken, ipAddress);
  ApiResponse.success(res, null, 'MFA activé avec succès');
};

export const disableMFA = async (req: Request, res: Response): Promise<void> => {
  const input = validateMfaEnableInput(req.body);
  const userId = req.user!.userId;
  const ipAddress = req.ip ?? req.socket.remoteAddress ?? 'unknown';
  await authService.disableMFA(userId, input.totpToken, ipAddress);
  ApiResponse.success(res, null, 'MFA désactivé');
};

export const changePassword = async (req: Request, res: Response): Promise<void> => {
  const input = validateChangePasswordInput(req.body);
  const userId = req.user!.userId;
  const ipAddress = req.ip ?? req.socket.remoteAddress ?? 'unknown';
  await authService.changePassword(userId, input.currentPassword, input.newPassword, ipAddress);
  ApiResponse.success(res, null, 'Mot de passe mis à jour avec succès');
};

export const refresh = async (req: Request, res: Response): Promise<void> => {
  const input = validateRefreshInput(req.body);
  const ipAddress = req.ip ?? req.socket.remoteAddress ?? 'unknown';
  const tokens = await authService.refreshTokens(input.refreshToken, ipAddress);
  ApiResponse.success(res, tokens, 'Tokens rafraîchis');
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  const token = extractBearerToken(req.headers['authorization']);
  if (!token) {
    ApiResponse.error(res, 'Token manquant', HttpStatus.UNAUTHORIZED);
    return;
  }

  const userId = req.user?.userId;
  if (!userId) {
    ApiResponse.error(res, 'Non authentifié', HttpStatus.UNAUTHORIZED);
    return;
  }

  const ipAddress = req.ip ?? req.socket.remoteAddress ?? 'unknown';
  await authService.logout(token, userId, ipAddress);
  ApiResponse.success(res, null, 'Déconnexion réussie');
};

export const getMe = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user!.userId;
  const result = await import('../../config/database').then((m) =>
    m.default.query(
      'SELECT id, email, role, status, first_name, last_name, mfa_enabled, created_at FROM users WHERE id = $1',
      [userId]
    )
  );
  const user = result.rows[0];
  if (!user) {
    ApiResponse.error(res, 'Utilisateur introuvable', HttpStatus.NOT_FOUND);
    return;
  }
  ApiResponse.success(res, user, 'Profil utilisateur');
};
