#!/bin/bash
srsync -avh -e ssh _site/ sorokya@sorokya.us:/var/www/html
