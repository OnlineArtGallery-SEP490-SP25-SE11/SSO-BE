import { inject, injectable } from "inversify";
import { IInteractionController } from "@/interfaces/controller.interface";
import { InteractionService } from "@/services/interaction.service";
import { NextFunction, Request, Response } from "express";
import { BadRequestException } from "@/exceptions/http-exception";
import { BaseHttpResponse } from "@/lib/base-http-response";
import { TYPES } from "@/types/types";
import { IInteractionService } from "@/interfaces/service.interface";

@injectable()
export class InteractionController implements IInteractionController {
  constructor(
	@inject(TYPES.InteractionService) private readonly _interactionService: IInteractionService

  ) {}

  getUserInteractions = async (req: Request, res: Response, next: NextFunction) : Promise<any> => {
    try {
      const userId = req.userId;
      const blogId = req.params.blogId;
      if (!userId || !blogId) {
        throw new BadRequestException("Invalid request");
      }
		const interactions = await this._interactionService.getUserInteractions(
			userId,
			blogId
		);
		const response = BaseHttpResponse.success(
			interactions,
			200,
			'Get user interactions success'
		);
			return res.status(response.statusCode).json(response.data);
		} catch (error) {
			next(error);
		}
	};
}
