import * as trpcNext from "@trpc/server/adapters/next";
import { appRouter } from "../../../server/routers/_app";
import * as next from 'next'

export async function createContext({
  req,
  res,
}: trpcNext.CreateNextContextOptions) {
  return { req, res };
}

export type Context = Awaited<ReturnType<typeof createContext>>;

const trpcHandler = trpcNext.createNextApiHandler({
  router: appRouter,
  createContext,
  onError: (opts) => {
    console.error('onError handler', opts.error)
  }
});
const handler: next.NextApiHandler = (req, res) => {

  req.once('close', () => {
    console.log('req');
  });
  req.socket.on('close', () => {
    console.log('socket close');
  });
  req.socket.on('end', () => {
    console.log('socket end');
  });
  req.socket.on('error', (err) => {
    console.error('socket error', err);
  });
  req.socket.on('timeout', () => {
    console.log('socket timeout');
  });
  req.once('aborted', () => {
    console.log('req aborted');
  });
  return trpcHandler(req,res)
}

export default handler;