#!/bin/bash
hugo --minify
rsync -avh -e ssh public/ sorokya@richardleek.com:/var/www/html
