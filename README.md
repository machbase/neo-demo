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
  - `/`, `/greeting`, `/system`, `/todo` 엔드포인트를 확인할 수 있습니다.
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

서버를 실행한 뒤 브라우저에서 `http://127.0.0.1:7575/` 로 접속하면 엔드포인트 목록 페이지를 볼 수 있고, `http://127.0.0.1:7575/todo` 에서는 Mustache 템플릿으로 렌더링되는 간단한 웹 TODO 예제를 확인할 수 있습니다.

## 파일 구성

- `main.js`: 명령 라우팅 엔트리 포인트
- `demos/hello/index.js`: 기본 인사 출력 예제
- `demos/argv/index.js`: argv 확인 예제
- `demos/server/index.js`: HTTP API 예제
- `demos/server/home.mustache.html`: `/` 엔드포인트 템플릿
- `demos/server/todo.mustache.html`: `/todo` 엔드포인트 템플릿
- `demos/server/install.js`: 서비스 설치 예제
- `demos/machcli/query.js`: Mach CLI 조회 예제
- `demos/machcli/machcli.json`: Mach CLI 연결 설정 예제
- `demos/mustache/index.js`: npm dependency Mustache 렌더링 예제
- `demos/readline/index.js`: readline 입력 예제

## 디렉터리 구성 원칙

데모 수가 늘어날 때 파일 관리가 직관적이도록 각 예제는 `demos/<demo-name>/` 아래에 관련 스크립트와 설정, 템플릿 파일을 함께 둡니다. 예를 들어 서버 데모는 실행 스크립트와 설치 스크립트, HTML 템플릿을 모두 `demos/server/` 아래에서 관리합니다.
