<?php
/** @var \App\Model\Music $music */
/** @var \App\Service\Router $router */

$title = "{$music->getTitle()} ({$music->getId()})";
$bodyClass = 'show';

ob_start(); ?>
    <h1><?= $music->getTitle() ?></h1>
    <article>
        <p><strong>Artist:</strong> <?= $music->getArtist() ?></p>
        <p><strong>Release Year:</strong> <?= $music->getReleaseYear() ?></p>
        <p><strong>Description:</strong> <?= $music->getDescription() ?></p>
    </article>

    <ul class="action-list">
        <li><a href="<?= $router->generatePath('music-index') ?>">Back to list</a></li>
        <li><a href="<?= $router->generatePath('music-edit', ['id'=> $music->getId()]) ?>">Edit</a></li>
        <li><a href="<?= $router->generatePath('music-delete', ['id'=> $music->getId()]) ?>">Delete</a></li>
    </ul>
<?php $main = ob_get_clean();

include __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'base.html.php';
