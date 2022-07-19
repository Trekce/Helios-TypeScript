# This script sends a command through Moshell to get the productData from the radio.
# Argument 1: IP address for the BBU
# Argument 2: Integer value that refers to the specific RU object (eg. "1" to refer to RU-1)

MOSHELL_DIRECTORY=~/moshell
BBU_IP_ADDRESS=169.254.2.2
BBU_USERNAME=rbs
BBU_PASSWORD=rbs
RADIO_ID=1

cd $MOSHELL_DIRECTORY

./moshell -uv com_username=$BBU_USERNAME,com_password=$BBU_PASSWORD $BBU_IP_ADDRESS \
"lt all; get FieldReplaceableUnit=RU-${RADIO_ID}$ productData"
