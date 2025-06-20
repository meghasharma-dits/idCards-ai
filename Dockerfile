FROM node:20 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . ./
RUN npm run build --configuration=production
FROM nginx:latest
COPY --from=build /app/dist/invoice-ai/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 8082
CMD ["nginx", "-g", "daemon off;"]
