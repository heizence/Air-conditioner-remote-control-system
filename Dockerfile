# Docker 이미지를 생성하기 위한 설정 파일

# 1. 베이스 이미지 선택: 가볍고 안정적인 node 22-alpine 버전을 사용합니다.
FROM node:22-alpine

# 2. 작업 디렉토리 설정: 컨테이너 내부에서 작업할 폴더를 지정합니다.
WORKDIR /usr/src/app

# 3. 의존성 파일 복사: package.json과 package-lock.json을 먼저 복사합니다.
#    이렇게 하면 소스코드가 변경되어도 매번 npm install을 다시 하지 않아 효율적입니다.
COPY package*.json ./

# 4. 의존성 설치: 복사된 package.json을 바탕으로 npm install을 실행합니다.
RUN npm install

# 5. 소스코드 복사: 프로젝트의 모든 파일을 작업 디렉토리로 복사합니다.
COPY . .

# 6. 앱 실행: 개발 모드로 NestJS 애플리케이션을 시작합니다.
CMD ["npm", "run", "start:dev"]