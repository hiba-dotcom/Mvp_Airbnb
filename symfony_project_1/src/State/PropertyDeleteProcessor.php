<?php

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use App\Entity\Property;
use App\Repository\BookingRepository;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\HttpKernel\Exception\ConflictHttpException;

/**
 * @implements ProcessorInterface<Property, void>
 */
final class PropertyDeleteProcessor implements ProcessorInterface
{
    public function __construct(
        #[Autowire(service: 'api_platform.doctrine.orm.state.remove_processor')]
        private ProcessorInterface $processor,
        private BookingRepository $bookingRepository,
    ) {
    }

    public function process(mixed $data, Operation $operation, array $uriVariables = [], array $context = []): mixed
    {
        if ($data instanceof Property && $this->bookingRepository->count(['property' => $data]) > 0) {
            throw new ConflictHttpException('Cette annonce a des réservations : elle ne peut pas être supprimée.');
        }

        return $this->processor->process($data, $operation, $uriVariables, $context);
    }
}