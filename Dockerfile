FROM node:18-alpine as build-stage
ARG DATA_BASE_URL
ARG CORS_URL
WORKDIR /usr/app
COPY . .
RUN npm i
RUN npm run build

FROM node:18-alpine as production-stage
ENV NODE_ENV=production
WORKDIR /usr/app
# FIXME: copy node_modules
COPY --from=build-stage /usr/app /usr/app
EXPOSE 3000
CMD ["node", "dist/main"]
