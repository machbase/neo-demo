# neo-demo

Machbase Neo JSH runtime에서 동작하는 간단한 예제 패키지입니다. `demo` 엔트리 포인트를 통해 CLI 명령을 실행하고, HTTP 서버 실행과 Mach CLI 조회 같은 기본 예제를 빠르게 확인할 수 있습니다.

## 설치

JSH에서 아래 명령으로 `demo`를 설치합니다.

```sh
pkg copy github.com/machbase/neo-demo /work/public/demo
```

![install](./docs/neo-demo-install.jpg)

설치가 완료되면 설치한 디렉터리 이름(이 예에서는 `demo`)이 명령어가 됩니다.

```
demo -h
```

![help](./docs/neo-demo-help.jpg)

## 포함된 예제

- `demo hello [name]`: 간단한 인사 출력
- `demo argv [value]`: 전달된 인자 확인
- `demo server --port <port>`: 예제 HTTP 서버 실행 및 JSH service proxy 기본 등록
  - `/`, `/greeting`, `/system`, `/todo`, `/healthz` 엔드포인트를 확인할 수 있습니다.
  - 기본적으로 JSH service proxy 를 등록해서 `/web/services/<service-name>/<proxy-prefix>/` 경로로 같은 웹 앱을 reverse proxy 합니다.
  - 서버 시작 로그에 직접 연결 주소와 Neo web proxy 연결 주소가 함께 출력됩니다.
  - proxy 등록 없이 HTTP 서버만 확인하려면 `--no-proxy` 를 사용할 수 있습니다.
- `demo server-install --port <port>`: 서버 스크립트를 service proxy 옵션과 함께 서비스로 등록
- `demo machcli-query`: Machbase 조회 예제 실행
- `demo mustache [options]`: npm package dependency 로 설치한 Mustache를 JSH에서 불러와 렌더링하는 예제
- `demo readline [--auto <text>]`: `readline` 입력 예제 실행

`demo mustache` 는 이 저장소에서 외부 npm dependency 사용 가능 여부를 확인하기 위한 데모로,
`pkg copy` 로 설치된 `demo` 애플리케이션의 npm dependency 가 JSH 런타임에서 실제로 `require('mustache')` 되어 동작하는지 확인하는 용도입니다.

다른 JSH 패키지를 작성할 때도 같은 기준으로 판단할 수 있습니다.

- 데모, 튜토리얼, CLI, 서버처럼 실행 결과를 그대로 재현하는 것이 중요한 패키지는 `package-lock.json` 을 저장소에 포함하는 편이 좋습니다.
- 여러 개발자가 같은 예제를 따라 하거나 문서의 실행 결과를 검증해야 한다면 lockfile 공유가 기본값에 가깝습니다.
- 반대로 다른 애플리케이션이 가져다 쓰는 범용 라이브러리 패키지라면 `package-lock.json` 을 꼭 배포 기준으로 삼을 필요는 없고, 의존성 범위를 어떻게 열어둘지 정책을 먼저 정하는 편이 낫습니다.
- 어느 경우든 `node_modules/` 는 저장소에 포함하지 않고, lockfile 을 포함할지 제외할지만 별도로 결정하면 됩니다.

## 실행 예시

- hello

```sh
demo hello Neo
```

![hello](./docs/neo-demo-hello.jpg)


- mustache

```sh
demo mustache --name Neo --topic "npm package demo"
```

![mustache](./docs/neo-demo-mustache.jpg)

- web server and frontend

```
demo server --port 7575
```

서버를 실행하면 HTTP 서버가 시작되고, 기본적으로 `service.proxy.register()` 를 호출해서 `http://127.0.0.1:7575` 로 들어오는 로컬 서버를 Neo 웹 경로에 노출합니다. 브라우저에서 `http://127.0.0.1:7575/` 로 직접 접속하면 엔드포인트 목록 페이지를 볼 수 있고, `http://127.0.0.1:7575/todo` 에서는 Mustache 템플릿으로 렌더링되는 간단한 웹 TODO 예제를 확인할 수 있습니다.

시작 로그에는 아래처럼 테스트에 바로 사용할 수 있는 URL 이 출력됩니다.

```text
direct connection: http://127.0.0.1:7575/
proxy connection: http://127.0.0.1:5654/web/services/github.com/machbase/neo-demo/server/demo/
```

Neo web 포트가 5654가 아니면 `--neo-web-port <port>` 로 출력되는 proxy 연결 주소를 맞출 수 있습니다.

서비스로 실행하면서 Machbase Neo 웹 경로 아래의 reverse proxy 동작을 확인하려면 서비스를 등록합니다. 등록된 서비스도 같은 기본 proxy 설정으로 시작됩니다.

```sh
demo server-install --port 7575
```

기본 proxy 공개 경로는 아래와 같습니다.

```text
/web/services/github.com/machbase/neo-demo/server/demo/
```

Neo 웹 UI 또는 같은 origin의 브라우저에서 위 경로에 접속하면 `/greeting`, `/system`, `/todo`, `/static/...` 요청이 모두 서비스 서버로 전달됩니다. service name과 prefix를 바꾸려면 `--service-name <name>` 과 `--proxy-prefix <prefix>` 를 사용할 수 있습니다.

![server](./docs/neo-demo-server.jpg)


## 파일 구성

- `main.js`: 명령 라우팅 엔트리 포인트
- `demos/hello/index.js`: 기본 인사 출력 예제
- `demos/argv/index.js`: argv 확인 예제
- `demos/server/index.js`: HTTP API 예제
- `demos/server/home.mustache.html`: `/` 엔드포인트 템플릿
- `demos/server/todo.mustache.html`: `/todo` 엔드포인트 템플릿
- `demos/server/install.js`: service proxy 옵션을 포함한 서비스 설치 예제
- `demos/machcli/query.js`: Mach CLI 조회 예제
- `demos/machcli/machcli.json`: Mach CLI 연결 설정 예제
- `demos/mustache/index.js`: npm dependency Mustache 렌더링 예제
- `demos/readline/index.js`: readline 입력 예제

## 디렉터리 구성 원칙

데모 수가 늘어날 때 파일 관리가 직관적이도록 각 예제는 `demos/<demo-name>/` 아래에 관련 스크립트와 설정, 템플릿 파일을 함께 둡니다. 예를 들어 서버 데모는 실행 스크립트와 설치 스크립트, HTML 템플릿을 모두 `demos/server/` 아래에서 관리합니다.
