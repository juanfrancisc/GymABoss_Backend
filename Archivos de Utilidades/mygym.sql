USE mygym;

DROP TABLE IF EXISTS `user_view_exercises`;
DROP TABLE IF EXISTS `exercises`;
DROP TABLE IF EXISTS `typology`;
DROP TABLE IF EXISTS `users`;

CREATE TABLE IF NOT EXISTS `users` (
  `id` int unsigned PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `name` varchar(15) NOT NULL,
  `email` varchar(100) NOT NULL UNIQUE,
  `password` varchar(255) NOT NULL,
  `type_user` enum('normal','admin') NOT NULL
);

CREATE TABLE `typology` (
  `id` int unsigned PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `title` varchar(45) NOT NULL UNIQUE
);

CREATE TABLE `exercises` (
  `id` int unsigned PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `title` varchar(45) NOT NULL UNIQUE,
  `description` text NOT NULL,
  `id_typology` int unsigned NOT NULL,
  `photo` varchar(100) NOT NULL,
  /*Cre que el like hay que marcarlo en la tabla de los ejercicios, 
  que luego nos puede beneficiar a la hora de hacer el filtro */
  `like` ENUM ('NO','YES') NOT NULL,
  /* He modificado la foreing key para que si se borra la tipologia se eliminen los ejercicios que tiene dicha tipologia */
  FOREIGN KEY (`id_typology`) REFERENCES `typology` (`id`)
  ON DELETE CASCADE
);

CREATE TABLE `user_view_exercises` (
  `id` int unsigned PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `id_user` int unsigned NOT NULL,
  `id_exercises` int unsigned NOT NULL,
  `favorites` int NOT NULL,
  /* He modificado las foreing key para que al borar el usuario o el ejercicio, se borren sus marcar*/
  FOREIGN KEY (`id_user`) REFERENCES `users`(`id`)
  ON DELETE CASCADE,
  FOREIGN KEY (`id_exercises`) REFERENCES `exercises`(`id`)
  ON DELETE CASCADE
);


/* Insertamos 2 usuarios admin de ejemplo*/
INSERT INTO `users` (`name`, `email`, `password`, `type_user`) VALUES ('admin', 'admin@gym.com', '123456789', 'admin'),
('admin10', 'admin10@gym.com', '123456789', 'admin');

/* Insertamos varios usuarios de ejemplo */
INSERT INTO `users` (`name`, `email`, `password`) VALUES ('user1', 'user1@user1.com', '12345'),
('user2', 'user2@user1.com', '12345'),
('user3', 'user3@user1.com', '12345'),
('user4', 'user4@user1.com', '12345'),
('user5', 'user5@user1.com', '12345');

/* Ejemplo de tipologias de trabajo */
INSERT INTO `typology` (`title`) VALUES ('Cardio'), ('Piscina'),('Relajación'),('Musculación');

/* Ejemplos de ejercicios */
INSERT INTO `exercises` (`title`, `description`, `id_typology`, `photo`) VALUES ('Sentadillas', 'Realimos agachadillas hasta media altura y mantenemos unos segundos, nos ponemos ergidos y volvemos a comenzar. Unas 20 repeticiones con 10 segundos de descanso entre ellas', '1', 'foto.jpg')
,('Abdominales', 'El ejercicio estándar de encogimiento abdominal se concentra en los músculos del estómago. Es un ejercicio eficaz y seguro que es ideal para principiantes, para ayudar a desarrollar músculos abdominales fuertes.', '1', 'foto.jpg')
,('Flexiones', 'Las flexiones son un excelente ejercicio para trabajar los músculos del pecho y los brazos. Debido a la posición que usted tiene que mantener para hacer este ejercicio correctamente, también trabaja el núcleo, abdominales, piernas y espalda. Diferentes variaciones de las flexiones plantearán un nuevo desafío los mismos grupos musculares.', '4', 'foto.jpg')
,('Nado a Crol', 'Este estilo es de forma alternada, mientras uno de los brazos del nadador se mueve en el aire con la palma hacia abajo dispuesta a ingresar al agua, y el codo relajado, el otro brazo avanza bajo el agua', '2', 'foto.jpg');

/* Ejemplos de favoritos */
INSERT INTO `user_view_exercises` (`id_user`, `id_exercises`, `favorites`) VALUES ('3', '2', '1'),
('4', '1','1'),
('5', '4', '1');
