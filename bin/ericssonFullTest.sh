#!/bin/sh

MOSHELL_DIRECTORY=~/moshell
BBU_IP_ADDRESS=169.254.2.2
BBU_USERNAME=rbs
BBU_PASSWORD=rbs
RADIO_ID=1
TEST_MESSAGE="WWT Software Test"
SFP_PORT=A

cd $MOSHELL_DIRECTORY

./moshell -uv com_username=$BBU_USERNAME,com_password=$BBU_PASSWORD $BBU_IP_ADDRESS \
"lt all; get FieldReplaceableUnit=RU-${RADIO_ID}$ productData; \
get RiLink=${RADIO_ID}_ linkRate; get FieldReplaceableUnit=1,SfpModule=$SFP_PORT productData; get FieldReplaceableUnit=RU-$RADIO_ID,SfpModule=DATA_1 productData; \
acc FieldReplaceableUnit=RU-${RADIO_ID}$ restartUnit; 0; 0; $TEST_MESSAGE; get FieldReplaceableUnit=RU-${RADIO_ID}$ operationalIndicator" #\
#| grep -e 'FieldReplaceableUnit=RU-1' -e 'FieldReplaceableUnit=1' -e '>>> ' -e 'RiLink=' \
#| grep -v -e '453PC929E>' -e '>>> R' -e 'restartUnit'
