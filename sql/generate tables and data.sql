
create table "Users" (
	id UUID primary key,
	username varchar(128)
);


create table "UserPermissions" (
	userId UUID,
	permissionId UUID
);

create table "Permission" (
	id UUID primary key,
	permission varchar(128)
);

create table "Post" (
	id uuid primary key,
	userId uuid,
	post varchar(1024),
	date date
);

insert into "User" values ('e488358d-6d2e-4b30-96af-65e772342d82', 'Sally Boulanger');
insert into "User" values ('09b69dd8-5c3f-44f3-a7af-3a348d004f8d', 'Clare Patis');
insert into "User" values ('6b2eb78c-e7b0-4247-a796-6194265a966d', 'Clément Duran');

insert into "Permission" values ('d6474542-bc21-430c-b1e2-ab779e1cd86c', 'read-posts');
insert into "Permission" values ('eafeed3f-81e8-4f60-a5a2-6483f67bd0b2', 'create-posts');

insert into "UserPermissions" values ('e488358d-6d2e-4b30-96af-65e772342d82','d6474542-bc21-430c-b1e2-ab779e1cd86c');
insert into "UserPermissions" values ('e488358d-6d2e-4b30-96af-65e772342d82','eafeed3f-81e8-4f60-a5a2-6483f67bd0b2');

insert into "Post" (id, "userI	d", post, date)
values ('e488358d-6d2e-4b30-96af-65e772342d82', 'e488358d-6d2e-4b30-96af-65e772342d82', 'my first post', now());


insert into "Post" (id, "userId", post, date)
values ('e488358d-6d2e-4b30-96af-65a772343e52', 'e488358d-6d2e-4b30-96af-65e772342d82', 'my second, post', now());

update "Post" set "userId" = '1' where "Post"."userId" is null;


