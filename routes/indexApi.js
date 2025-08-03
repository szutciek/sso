import { Router } from "express";
const apiRouter = Router();

import userRouter from "./userApi.js";
import developerRouter from "./developerApi.js";
import appRouter from "./appApi.js";

apiRouter.use("/users", userRouter);
apiRouter.use("/developers", developerRouter);
apiRouter.use("/apps", appRouter);

export default apiRouter;
