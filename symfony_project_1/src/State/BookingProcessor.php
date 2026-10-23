<?php

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use App\Entity\Booking;
use App\Entity\User;
use App\Repository\BookingRepository;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\HttpKernel\Exception\ConflictHttpException;

/**
 * @implements ProcessorInterface<Booking, Booking|void>
 */
final class BookingProcessor implements ProcessorInterface
{
    public function __construct(
        #[Autowire(service: 'api_platform.doctrine.orm.state.persist_processor')]
        private ProcessorInterface $processor,
        private Security $security,
        private BookingRepository $bookingRepository,
    ) {
    }

    public function process(mixed $data, Operation $operation, array $uriVariables = [], array $context = []): mixed
    {
        if ($data instanceof Booking) {
            if ($this->bookingRepository->hasOverlap($data->getProperty(), $data->getStartDate(), $data->getEndDate())) {
                throw new ConflictHttpException('Ces dates ne sont plus disponibles pour cette annonce.');
            }

            $user = $this->security->getUser();

            if ($user instanceof User) {
                $data->setGuest($user);
            }

            $nights = $data->getStartDate()->diff($data->getEndDate())->days;
            $data->setTotalPrice($nights * $data->getProperty()->getPricePerNight());
        }

        return $this->processor->process($data, $operation, $uriVariables, $context);
    }
}