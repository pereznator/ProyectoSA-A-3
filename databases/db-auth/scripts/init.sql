create table promotions
(
    id                  int auto_increment
        primary key,
    name                varchar(100)                         not null,
    description         text                                 null,
    discount_percentage decimal(5, 2)                        not null,
    start_date          datetime                             not null,
    end_date            datetime                             not null,
    is_active           tinyint(1) default 1                 null,
    created_at          timestamp  default CURRENT_TIMESTAMP null,
    updated_at          timestamp  default CURRENT_TIMESTAMP null on update CURRENT_TIMESTAMP,
    check ((`discount_percentage` > 0) and (`discount_percentage` <= 100))
);

create table users
(
    id              int auto_increment
        primary key,
    first_name      varchar(100)                                          not null,
    last_name       varchar(100)                                          not null,
    email           varchar(150)                                          not null,
    username        varchar(100)                                          not null,
    password        varchar(255)                                          not null,
    phone           varchar(20)                                           not null,
    dob             date                                                  not null,
    gender          enum ('male', 'female')                               not null,
    profile_picture longtext                                              null,
    status          enum ('active', 'inactive') default 'active'          not null,
    role            enum ('admin', 'user')      default 'user'            not null,
    created_at      timestamp                   default CURRENT_TIMESTAMP null,
    updated_at      timestamp                   default CURRENT_TIMESTAMP null on update CURRENT_TIMESTAMP,
    constraint email
        unique (email),
    constraint username
        unique (username)
);

create table email_verifications
(
    id         int auto_increment
        primary key,
    user_id    int                                  not null,
    token      varchar(255)                         not null,
    expires_at datetime                             not null,
    used       tinyint(1) default 0                 null,
    created_at timestamp  default CURRENT_TIMESTAMP null,
    constraint email_verifications_ibfk_1
        foreign key (user_id) references users (id)
            on delete cascade
);

create index user_id
    on email_verifications (user_id);

create table user_addresses
(
    id         int auto_increment
        primary key,
    user_id    int                                  not null,
    address    varchar(255)                         not null,
    city       varchar(100)                         not null,
    department varchar(100)                         not null,
    is_primary tinyint(1) default 0                 null,
    created_at timestamp  default CURRENT_TIMESTAMP null,
    updated_at timestamp  default CURRENT_TIMESTAMP null on update CURRENT_TIMESTAMP,
    constraint user_addresses_ibfk_1
        foreign key (user_id) references users (id)
            on delete cascade
);

create index user_id
    on user_addresses (user_id);

create table user_promotions
(
    id           int auto_increment
        primary key,
    user_id      int                                  not null,
    promotion_id int                                  not null,
    applied      tinyint(1) default 0                 null,
    assigned_at  timestamp  default CURRENT_TIMESTAMP null,
    constraint user_promotions_ibfk_1
        foreign key (user_id) references users (id)
            on delete cascade,
    constraint user_promotions_ibfk_2
        foreign key (promotion_id) references promotions (id)
            on delete cascade
);

create index promotion_id
    on user_promotions (promotion_id);

create index user_id
    on user_promotions (user_id);

create table user_reports
(
    id               int auto_increment
        primary key,
    reported_user_id int                                                                             not null,
    reporter_user_id int                                                                             null,
    reason           text                                                                            not null,
    status           enum ('pending', 'reviewed', 'resolved', 'dismissed') default 'pending'         null,
    created_at       timestamp                                             default CURRENT_TIMESTAMP null,
    reviewed_at      timestamp                                                                       null,
    constraint user_reports_ibfk_1
        foreign key (reported_user_id) references users (id)
            on delete cascade,
    constraint user_reports_ibfk_2
        foreign key (reporter_user_id) references users (id)
            on delete set null
);

create index reported_user_id
    on user_reports (reported_user_id);

create index reporter_user_id
    on user_reports (reporter_user_id);

create table user_sessions
(
    id         int auto_increment
        primary key,
    user_id    int                                  not null,
    token      text                                 not null,
    ip_address varchar(50)                          null,
    user_agent varchar(255)                         null,
    is_active  tinyint(1) default 1                 null,
    expires_at datetime                             not null,
    created_at timestamp  default CURRENT_TIMESTAMP null,
    constraint user_sessions_ibfk_1
        foreign key (user_id) references users (id)
            on delete cascade
);

create index user_id
    on user_sessions (user_id);

