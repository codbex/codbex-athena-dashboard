# Docker descriptor for codbex-petstore
# License - http://www.eclipse.org/legal/epl-v20.html

FROM ghcr.io/codbex/codbex-atlas:0.36.0

COPY codbex-athena target/dirigible/repository/root/registry/public/codbex-athena

ENV DIRIGIBLE_HOME_URL=/services/web/codbex-athena/index.html
