import { Application, Router } from "https://deno.land/x/oak@v7.4.0/mod.ts";
import { fetchActiveCalls } from "./ActiveCallsService.ts";
import { poll } from "./poll.ts";

const app = new Application();
const router = new Router();
const PORT = 8000;

app.use(router.routes);
app.listen({ port: PORT });

await poll(fetchActiveCalls,1);
