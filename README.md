Try tRPC with next.js 13 app router.

## Key code

server router
```typescript
const users = 
    ["user1", "user2", "user3"];

export const appRouter = router({
    
    userList: 
        publicProcedure
        .input(z.number())
        .query(async ({input}) => {
            if (input >= users.length) {
                // Return a shallow copy of the whole array
                return users.slice(); 
              } else {
                // Return a shallow copy of the first n elements
                return users.slice(0, input); 
              }
        }),
    
    userCreate: 
        publicProcedure
        .input(z.object({ name: z.string() }))
        .mutation(async (opts) => {
            const { input } = opts;               
            // Create a new user in the database
            users.push(input.name);
            return users;
        }),
});
 
export type AppRouter = typeof appRouter;
```


add server router to http server
```typescript
import {
    FetchCreateContextFnOptions,
    fetchRequestHandler,
  } from "@trpc/server/adapters/fetch";

  import { appRouter } from "../../server/routers";

  const handler = (request: Request) => {
    console.log(`incoming request ${request.url}`);
    return fetchRequestHandler({
      endpoint: "/api/trpc",
      req: request,
      router: appRouter,
      createContext: function (
        opts: FetchCreateContextFnOptions
      ): object | Promise<object> {
        return {};
      },
    });
  };
  
  export { handler as GET, handler as POST };
```

client get type from server
```typescript
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from '@/app/api/server/routers';

  // Pass AppRouter as generic here. 👇 This lets the `trpc` object know
  // what procedures are available on the server and their input/output types.
  const trpc = createTRPCProxyClient<AppRouter>({
    links: [
      httpBatchLink({
        url: 'http://localhost:3000/api/trpc',
      }),
    ],
  });
```

client query from server
```typescript
  const handleGetUsers = async () => {
    const users = await trpc.userList.query(100);
    console.log(users);
    setTotalUsers(users);
  };

  const handleAddUser = async () => {
    await trpc.userCreate.mutate({ 'name': newUser });
    setNewUser('');
  };
```