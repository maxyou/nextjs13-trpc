'use client'

import React from 'react';
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from '@/app/api/server';

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
            <button
                onClick={async () => {
                    // 👇 `trpc` has the same procedures as the server
                    const user = await trpc.userList.query(3);
                    console.log(user);
                }}>click</button>
            <div>Client Page</div>
        </div>
    )
}

export default ClientPage