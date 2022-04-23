import { ActiveCall } from "./ActiveCall.ts";

/**
 * @param fn - the function to execute every X minutes
 * @param waitTimeSeconds - the amount of seconds to wait before function
 * invocations
 */
export async function poll(
  fn: () => Promise<ActiveCall[]>,
  waitTimeSeconds: number
) {
  const waitTimeMillis = waitTimeSeconds * 5000;
  let shouldContinue = true;
  let lastCalls = await fn();
  console.log(`initial calls: ${JSON.stringify(lastCalls.filter(x=>x.TimeReceived))}`)
  let tries = 0;
  while (shouldContinue) {
    console.log("try " + tries++);
    try {
      const activeCalls = await fn();
      // TODO:Recur this
      if (activeCalls[0].TimeReceived !== lastCalls[0].TimeReceived) {
        console.log("active: "+activeCalls[0]);
        console.log("last: "+lastCalls[0]);
        lastCalls = activeCalls;
        console.log(activeCalls);
      } else {
        console.log("no new calls...");
      }
      // Sleep
      await new Promise((resolve) => setTimeout(resolve, waitTimeMillis));
      console.log("promise resolved...done sleeping");
    } catch (e) {
      console.log(e);
      shouldContinue = false;
    }
  }
}
