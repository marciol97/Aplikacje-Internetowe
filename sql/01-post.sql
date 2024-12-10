/*create table post
(
    id      integer not null
        constraint post_pk
            primary key autoincrement,
    subject text not null,
    content text not null
);
*/
CREATE TABLE music (
                       id INTEGER PRIMARY KEY AUTOINCREMENT,
                       title TEXT NOT NULL,
                       artist TEXT NOT NULL,
                       release_year INTEGER NOT NULL
);