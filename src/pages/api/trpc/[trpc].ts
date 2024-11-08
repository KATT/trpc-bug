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

  console.log('request')
  req.once('close', () => {
    console.log('req closed')
  })

  res.once('close', () => {
    console.log('res closed');
  })
  req.socket.once('close', () => {
    console.log('socket closed')
  })
  req.socket.once('end', () => {
    console.log('socket end');
  })
  req.once('aborted', () => {
    console.log('req abort');
  })
  req.once('pause', () => {
    console.log('---------pause')
  })
  return trpcHandler(req,res)
}

export default handler;