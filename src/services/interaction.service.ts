import { injectable } from 'inversify';
import { IInteractionService } from '@/interfaces/service.interface';
import { InteractionType } from '@/constants/enum';
import { InternalServerErrorException } from '@/exceptions/http-exception';
import { logger } from '@typegoose/typegoose/lib/logSettings';
import interactionModel from '@/models/interaction.model';

@injectable()
export class InteractionService implements IInteractionService {
	constructor() {}

	getUserInteractions = async (
		userId: string,
		blogId: string
	): Promise<{
		hearted: boolean;
	}> => {
		try {
			const hearted = await interactionModel.findOne({
				userId,
				blogId,
				type: InteractionType.HEART
			});
			return {
				hearted: hearted ? true : false
			};
		} catch (error) {
			logger.error(error, 'Error getting user interactions');
			throw new InternalServerErrorException(
				'Error getting user interactions'
			);
		}
	};
}
