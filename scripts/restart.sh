#!/bin/bash
set -o errexit
set -o verbose

# restart API server
killall -9 mci_api_server || true
GOMAXPROCS=3 nohup $mci_home/bin/mci_api_server -conf /data/home/etc/mci_settings.yml >& $mci_home/logs/mci_api_server_nohup.log &

# restart UI server
killall -9 mci_ui_server || true
GOMAXPROCS=3 nohup $mci_home/bin/mci_ui_server -conf /data/home/etc/mci_settings.yml >& $mci_home/logs/mci_ui_server_nohup.log &