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