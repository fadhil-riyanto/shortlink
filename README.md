## how to run (steps)

1. `git clone https://github.com/fadhil-riyanto/shortlink.git`
2. `cd shortlink`
3. `npm i prisma`
4. init database `npx prisma migrate dev`, make sure you have been change .env
5. run prisma client generation `npx prisma db push`
6. run our server (debugging) `npm run start_bloated`
7. run our server (faster, but lack of typescript error feature on runtime) `npm run start`

## Contribution, and issues
Contributions are welcome

## maintainer
@fadhil-riyanto

## license
GPL-2.0 license