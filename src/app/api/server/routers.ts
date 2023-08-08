import { publicProcedure, router } from './trpc';
import { z } from 'zod';

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
 
// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;