-- seed_admin.sql - Utilisateur administrateur initial
-- Mot de passe : Admin@GED2024 (à changer impérativement en production)
-- Hash bcrypt (rounds=12) généré hors-ligne
-- ─────────────────────────────────────────────

BEGIN;

INSERT INTO users (
  id,
  email,
  password_hash,
  role,
  status,
  first_name,
  last_name,
  mfa_enabled
)
VALUES (
  uuid_generate_v4(),
  'admin@ged.gov.ma',
  -- Admin@GED2024 — bcrypt $2b$12$ hash (à régénérer en production)
  '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/lewKyNiLXCouAgaGa',
  'ADMIN',
  'ACTIVE',
  'Administrateur',
  'Système',
  FALSE
)
ON CONFLICT (email) DO NOTHING;

-- Créer les préférences de notification par défaut pour l'admin
INSERT INTO notification_preferences (user_id, email_enabled, in_app_enabled)
SELECT id, TRUE, TRUE FROM users WHERE email = 'admin@ged.gov.ma'
ON CONFLICT (user_id) DO NOTHING;

COMMIT;
