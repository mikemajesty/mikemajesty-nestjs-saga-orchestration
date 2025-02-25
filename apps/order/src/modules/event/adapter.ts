import {
  EventListInput,
  EventListOutput,
} from '@/core/event/use-cases/event-list';
import { IUsecase } from '@/utils/usecase';

export abstract class IEventListAdapter implements IUsecase {
  abstract execute(input: EventListInput): Promise<EventListOutput>;
}
