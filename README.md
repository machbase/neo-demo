# neo-demo

Machbase Neo JSH runtime에서 동작하는 간단한 예제 패키지입니다. `demo` 엔트리 포인트를 통해 CLI 명령을 실행하고, HTTP 서버 실행과 Mach CLI 조회 같은 기본 예제를 빠르게 확인할 수 있습니다.

## 설치

JSH에서 아래 명령으로 `demo`를 설치합니다.

```sh
pkg install -g github.com/machbase/neo-demo
```

## 포함된 예제

- `demo hello [name]`: 간단한 인사 출력
- `demo argv [value]`: 전달된 인자 확인
- `demo server --port <port>`: 예제 HTTP 서버 실행
- `demo server-install --port <port>`: 서버 스크립트를 서비스로 등록
- `demo machcli-query`: Machbase 조회 예제 실행
- `demo mustache [options]`: npm package dependency 로 설치한 Mustache를 JSH에서 불러와 렌더링하는 예제
- `demo readline [--auto <text>]`: `readline` 입력 예제 실행

`demo mustache` 는 이 저장소에서 외부 npm dependency 사용 가능 여부를 확인하기 위한 데모로,
`pkg install` 로 설치된 npm dependency 가 JSH 런타임에서 실제로 `require('mustache')` 되어 동작하는지 확인하는 용도입니다.

## 실행 예시

```sh
machbase-neo jsh main.js hello Neo
machbase-neo jsh main.js argv sample
machbase-neo jsh main.js server --port 7575
machbase-neo jsh main.js mustache --name Neo --topic "npm package demo"
machbase-neo jsh main.js readline --auto "hello neo"
```

## 파일 구성

- `main.js`: 명령 라우팅 엔트리 포인트
- `hello.js`, `argv.js`: 기본 CLI 예제
- `server.js`: HTTP API 예제
- `server_install.js`: 서비스 설치 예제
- `machcli_query.js`: Mach CLI 조회 예제
- `mustache_demo.js`: npm dependency Mustache 로 템플릿 렌더링을 검증하는 예제
- `readline.js`: readline 입력 예제
