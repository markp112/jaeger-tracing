CREATE EXTENSION "uuid-ossp";

create table "Users" (
	id UUID primary key,
	username varchar(128)
);

create table "UserPermissions" (
	userId UUID,
	permissionID UUID
);

create table "Permissions" (
	id UUID primary key,
	permission varchar(128)
);

create table "Post" (
	id uuid primary key,
	userId uuid,
	post varchar(1024),
	date date
);

insert into "Users" values ('e488358d-6d2e-4b30-96af-65e772342d82', 'Sally Boulanger');
insert into "Users" values ('09b69dd8-5c3f-44f3-a7af-3a348d004f8d', 'Clare Patis');
insert into "Users" values ('6b2eb78c-e7b0-4247-a796-6194265a966d', 'Clément Duran');

insert into "Permissions" values ('d6474542-bc21-430c-b1e2-ab779e1cd86c', 'read-posts');
insert into "Permissions" values ('eafeed3f-81e8-4f60-a5a2-6483f67bd0b2', 'create-posts');


insert into "UserPermissions" values ('e488358d-6d2e-4b30-96af-65e772342d82','d6474542-bc21-430c-b1e2-ab779e1cd86c');
insert into "UserPermissions" values ('e488358d-6d2e-4b30-96af-65e772342d82','eafeed3f-81e8-4f60-a5a2-6483f67bd0b2');


