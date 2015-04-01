#!/usr/bin/env bash

node lib/main_worker.js -w dao_proxy &
node lib/main_worker.js -w object_api &
node lib/main_worker.js -w type_api &
node lib/main_worker.js -w https_redirect &
node lib/main_worker.js -w swagger_def &
node lib/main_worker.js -w cloudlet_api &
node lib/main_worker.js -w attachments_api &
node lib/main_worker.js -w search_api &
node lib/main_worker.js -w permissions_api &
node lib/main_worker.js -w notifications &
node lib/main_worker.js -w auth_api &
node lib/main_worker.js -w crud_api &
node lib/main_worker.js -w openi_rrd &
node lib/main_worker.js -w openi_aggregator &
node lib/main_worker.js -w dao &
node lib/main_worker.js -w dao &
node lib/main_worker.js -w dao &