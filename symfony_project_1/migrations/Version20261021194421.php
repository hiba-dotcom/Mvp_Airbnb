<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20261021194421 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE booking (id INT AUTO_INCREMENT NOT NULL, start_date DATE NOT NULL, end_date DATE NOT NULL, total_price INT NOT NULL, property_id INT NOT NULL, guest_id INT NOT NULL, INDEX IDX_E00CEDDE549213EC (property_id), INDEX IDX_E00CEDDE9A4AA658 (guest_id), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('ALTER TABLE booking ADD CONSTRAINT FK_E00CEDDE549213EC FOREIGN KEY (property_id) REFERENCES property (id)');
        $this->addSql('ALTER TABLE booking ADD CONSTRAINT FK_E00CEDDE9A4AA658 FOREIGN KEY (guest_id) REFERENCES user (id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE booking DROP FOREIGN KEY FK_E00CEDDE549213EC');
        $this->addSql('ALTER TABLE booking DROP FOREIGN KEY FK_E00CEDDE9A4AA658');
        $this->addSql('DROP TABLE booking');
    }
}
