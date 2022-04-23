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
  const waitTimeMillis = waitTimeSeconds * 1000;
  let shouldContinue = true;
  let lastCalls = await fn();
  let newCalls: ActiveCall[] = []

  while (shouldContinue) {
    try {
      const activeCalls = await fn();
      if (activeCalls[0].TimeReceived > lastCalls[0].TimeReceived) {
        // set newCalls to those more recent than the most recent lastCall 
        newCalls = activeCalls.filter(c=>c.TimeReceived > lastCalls[0].TimeReceived)
        console.log(`new calls ` + JSON.stringify(newCalls))
        lastCalls = activeCalls;
      }
      // Sleep
      await new Promise((resolve) => setTimeout(resolve, waitTimeMillis));
    } catch (e) {
      console.log(e);
      shouldContinue = false;
    }
  }
}
