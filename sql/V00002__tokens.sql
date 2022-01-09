
create table if not exists token_accounts
(
    id int auto_increment not null primary key,

    token_account_id int not null unique,
    token_mint_account_id int not null,
    token_owner_account_id int not null,

    balance decimal(36, 18) not null,

    created_at timestamp(3) not null default current_timestamp(3),
    updated_at timestamp(3) not null default current_timestamp(3),

    foreign key (token_account_id) references accounts(id),
    foreign key (token_mint_account_id) references accounts(id),

    index(token_account_id),
    index(token_mint_account_id)
);