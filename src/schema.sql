drop table if exists productRecords cascade;

create table productRecords (
    userID text not null,
    productName text not null,
    price float not null,
    channelID text not null,
    link text not null,
    CONSTRAINT unique_user_product_link UNIQUE (userid, productname)
);


