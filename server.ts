import { Application, Router } from "./deps.ts";
import { fetchActiveCalls } from "./ActiveCallsService.ts";
import { poll } from "./poll.ts";

const app = new Application();
const router = new Router();
const PORT = 8000;
const waitInSeconds = 30

app.use(router.routes);
app.listen({ port: PORT });

await poll(fetchActiveCalls,waitInSeconds);
