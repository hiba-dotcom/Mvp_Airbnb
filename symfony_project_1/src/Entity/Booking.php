<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiProperty;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\Post;
use App\Repository\BookingRepository;
use App\State\BookingProcessor;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;
use ApiPlatform\Metadata\GetCollection;

#[ApiResource(
    operations: [
         new GetCollection(),
        new Get(security: 'object.getGuest() == user or object.getProperty().getOwner() == user'),
        new Post(processor: BookingProcessor::class),
        new Delete(security: 'object.getGuest() == user'),
    ],
)]
#[ORM\Entity(repositoryClass: BookingRepository::class)]
class Booking
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: false)]
    #[Assert\NotNull]
    private ?Property $property = null;

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: false)]
    #[ApiProperty(writable: false)]
    private ?User $guest = null;

    #[ORM\Column(type: Types::DATE_IMMUTABLE)]
    #[Assert\NotNull]
    #[Assert\GreaterThanOrEqual('today')]
    private ?\DateTimeImmutable $startDate = null;

    #[ORM\Column(type: Types::DATE_IMMUTABLE)]
    #[Assert\NotNull]
    #[Assert\GreaterThan(propertyPath: 'startDate', message: 'La date de fin doit être après la date de début.')]
    private ?\DateTimeImmutable $endDate = null;

    #[ORM\Column]
    #[ApiProperty(writable: false)]
    private ?int $totalPrice = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getProperty(): ?Property
    {
        return $this->property;
    }

    public function setProperty(?Property $property): static
    {
        $this->property = $property;

        return $this;
    }

    public function getGuest(): ?User
    {
        return $this->guest;
    }

    public function setGuest(?User $guest): static
    {
        $this->guest = $guest;

        return $this;
    }

    public function getStartDate(): ?\DateTimeImmutable
    {
        return $this->startDate;
    }

    public function setStartDate(\DateTimeImmutable $startDate): static
    {
        $this->startDate = $startDate;

        return $this;
    }

    public function getEndDate(): ?\DateTimeImmutable
    {
        return $this->endDate;
    }

    public function setEndDate(\DateTimeImmutable $endDate): static
    {
        $this->endDate = $endDate;

        return $this;
    }

    public function getTotalPrice(): ?int
    {
        return $this->totalPrice;
    }

    public function setTotalPrice(int $totalPrice): static
    {
        $this->totalPrice = $totalPrice;

        return $this;
    }
}