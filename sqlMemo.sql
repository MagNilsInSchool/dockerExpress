CREATE TABLE games  (
id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
title VARCHAR(50) UNIQUE NOT NULL,
genre VARCHAR(20) NOT NULL
);

CREATE TABLE players (
id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
name VARCHAR(15) UNIQUE NOT NULL,
join_date DATE DEFAULT CURRENT_DATE NOT NULL);

CREATE TABLE scores (
  id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  player_id INT,
  CONSTRAINT fk_scores_player FOREIGN KEY (player_id)
    REFERENCES players(id) ON DELETE CASCADE,-- So that deleting a player removes scores of that player too
  game_id INT,
  CONSTRAINT fk_scores_game FOREIGN KEY (game_id)
    REFERENCES games(id) ON DELETE CASCADE,
  score INT NOT NULL,
  date_played TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO players(name) 
VALUES('Beancicle'),('MrBean'),('BeanyMan'),('JellyBean'),('FlickTheBean')
INSERT INTO games(title, genre) 
VALUES('Run the beans', 'action'),('Operation beanstorm','action'),('Blox of beans', 'puzzle'),('Say it aint beans?', 'casual'),('The man in the canoe', 'adventure')
INSERT INTO scores(player_ID, game_id, score) 
VALUES(5, 1, 500),(3, 2, 1500),(1, 5, 12500),(2, 1, 1600),(3, 2, 2500),(1, 5, 23500),(1, 4, 11500),(4, 2, 200)

SELECT * FROM players;

ALTER TABLE games
ALTER COLUMN title TYPE VARCHAR(50);