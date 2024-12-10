<?php
/** @var $music ?\App\Model\Music */
?>

<div class="form-group">
    <label for="title">Title</label>
    <input type="text" id="title" name="music[title]" value="<?= $music ? $music->getTitle() : '' ?>">
</div>

<div class="form-group">
    <label for="artist">Artist</label>
    <input type="text" id="artist" name="music[artist]" value="<?= $music ? $music->getArtist() : '' ?>">
</div>

<div class="form-group">
    <label for="release_year">Release Year</label>
    <input type="number" id="release_year" name="music[release_year]" value="<?= $music ? $music->getReleaseYear() : '' ?>">
</div>

<div class="form-group">
    <label for="description">Description</label>
    <textarea id="description" name="music[description]"><?= $music ? $music->getDescription() : '' ?></textarea>
</div>

<div class="form-group">
    <label></label>
    <input type="submit" value="Submit">
</div>
