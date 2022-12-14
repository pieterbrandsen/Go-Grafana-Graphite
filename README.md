# Go-Grafana-Graphite

![MainWebsiteAlive](https://api.checklyhq.com/v1/badges/checks/3046095f-60de-4694-b807-871f973c6e44?style=flat&theme=dark)

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

| Important folder locations | Path |
| --- | ----------- |
| Grafana config  | /etc/grafana |
| Grafana data | /var/lib/grafana |
| Grafana log | /var/log/grafana |
| Go-carbon config file | /etc/go-carbon/go-carbon.conf |
| Go-carbon config folder | /conf |
| Go-carbon data | /graphite |
| Go-carbon log | /log |
| Carbonapi config file | /etc/carbonapi.yml |
| Carbonapi config folder | /conf |
| Carbonapi log | /log |
| Relay config | /conf |
| CustomApi logs | /app/logs |
| StatsGetter logs | /app/logs |

### Installation

Paste the following inside the terminal inside project root folder.

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
docker build -t carbon-api .
```

> daemon (linux) mode only

```bash
# give the folder all required permissions to sync folders, if not set it will give permission denied.
sudo chmod -R 777 .

# percentage of your RAM which can be left unwritten to disk. MUST be much more than
# your write rate, which is usually one FS block size (4KB) per metric.
sysctl -w vm.dirty_ratio=80

# percentage of yout RAM when background writer have to kick in and
# start writes to disk. Make it way above the value you see in `/proc/meminfo|grep Dirty`
# so that it doesn't interefere with dirty_expire_centisecs explained below
sysctl -w vm.dirty_background_ratio=50

# allow page to be left dirty no longer than 10 mins
# if unwritten page stays longer than time set here,
# kernel starts writing it out
sysctl -w vm.dirty_expire_centisecs=$(( 10*60*100 ))
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

Most settings are changeable in the `docker-compose.yml` file. Don't forget that some settings can be set at multiple places. There should be no need to change other files expect the `docker-compose.yml` file or `config` folder.

If you would like you can update the configuration files in the config folder. The configuration files are based on the default configuration files from the projects.

There are 3 telemetry dashboards included in `config/dashboards`. You can import them in Grafana when hosting it.

All logs will be exported to the `logs` folder.

### ServerStats

I have made an mod for collecting [ServerStats](https://github.com/The-International-Screeps-Bot/screepsmod-server-stats).

If you have installed this mod on your server extra api endpoints will become available.

To use this enable `IncludeServerStats` in the config which collects private server stats. There is an pre created dashboard at `exampleStats/serverStats`.

## Get support

Get uptime of last 7 days on [Checkly](https://screeps.checklyhq.com/)

Add an issue on github or contact me on `Discord` (PANDA#7722)
