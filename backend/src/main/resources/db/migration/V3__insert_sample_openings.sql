INSERT INTO opening (id, name, description, eco_code, moves, is_public, user_id, created_at, updated_at)
VALUES
  (gen_random_uuid(), 'Défense Sicilienne', 'Une des ouvertures les plus populaires au plus haut niveau. Les Noirs répondent 1...c5 pour contester le centre sans créer de symétrie.', 'B20', '1.e4 c5', true, NULL, NOW(), NOW()),
  (gen_random_uuid(), 'Ruy Lopez', 'Ouverture classique nommée d''après un prêtre espagnol du 16e siècle. Elle met la pression sur le cavalier c6 qui défend le pion e5.', 'C60', '1.e4 e5 2.Nf3 Nc6 3.Bb5', true, NULL, NOW(), NOW()),
  (gen_random_uuid(), 'Gambit du Roi', 'Ouverture agressive où les Blancs sacrifient le pion f pour ouvrir la colonne f et accélérer le développement.', 'C30', '1.e4 e5 2.f4', true, NULL, NOW(), NOW());
