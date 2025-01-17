import { Container } from "inversify";
import { BlogService } from "@/services/blog.service";
import { BlogController } from "@/controllers/blog.controller";
import { InteractionService } from "@/services/interaction.service";
import { TYPES } from "@/types/types";
import { IBlogService, IInteractionService } from "@/interfaces/service.interface";
import { IBlogController, IInteractionController } from "@/interfaces/controller.interface";
import { InteractionController } from "@/controllers/interaction.controller";

const container = new Container();

// Services
container.bind<IBlogService>(TYPES.BlogService).to(BlogService);
container.bind<IInteractionService>(TYPES.InteractionService).to(InteractionService);

// Controllers
container.bind<IBlogController>(TYPES.BlogController).to(BlogController);
container.bind<IInteractionController>(TYPES.InteractionController).to(InteractionController);

export default container;

