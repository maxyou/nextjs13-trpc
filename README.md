Try tRPC with next.js 13 app router.

## Key code

router
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


add router to server
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



client
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