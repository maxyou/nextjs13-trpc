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
                return users.slice(); // Return a shallow copy of the whole array
              } else {
                return users.slice(0, input); // Return a shallow copy of the first n elements
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