<?php
namespace App\Model;

use App\Service\Config;

class Music
{
    private ?int $id = null;
    private ?string $title = null;
    private ?string $artist = null;
    private ?int $releaseYear = null;
    private ?string $description = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function setId(?int $id): Music
    {
        $this->id = $id;
        return $this;
    }

    public function getTitle(): ?string
    {
        return $this->title;
    }

    public function setTitle(?string $title): Music
    {
        $this->title = $title;
        return $this;
    }

    public function getArtist(): ?string
    {
        return $this->artist;
    }

    public function setArtist(?string $artist): Music
    {
        $this->artist = $artist;
        return $this;
    }

    public function getReleaseYear(): ?int
    {
        return $this->releaseYear;
    }

    public function setReleaseYear(?int $releaseYear): Music
    {
        $this->releaseYear = $releaseYear;
        return $this;
    }

    public static function fromArray(array $data): Music
    {
        $music = new self();
        $music->fill($data);
        return $music;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    // Nowa metoda setDescription
    public function setDescription(?string $description): Music
    {
        $this->description = $description;
        return $this;
    }

    public function fill(array $data): Music
    {
        if (isset($data['id']) && !$this->id) {
            $this->setId($data['id']);
        }
        if (isset($data['title'])) {
            $this->setTitle($data['title']);
        }
        if (isset($data['artist'])) {
            $this->setArtist($data['artist']);
        }
        if (isset($data['release_year'])) {
            $this->setReleaseYear($data['release_year']);
        }
        if (isset($data['description'])) {
            $this->setDescription($data['description']);
        }
        return $this;
    }

    public static function findAll(): array
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        $sql = 'SELECT * FROM music';
        $statement = $pdo->prepare($sql);
        $statement->execute();

        $result = [];
        foreach ($statement->fetchAll(\PDO::FETCH_ASSOC) as $row) {
            $result[] = self::fromArray($row);
        }
        return $result;
    }

    public static function find(int $id): ?Music
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        $sql = 'SELECT * FROM music WHERE id = :id';
        $statement = $pdo->prepare($sql);
        $statement->execute(['id' => $id]);

        $data = $statement->fetch(\PDO::FETCH_ASSOC);
        return $data ? self::fromArray($data) : null;
    }

    public function save(): void
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        if ($this->id === null) {
            $sql = 'INSERT INTO music (title, artist, release_year, description) VALUES (:title, :artist, :release_year, :description)';
            $statement = $pdo->prepare($sql);
            $statement->execute([
                'title' => $this->title,
                'artist' => $this->artist,
                'release_year' => $this->releaseYear,
                'description' => $this->description,  // Przekazanie opisu
            ]);
            $this->id = $pdo->lastInsertId();
        } else {
            $sql = 'UPDATE music SET title = :title, artist = :artist, release_year = :release_year, description = :description WHERE id = :id';
            $statement = $pdo->prepare($sql);
            $statement->execute([
                'title' => $this->title,
                'artist' => $this->artist,
                'release_year' => $this->releaseYear,
                'description' => $this->description,  // Przekazanie opisu
                'id' => $this->id,
            ]);
        }
    }

    public function delete(): void
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        $sql = 'DELETE FROM music WHERE id = :id';
        $statement = $pdo->prepare($sql);
        $statement->execute(['id' => $this->id]);

        $this->id = null;
        $this->title = null;
        $this->artist = null;
        $this->releaseYear = null;
    }
}
