-- V4 : Données d'exemple — ouvertures système
INSERT INTO opening (id, name, description, eco_code, moves, is_public, user_id, created_at) VALUES
    (uuid_generate_v4(), 'Défense Sicilienne', 'Une des ouvertures les plus populaires au plus haut niveau. Les Noirs répondent 1...c5 à 1.e4, visant un jeu asymétrique et dynamique.', 'B20', '1.e4 c5', true, null, NOW()),
    (uuid_generate_v4(), 'Ruy Lopez', 'Ouverture classique nommée d''après le prêtre espagnol Ruy López de Segura au 16e siècle. Vise à mettre la pression sur le centre noir.', 'C60', '1.e4 e5 2.Nf3 Nc6 3.Bb5', true, null, NOW()),
    (uuid_generate_v4(), 'Gambit du Roi', 'Ouverture agressive sacrifiant un pion pour un développement rapide et une attaque directe sur le roi adverse.', 'C30', '1.e4 e5 2.f4', true, null, NOW()),
    (uuid_generate_v4(), 'Défense Française', 'Ouverture solide où les Noirs construisent une structure de pions robuste avec 1...e6, permettant un jeu positionnel complexe.', 'C00', '1.e4 e6', true, null, NOW()),
    (uuid_generate_v4(), 'Défense Caro-Kann', 'Ouverture fiable et solide. Les Noirs jouent 1...c6 pour préparer d5 avec un bon soutien de pions.', 'B10', '1.e4 c6', true, null, NOW()),
    (uuid_generate_v4(), 'Ouverture Italienne', 'Développement classique avec Bc4, visant le point faible f7. Ouverture très jouée à tous les niveaux.', 'C50', '1.e4 e5 2.Nf3 Nc6 3.Bc4', true, null, NOW()),
    (uuid_generate_v4(), 'Gambit Dame', 'Ouverture de pions de la dame où les Blancs sacrifient temporairement le pion c4 pour contrôler le centre.', 'D06', '1.d4 d5 2.c4', true, null, NOW()),
    (uuid_generate_v4(), 'Défense Indienne du Roi', 'Système hypermoderne où les Noirs permettent aux Blancs de contrôler le centre avec des pions, puis le contestent par les pièces.', 'E60', '1.d4 Nf6 2.c4 g6', true, null, NOW()),
    (uuid_generate_v4(), 'Défense Nimzo-Indienne', 'Ouverture stratégique solide où les Noirs clouent le cavalier c3 avec leur fou, cherchant à contrôler le centre indirectement.', 'E20', '1.d4 Nf6 2.c4 e6 3.Nc3 Bb4', true, null, NOW()),
    (uuid_generate_v4(), 'Ouverture Anglaise', 'Ouverture de flanc flexible où les Blancs commencent par 1.c4, retardant le développement central pour garder des options.', 'A10', '1.c4', true, null, NOW());
