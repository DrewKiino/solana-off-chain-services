
create table if not exists token_infos
(
    id int auto_increment not null primary key,

    token_mint_account_id int not null,

    symbol varchar(64) not null,
    decimals tinyint unsigned not null, # 1-9
    logo_uri varchar(256) null,
    website varchar(256) null,
    coingecko_id varchar(64) null,

    created_at timestamp(3) not null default current_timestamp(3),
    updated_at timestamp(3) not null default current_timestamp(3),

    foreign key (token_mint_account_id) references accounts(id),

    index(token_mint_account_id)
);