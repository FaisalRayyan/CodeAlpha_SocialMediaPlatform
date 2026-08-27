FROM node:22-alpine AS client-build
WORKDIR /app/client
COPY client/package*.json ./
RUN npm install
COPY client/ ./
RUN npm run build

FROM node:22-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
COPY server/package*.json ./server/
RUN npm install --prefix server --omit=dev
COPY server/ ./server/
COPY --from=client-build /app/client/dist ./client/dist
ENV SERVE_CLIENT=true
EXPOSE 5000
CMD ["npm", "start", "--prefix", "server"]
