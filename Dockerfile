FROM node:18-alpine as build-stage
ARG DATA_BASE_URL
ARG CORS_URL
WORKDIR /usr/app
COPY . .
RUN npm i
RUN DATA_BASE_URL=$DATA_BASE_URL CORS_URL=$CORS_URL npm run build

FROM node:18-alpine as production-stage
WORKDIR /usr/app
# FIXME: copy node_modules
COPY --from=build-stage /usr/app /usr/app
EXPOSE 3000
CMD ["node", "dist/src/main"]
