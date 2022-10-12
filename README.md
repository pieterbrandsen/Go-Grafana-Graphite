# Go-Grafana-Graphite

This is the repo to start an high performant Grafana + Graphite stack with Docker.

Don't forget to place an nice star on this repo if you like it.

## Requirements

- Docker
- Docker Compose
- Go
- Make

### Tech stack

- [Grafana-OSS (9.0.4)](https://grafana.com/grafana/download/9.0.4?platform=docker)
- [Go-carbon (latest)](https://github.com/go-graphite/go-carbon)
- [Carbon-api (0.15.6)](https://github.com/go-graphite/carbonapi/releases/tag/v0.15.6)
- [Carbon-relay-ng (latest)](https://github.com/grafana/carbon-relay-ng)
- [Stats-gateway (latest)](https://github.com/ScreepsPlus/stats-gateway)

## How to use

Logs for Grafana are currently non functional

| Important folder locations | Path |
| --- | ----------- |
| Grafana config  | /etc/grafana |
| Grafana data | /var/lib/grafana |
| Grafana log | /var/log/grafana |
| Go-carbon config file | /etc/go-carbon/go-carbon.conf |
| Go-carbon config folder | /conf |
| Go-carbon data | /go-carbon-storage |
| Go-carbon log | /log |
| Carbonapi config file | /etc/carbonapi.yml |
| Carbonapi config folder | /conf |
| Carbonapi log | /log |
| Relay config | /conf |
| CustomApi logs | /app/logs |
| StatsGetter logs | /app/logs |

### Installation

Build docker images

> Stats-Gateway image

```bash
git clone https://github.com/pieterbrandsen/stats-gateway
cd stats-gateway
docker build -t stats-gateway .
```

> Carbonapi image

```bash
git clone https://github.com/go-graphite/carbonapi --branch v0.15.6
cd carbonapi
docker build -t carbonapi .
```

### Run

Start with:

```bash
docker-compose up -d
```

Login with

- username: admin
- password: password

Its advised to change the password after login.

## Configuration

If you would like you can update the configuration files in the config folder. The configuration files are based on the default configuration files from the projects.

There are 2 telemetry dashboards included in `config/dashboards`. You can import them in Grafana when hosting it.

## Get support!

Add an issue on github or contact me on `Discord` (PANDA#7722)
