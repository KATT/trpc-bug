import { procedure, router } from "../trpc";

import { on, EventEmitter } from "events";

export const events = new EventEmitter();

let idx = 0;

export const appRouter = router({
  loopBased: procedure.subscription(async function* ({ signal }) {
    let id = idx++

    let count = 0;
    try {
      while (!signal?.aborted) {
        console.log("loop", id, signal);

        yield `new data (count: ${count}, sub id: ${id})`;
        await new Promise((r) => setTimeout(r, 1000));
      }
      console.log('✅ done', id)
    } catch (error) {
      console.error("error", idx, error);
    }
  }),
});

// export type definition of API
export type AppRouter = typeof appRouter;
