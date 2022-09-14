SELECT * FROM mygym.user_like_exercises;


select count(l.id_exercises) from exercises e inner join user_like_exercises l where e.id=l.id_exercises  and l.id_exercises=2;


select * from exercises e inner join user_like_exercises l where e.id=l.id_exercises;



/*Agrupa y cuenta*/
SELECT id_exercises, COUNT(*) FROM user_like_exercises  GROUP BY id_exercises;

/* Culsulta de like ordenada*/
SELECT e.title,l.id_exercises, COUNT(*) AS n_like FROM user_like_exercises l INNER JOIN exercises e ON e.id=l.id_exercises GROUP BY id_exercises ORDER by n_like DESC;


