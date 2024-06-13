# Docker descriptor for codbex-petstore
# License - http://www.eclipse.org/legal/epl-v20.html

FROM dirigiblelabs/dirigible:latest

COPY codbex-athena target/dirigible/repository/root/registry/public/codbex-athena

ENV DIRIGIBLE_HOME_URL=/services/web/codbex-athena/index.html
