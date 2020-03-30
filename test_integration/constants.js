const EMPTY_ADDRESS = '0x0000000000000000000000000000000000000000';
//const url = "https://en.wikipedia.org/api/rest_v1/page/random/title";
const url = "https://en.wikipedia.org/api/rest_v1/page/title/Investing";
const path = ["items", "0", "title"];

//ROPSTEN TESTNET ADDRESS
const chainlinkTokenAddress = "0x20fE562d797A42Dcb3399062AE9546cd06f63280";
const chainlinkOracleAddress = "0xc99B3D447826532722E41bc36e644ba3479E4365";
const CHAINLINK_HTTP_GET_JSON_PARSE_JOB_ID = "76ca51361e4e444f8a9b18ae350a5725";
const PAYMENT = 1;

module.exports = {
  EMPTY_ADDRESS,
  url,
  path,
  chainlinkTokenAddress,
  chainlinkOracleAddress,
  CHAINLINK_HTTP_GET_JSON_PARSE_JOB_ID,
  PAYMENT
} 