-- Add status column to books table
ALTER TABLE books
ADD COLUMN status ENUM('AVAILABLE', 'SOLD', 'PENDING') DEFAULT 'AVAILABLE' AFTER listingType,
ADD COLUMN approvedBuyerId INT AFTER status,
ADD FOREIGN KEY (approvedBuyerId) REFERENCES buyers(id) ON DELETE SET NULL; 