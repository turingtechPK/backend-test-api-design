// This module helps in organizing environment variables, and provides following advantages:
// 1- Helps in renaming the variable
// 2- Helps in maping the variables and seeing if missed some variable. This can be done with unit test cases

import { registerAs } from '@nestjs/config'
import { IDb, IGithub, IServer } from './env.config.interface'

export const db = registerAs(
    'db',
    (): IDb => ({
        connectionUrl:process.env.DB_URL,
    })
)

export const server = registerAs(
    'server',
    (): IServer => ({
        port: parseInt(process.env.PORT),
    })
)

export const github = registerAs(
    'github',
    (): IGithub => ({
        githubToken:process.env.GITHUB_TOKEN,
    })
)
// export const root = registerAs(
//     'root',
//     (): IRoot => ({
//         env: process.env.NODE_ENV,
//     })
// )