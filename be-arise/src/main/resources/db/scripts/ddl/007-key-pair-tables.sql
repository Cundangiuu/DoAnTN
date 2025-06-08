CREATE TABLE
    keypair (
        public_key VARCHAR(2048),
        private_key VARCHAR(2048),
        created_by VARCHAR(255),
        updated_by VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        is_delete BOOLEAN default false,
        CONSTRAINT pk_keypair PRIMARY KEY (public_key, private_key)
    );