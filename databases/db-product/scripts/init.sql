create table brands
(
    id         int auto_increment
        primary key,
    name       varchar(100)                        not null,
    created_at timestamp default CURRENT_TIMESTAMP null,
    constraint name
        unique (name)
);

create table categories
(
    id         int auto_increment
        primary key,
    name       varchar(100)                        not null,
    created_at timestamp default CURRENT_TIMESTAMP null,
    updated_at timestamp default CURRENT_TIMESTAMP null on update CURRENT_TIMESTAMP,
    constraint name
        unique (name)
);

create table products
(
    id             int auto_increment
        primary key,
    name           varchar(150)                                                not null,
    description    text                                                        not null,
    price          decimal(10, 2)                                              not null,
    stock_quantity int                               default 0                 not null,
    category_id    int                                                         not null,
    main_image_url varchar(255)                                                null,
    code           varchar(50)                                                 null,
    value          decimal(10, 2)                                              null,
    status         enum ('available', 'unavailable') default 'available'       null,
    created_at     timestamp                         default CURRENT_TIMESTAMP null,
    updated_at     timestamp                         default CURRENT_TIMESTAMP null on update CURRENT_TIMESTAMP,
    constraint code
        unique (code),
    constraint products_ibfk_1
        foreign key (category_id) references categories (id)
);

create table product_brands
(
    product_id int not null,
    brand_id   int not null,
    primary key (product_id, brand_id),
    constraint product_brands_ibfk_1
        foreign key (product_id) references products (id)
            on delete cascade,
    constraint product_brands_ibfk_2
        foreign key (brand_id) references brands (id)
            on delete cascade
);

create index brand_id
    on product_brands (brand_id);

create table product_images
(
    id            int auto_increment
        primary key,
    product_id    int                                  not null,
    image_url     varchar(255)                         not null,
    is_main_image tinyint(1) default 0                 null,
    created_at    timestamp  default CURRENT_TIMESTAMP null,
    constraint product_images_ibfk_1
        foreign key (product_id) references products (id)
            on delete cascade
);

create index product_id
    on product_images (product_id);

create table product_reviews
(
    id         int auto_increment
        primary key,
    product_id int                                 not null,
    user_id    int                                 not null,
    rating     int                                 not null,
    review     text                                null,
    created_at timestamp default CURRENT_TIMESTAMP null,
    constraint product_reviews_ibfk_1
        foreign key (product_id) references products (id)
            on delete cascade,
    check (`rating` between 1 and 5)
);

create index product_id
    on product_reviews (product_id);

create index category_id
    on products (category_id);

create table regions
(
    id         int auto_increment
        primary key,
    name       varchar(100)                        not null,
    created_at timestamp default CURRENT_TIMESTAMP null,
    constraint name
        unique (name)
);

create table product_restricted_regions
(
    product_id int not null,
    region_id  int not null,
    primary key (product_id, region_id),
    constraint product_restricted_regions_ibfk_1
        foreign key (product_id) references products (id)
            on delete cascade,
    constraint product_restricted_regions_ibfk_2
        foreign key (region_id) references regions (id)
            on delete cascade
);

create index region_id
    on product_restricted_regions (region_id);