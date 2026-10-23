<?php

namespace App\Repository;

use App\Entity\Booking;
use App\Entity\Property;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Booking>
 */
class BookingRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Booking::class);
    }

    /**
     * Vrai s'il existe déjà une réservation de cette annonce qui chevauche les dates demandées.
     */
    public function hasOverlap(Property $property, \DateTimeImmutable $start, \DateTimeImmutable $end): bool
    {
        $count = $this->createQueryBuilder('b')
            ->select('COUNT(b.id)')
            ->andWhere('b.property = :property')
            ->andWhere('b.startDate < :end')
            ->andWhere('b.endDate > :start')
            ->setParameter('property', $property)
            ->setParameter('start', $start, Types::DATE_IMMUTABLE)
            ->setParameter('end', $end, Types::DATE_IMMUTABLE)
            ->getQuery()
            ->getSingleScalarResult();

        return $count > 0;
    }
}