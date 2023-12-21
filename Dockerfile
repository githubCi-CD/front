# base로 쓸 node버전
FROM node:16.18.0

# root 에 app 폴더를 생성
RUN mkdir /app

# work dir 고정
WORKDIR /app

# package.json 과 package-lock.json 복사
COPY package*.json ./

# npm으로 package들 Install
RUN npm install

# 컨테이너로 리액트 app 복사
COPY . .

# 리액트 app 빌드
RUN npm run build

# 실행시킬 포트번호
EXPOSE 3001

# run할 때 쓸 명령어
CMD ["npm", "start"]