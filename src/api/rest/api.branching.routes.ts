import { Router } from "express";

import UserRouter from "../../components/users/user.routes";

const router: Router = Router();

router.use("/users", UserRouter);

export default router;
