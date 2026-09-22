FROM node:20-alpine

WORKDIR /app

# Copy root and package files
COPY package.json ./
COPY client/package.json ./client/
COPY server/package.json ./server/
COPY prisma ./prisma/

# Install dependencies
RUN npm run install:all || (cd client && npm install) && (cd server && npm install)

# Copy source files
COPY client ./client
COPY server ./server

# Generate Prisma client & build
RUN cd server && npx prisma generate --schema=../prisma/schema.prisma
RUN cd server && npx prisma db push --schema=../prisma/schema.prisma
RUN cd server && npx tsx src/seed.ts
RUN cd client && npm run build
RUN cd server && npm run build

EXPOSE 5000

ENV NODE_ENV=production
ENV PORT=5000

CMD ["node", "server/dist/index.js"]
