'use client'

import React from 'react';
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from '@/app/api/server/routers';

const ClientPage: React.FC = () => {

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
                    const user = await trpc.userList.query(4);
                    console.log(user);
                }}>click</button>            
        </div>
    )
}

export default ClientPage