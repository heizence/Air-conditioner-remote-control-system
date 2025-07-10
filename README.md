# ❄️ 에어컨 리모컨 시스템(백엔드)

## 1. 프로젝트 개요

이 프로젝트는 NestJS와 Docker를 기반으로 한 에어컨 리모컨 시스템의 백엔드 서버입니다. 사용자는 API를 통해 에어컨 제어 명령을 등록할 수 있으며, 실제 디바이스(시뮬레이터)는 주기적으로 서버에 새로운 명령을 요청(Polling)하여 작업을 수행합니다.

이 과제를 통해 비동기 처리, 상태 관리, 배치 작업(Scheduler) 등 백엔드 서버의 핵심적인 기능들을 구현하고 테스트하는 것을 목표로 합니다.

## 2. 주요 기능

### 👨‍💻 사용자 API (`/commands`)
- **명령 등록**: `POST /commands`를 통해 전원, 희망 온도, 모드, 풍속 등 다양한 에어컨 제어 명령을 등록합니다.
- **유효성 검증**: 요청된 명령 값의 유효성을 검증합니다 (예: 온도는 16~30도).
- **중복 방지**: 동일한 내용의 명령이 처리 대기 중일 경우, 중복 등록을 방지합니다.

### 🤖 디바이스 API (`/devices`)
- **명령 폴링**: `GET /devices/{id}/commands`를 통해 디바이스가 처리해야 할 `pending` 상태의 명령을 가져갑니다.
- **상태 업데이트**: 폴링 시, 해당 디바이스의 상태를 `online`으로 갱신하고 마지막 통신 시간(`lastPingAt`)을 기록합니다.

### 🕒 스케줄링 (배치 작업)
- **명령 만료 처리**: 등록 후 2분 이상 폴링되지 않은 명령은 `expired` 상태로 자동 변경됩니다.
- **디바이스 상태 점검**: 1분마다 모든 디바이스의 `lastPingAt`을 확인하여, 5분 이상 통신이 없는 디바이스는 `offline` 상태로 자동 변경됩니다.

## 3. 기술 스택

- **Framework**: NestJS, TypeScript
- **Database**: `node-json-db` (파일 기반 JSON 데이터베이스)
- **API Documentation**: Swagger (`@nestjs/swagger`)
- **Containerization**: Docker, Docker Compose
- **Scheduler**: `@nestjs/schedule`

## 4. 시작하기

### 사전 요구사항
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)이 설치되어 있어야 합니다.

### 설치

#### 1. 저장소를 로컬 컴퓨터에 복제(clone)
```bash
git clone <your-repository-url>
```

#### 2. 프로젝트 폴더로 이동
```bash
cd <project-directory>
```

#### 3. 환경변수 생성

프로젝트 root 경로에서 .env 파일을 생성하고 .env.example 에 있는 내용들을 붙여넣기 하여 값을 수정합니다.


#### 4. Docker 실행

Docker 이미지를 빌드하고 컨테이너를 백그라운드에서 실행합니다.

-d 옵션은 터미널을 차지하지 않고 백그라운드에서 실행하도록 합니다.

```bash
docker-compose up --build -d
```

#### 5. 서버 확인

http://localhost:{PORT} 로 접속하여 "Hello, world" 메시지가 잘 출력되는지 확인합니다.

API 문서 (Swagger UI): http://localhost:{PORT}/api

데이터는 프로젝트 루트에 생성되는 .json 파일에 저장됩니다. .json 파일 이름은 .env 에서 설정한 DB_FILENAME 입니다.
