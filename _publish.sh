#!/bin/bash
cobalt build
rsync -avh -e ssh _site/ sorokya@sorokya.us:/var/www/html
