# ------ BUILD PHASE ------ #
# Add in base operating system image
FROM alpine
# create and set the new working director
WORKDIR '/app'
# Install some dependencies
RUN apk add --update nodejs
RUN apk add --update npm
# Copy package.json from local machine
COPY package*.json ./
# Install package.json dependencies
RUN npm install
# Copy files over
COPY . .
# execute
RUN npm run build
# ------ PRODUCTION PHASE ------ #
FROM nginx
# exposes port 80 for cloud provision
EXPOSE 3000
#copy nginx conf file over
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
# copy from the previous phase into nginx directory
COPY --from=0 /app/build /usr/share/nginx/html

