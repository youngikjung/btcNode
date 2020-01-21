# bitcoin core 연동 project

---

## About

This is a starter boilerplate app I've put together using the following technologies:

* [Express](http://expressjs.com)
* [node-bitcoin-rpc](https://www.npmjs.com/package/node-bitcoin-rpc)

## Installation

```bash
npm install
```

## Running Server

```bash
forever start -l /data/bitcoin_core server --minUptime 5000 --spinSleepTime 2000 bitServer.js
```

## Explanation

비트코인 코어 설치후 node-bitcoin-rpc를 이용하여 데이터를 get,post방식으로 호출 할 수 있다.
=======


