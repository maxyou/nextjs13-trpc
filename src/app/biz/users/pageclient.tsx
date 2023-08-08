'use client'

import React, { useState } from 'react';
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from '@/app/api/server/routers';

const ClientPage: React.FC = () => {

    const [newUser, setNewUser] = useState('');
    
    const handleAddUser = async () => {
        await trpc.userCreate.mutate({'name': newUser});
        setNewUser('');
      };

    // Pass AppRouter as generic here. 👇 This lets the `trpc` object know
    // what procedures are available on the server and their input/output types.
    const trpc = createTRPCProxyClient<AppRouter>({
        links: [
            httpBatchLink({
                url: 'http://localhost:3000/api/trpc',
            }),
        ],
    });

    return (
        <div>
            <div>Client Page</div>
            <button className='bg-blue-500 min-w-fit hover:bg-blue-700 text-white p-2 m-2 rounded'
                onClick={async () => {
                    // 👇 `trpc` has the same procedures as the server
                    const user = await trpc.userList.query(100);
                    console.log(user);
                }}>click</button>            
                  <div className="flex mb-4">
        <input
          type="text"
          className="border border-gray-300 p-2 rounded-md flex-grow"
          value={newUser}
          onChange={(e) => setNewUser(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault(); // Prevent form submission
              handleAddUser();
            }
          }}
        />
        <button
          className="bg-blue-500 text-white p-2 rounded-md ml-2"
          onClick={handleAddUser}
        >
          Add
        </button>
      </div>
        </div>
    )
}

export default ClientPage