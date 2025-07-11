-- Drop all existing foreign key constraints from messages table
SET @constraints = (
    SELECT GROUP_CONCAT(CONCAT('DROP FOREIGN KEY ', CONSTRAINT_NAME))
    FROM information_schema.TABLE_CONSTRAINTS 
    WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'messages' 
    AND CONSTRAINT_TYPE = 'FOREIGN KEY'
);

SET @sql = IF(@constraints IS NOT NULL, 
    CONCAT('ALTER TABLE messages ', @constraints),
    'SELECT "No foreign key constraints found on messages table"');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Drop all existing foreign key constraints from chat_rooms table
SET @constraints = (
    SELECT GROUP_CONCAT(CONCAT('DROP FOREIGN KEY ', CONSTRAINT_NAME))
    FROM information_schema.TABLE_CONSTRAINTS 
    WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'chat_rooms' 
    AND CONSTRAINT_TYPE = 'FOREIGN KEY'
);

SET @sql = IF(@constraints IS NOT NULL, 
    CONCAT('ALTER TABLE chat_rooms ', @constraints),
    'SELECT "No foreign key constraints found on chat_rooms table"');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Drop unique constraint if it exists
SET @constraint_name = (
    SELECT CONSTRAINT_NAME 
    FROM information_schema.TABLE_CONSTRAINTS 
    WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'chat_rooms'
    AND CONSTRAINT_NAME = 'unique_chat_room'
    AND CONSTRAINT_TYPE = 'UNIQUE'
);

SET @sql = IF(@constraint_name IS NOT NULL,
    CONCAT('ALTER TABLE chat_rooms DROP INDEX ', @constraint_name),
    'SELECT "No unique constraint found"');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add back the foreign key constraints with ON DELETE CASCADE using unique names
ALTER TABLE chat_rooms
ADD CONSTRAINT fk_chat_rooms_book FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE,
ADD CONSTRAINT fk_chat_rooms_seller FOREIGN KEY (seller_id) REFERENCES users(id) ON DELETE CASCADE,
ADD CONSTRAINT fk_chat_rooms_buyer FOREIGN KEY (buyer_id) REFERENCES buyers(id) ON DELETE CASCADE;

-- Modify messages table to handle both user types
ALTER TABLE messages
ADD CONSTRAINT fk_messages_chat_room FOREIGN KEY (chat_room_id) REFERENCES chat_rooms(id) ON DELETE CASCADE;

-- Add unique constraint
ALTER TABLE chat_rooms
ADD CONSTRAINT unique_chat_room UNIQUE (book_id, seller_id, buyer_id); 