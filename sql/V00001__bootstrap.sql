
create table if not exists cron_tasks
(
    id int auto_increment not null primary key,

    cron_expression VARCHAR(12) not null,
    task_identifier VARCHAR(64) unique not null,

    created_at timestamp(3) not null default current_timestamp(3),
    updated_at timestamp(3) not null default current_timestamp(3)
);

create table if not exists accounts
(
    id int auto_increment not null primary key,

    address varchar(128) not null unique,

    created_at timestamp(3) not null default current_timestamp(3),
    updated_at timestamp(3) not null default current_timestamp(3),

    index(address)
);

create table if not exists transactions
(
    id int auto_increment not null primary key,

    signature varchar(128) not null unique,
    slot int not null,
    block_time int null,
    memo varchar(128) null,

    created_at timestamp(3) not null default current_timestamp(3),
    updated_at timestamp(3) not null default current_timestamp(3)
);

create table if not exists transactions_to_accounts
(
    id int auto_increment not null primary key,

    account_id int not null,
    transaction_id int not null,

    created_at timestamp(3) not null default current_timestamp(3),
    updated_at timestamp(3) not null default current_timestamp(3),

    foreign key (account_id) references accounts(id),
    foreign key (transaction_id) references transactions(id)
);

create table if not exists token_snapshots
(
    id int auto_increment not null primary key,

    token_account_id int not null,

    decimals int not null,
    price decimal(36, 18) not null,
    supply decimal(36, 18) not null,
    market_cap decimal(36, 18) not null,

    created_at timestamp(3) not null default current_timestamp(3),
    updated_at timestamp(3) not null default current_timestamp(3),

    foreign key (token_account_id) references accounts(id)
);
