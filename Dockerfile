FROM node:lts-buster

RUN apt-get update && \
  apt-get install -y \
  ffmpeg \
  imagemagick \
  webp && \
  apt-get upgrade -y && \
  rm -rf /var/lib/apt/lists/*

COPY package.json .

RUN npm install --save --production

COPY . .

EXPOSE 5000

CMD ["node", "--max-old-space-size=4096", "index.js"]