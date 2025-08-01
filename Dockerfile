FROM node:18-alpine

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /usr/src/app

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

# Declare build arguments
ARG NEXT_PUBLIC_FRONTEND_URL
ARG NEXT_PUBLIC_PHONE_NUMBER

# Pass the arguments to environment variables
ENV NEXT_PUBLIC_FRONTEND_URL=$NEXT_PUBLIC_FRONTEND_URL
ENV NEXT_PUBLIC_PHONE_NUMBER=$NEXT_PUBLIC_PHONE_NUMBER

COPY . .

RUN pnpm run build

EXPOSE 3000

CMD ["pnpm", "start"]
