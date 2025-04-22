-- we don't know how to generate root <with-no-name> (class Root) :(

grant select on performance_schema.* to 'mysql.session'@localhost;

grant trigger on sys.* to 'mysql.sys'@localhost;

grant audit_abort_exempt, firewall_exempt, select, system_user on *.* to 'mysql.infoschema'@localhost;

grant audit_abort_exempt, authentication_policy_admin, backup_admin, clone_admin, connection_admin, firewall_exempt, persist_ro_variables_admin, session_variables_admin, shutdown, super, system_user, system_variables_admin on *.* to 'mysql.session'@localhost;

grant audit_abort_exempt, firewall_exempt, system_user on *.* to 'mysql.sys'@localhost;

grant allow_nonexistent_definer, alter, alter routine, application_password_admin, audit_abort_exempt, audit_admin, authentication_policy_admin, backup_admin, binlog_admin, binlog_encryption_admin, clone_admin, connection_admin, create, create role, create routine, create tablespace, create temporary tables, create user, create view, delete, drop, drop role, encryption_key_admin, event, execute, file, firewall_exempt, flush_optimizer_costs, flush_privileges, flush_status, flush_tables, flush_user_resources, group_replication_admin, group_replication_stream, index, innodb_redo_log_archive, innodb_redo_log_enable, insert, lock tables, optimize_local_table, passwordless_user_admin, persist_ro_variables_admin, process, references, reload, replication client, replication slave, replication_applier, replication_slave_admin, resource_group_admin, resource_group_user, role_admin, select, sensitive_variables_observer, service_connection_admin, session_variables_admin, set_any_definer, show databases, show view, show_routine, shutdown, super, system_user, system_variables_admin, table_encryption_admin, telemetry_log_admin, transaction_gtid_tag, trigger, update, xa_recover_admin, grant option on *.* to root;

grant allow_nonexistent_definer, alter, alter routine, application_password_admin, audit_abort_exempt, audit_admin, authentication_policy_admin, backup_admin, binlog_admin, binlog_encryption_admin, clone_admin, connection_admin, create, create role, create routine, create tablespace, create temporary tables, create user, create view, delete, drop, drop role, encryption_key_admin, event, execute, file, firewall_exempt, flush_optimizer_costs, flush_privileges, flush_status, flush_tables, flush_user_resources, group_replication_admin, group_replication_stream, index, innodb_redo_log_archive, innodb_redo_log_enable, insert, lock tables, optimize_local_table, passwordless_user_admin, persist_ro_variables_admin, process, references, reload, replication client, replication slave, replication_applier, replication_slave_admin, resource_group_admin, resource_group_user, role_admin, select, sensitive_variables_observer, service_connection_admin, session_variables_admin, set_any_definer, show databases, show view, show_routine, shutdown, super, system_user, system_variables_admin, table_encryption_admin, telemetry_log_admin, transaction_gtid_tag, trigger, update, xa_recover_admin, grant option on *.* to root@localhost;

create table cart
(
    id         int auto_increment
        primary key,
    user_id    int                                 not null,
    product_id int                                 not null,
    quantity   int       default 1                 null,
    unit_price decimal(10, 2)                      null,
    added_at   timestamp default CURRENT_TIMESTAMP null,
    constraint user_id
        unique (user_id, product_id)
);

create table exclusive_discounts
(
    id                  int auto_increment
        primary key,
    user_id             int                                  not null,
    level               enum ('nivel1', 'nivel2', 'nivel3')  null,
    discount_percentage decimal(5, 2)                        not null,
    activated_at        timestamp  default CURRENT_TIMESTAMP null,
    expires_at          datetime                             not null,
    used                tinyint(1) default 0                 null
);

create table favorites
(
    id         int auto_increment
        primary key,
    user_id    int                                 not null,
    product_id int                                 not null,
    added_at   timestamp default CURRENT_TIMESTAMP null,
    constraint user_id
        unique (user_id, product_id)
);

create table orders
(
    id         int auto_increment
        primary key,
    user_id    int                                                                                             not null,
    status     enum ('pendiente', 'procesando', 'enviado', 'entregado', 'cancelado') default 'pendiente'       null,
    total      decimal(10, 2)                                                                                  not null,
    created_at timestamp                                                             default CURRENT_TIMESTAMP null,
    updated_at timestamp                                                             default CURRENT_TIMESTAMP null on update CURRENT_TIMESTAMP
);

create table order_items
(
    id         int auto_increment
        primary key,
    order_id   int            not null,
    product_id int            not null,
    quantity   int            not null,
    unit_price decimal(10, 2) not null,
    constraint order_items_ibfk_1
        foreign key (order_id) references orders (id)
            on delete cascade
);

create index order_id
    on order_items (order_id);

create table order_tracking
(
    id         int auto_increment
        primary key,
    order_id   int                                           not null,
    status     enum ('procesando', 'en camino', 'entregado') null,
    location   varchar(255)                                  null,
    updated_at timestamp default CURRENT_TIMESTAMP           null,
    constraint order_tracking_ibfk_1
        foreign key (order_id) references orders (id)
            on delete cascade
);

create index order_id
    on order_tracking (order_id);

create table payments
(
    id       int auto_increment
        primary key,
    order_id int                                                                     not null,
    method   enum ('tarjeta_credito', 'tarjeta_debito', 'transferencia', 'efectivo') not null,
    status   enum ('pendiente', 'pagado', 'fallido') default 'pendiente'             null,
    amount   decimal(10, 2)                                                          not null,
    paid_at  datetime                                                                null,
    constraint payments_ibfk_1
        foreign key (order_id) references orders (id)
            on delete cascade
);

create index order_id
    on payments (order_id);