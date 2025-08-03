import { Router } from "express";
const apiRouter = Router();

import userRouter from "./userApiRouter.js";
import developerRouter from "./developerApiRouter.js";
import appRouter from "./appApiRouter.js";

apiRouter.use("/users", userRouter);
apiRouter.use("/developers", developerRouter);
apiRouter.use("/apps", appRouter);

export default apiRouter;
