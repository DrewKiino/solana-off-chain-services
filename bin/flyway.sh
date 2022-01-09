#!/bin/zsh

flyway -url=jdbc:mysql://0.0.0.0:3306/portal_labs_db \
  -user=root -password=password \
  -locations="filesystem:$(pwd)/sql/" \
  $1
