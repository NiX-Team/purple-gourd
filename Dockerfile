FROM node:latest
COPY node_modules /app/node_modules
COPY dist /app/dist
WORKDIR /app
EXPOSE 3001
CMD sleep 3 && node dist
