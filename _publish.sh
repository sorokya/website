#!/bin/bash
cobalt build
rsync -avh -e ssh _site/ sorokya@richardleek.com:/var/www/html
